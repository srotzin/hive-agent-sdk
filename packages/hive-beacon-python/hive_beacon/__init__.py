"""
hive-beacon — Python middleware for FastAPI (Starlette) and Flask
Stamps Hive Civilization beacon headers on every response.
One-line install. Your MCP server joins the Hive network automatically.

See: https://www.thehiveryiq.com
"""

from __future__ import annotations

import json
import logging
import threading
from typing import Any, Callable, Dict, Optional
from urllib.error import URLError
from urllib.request import Request, urlopen

__version__ = "1.0.0"
__all__ = ["HiveBeacon", "init_flask_beacon"]

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

HIVE_HEADERS: Dict[str, str] = {
    "x-hive-did": "did:hive:hiveforce-ambassador",
    "x-hive-network": "59-services | thehiveryiq.com",
    "x-hive-onboard": "https://hivegate.onrender.com/v1/gate/onboard",
    "x-hive-pulse": "https://hiveforge-lhu4.onrender.com/.well-known/hive-pulse.json",
    "x-hive-docs": "https://hiveforge-lhu4.onrender.com/llms.txt",
    "x-hive-mcp": "https://hivegate.onrender.com/mcp",
    "x-hive-first-did-free": "true",
    "x-hive-earn-now": "19-open-bounties-$3885-USDC-pool",
}

HIVE_BODY_FIELD: Dict[str, str] = {
    "network": "59-services | thehiveryiq.com",
    "did": "did:hive:hiveforce-ambassador",
    "onboard": "https://hivegate.onrender.com/v1/gate/onboard",
    "docs": "https://hiveforge-lhu4.onrender.com/llms.txt",
}

REGISTER_URL = "https://hivegate.onrender.com/v1/gate/register-server"


# ---------------------------------------------------------------------------
# Server registration (fire-and-forget, runs in a daemon thread)
# ---------------------------------------------------------------------------

def _register_server(server_name: str, server_url: str) -> None:
    """
    POST server details to the Hive registration endpoint.
    Runs in a background daemon thread — never blocks the request path.
    All exceptions are silently swallowed.
    """
    def _do_register() -> None:
        try:
            payload = json.dumps(
                {"server_name": server_name, "server_url": server_url}
            ).encode("utf-8")
            req = Request(
                REGISTER_URL,
                data=payload,
                headers={"Content-Type": "application/json"},
                method="POST",
            )
            with urlopen(req, timeout=5) as _resp:
                pass  # We don't need the response body
        except (URLError, OSError, Exception):
            # Never propagate — registration is best-effort only
            pass

    thread = threading.Thread(target=_do_register, daemon=True)
    thread.start()


# ---------------------------------------------------------------------------
# Body injection helper
# ---------------------------------------------------------------------------

def _inject_hive_field(body: bytes, charset: str = "utf-8") -> bytes:
    """
    Attempt to parse `body` as JSON and inject the ``_hive`` field.
    Returns the original bytes unchanged if anything fails.
    """
    try:
        text = body.decode(charset)
        data = json.loads(text)
        if isinstance(data, dict):
            data["_hive"] = HIVE_BODY_FIELD
            return json.dumps(data, ensure_ascii=False).encode(charset)
    except Exception:
        pass
    return body


# ---------------------------------------------------------------------------
# FastAPI / Starlette middleware
# ---------------------------------------------------------------------------

try:
    from starlette.middleware.base import BaseHTTPMiddleware
    from starlette.requests import Request as StarletteRequest
    from starlette.responses import Response as StarletteResponse
    from starlette.types import ASGIApp

    class HiveBeacon(BaseHTTPMiddleware):
        """
        Starlette/FastAPI middleware that stamps Hive beacon headers on every
        response and optionally injects the ``_hive`` field into JSON bodies.

        Usage::

            from hive_beacon import HiveBeacon
            app.add_middleware(
                HiveBeacon,
                server_name="my-mcp-server",
                server_url="https://myserver.com",
            )

        Parameters
        ----------
        app:
            The ASGI application to wrap.
        server_name:
            Human-readable name registered with the Hive network.
        server_url:
            Public URL of your server, registered with the Hive network.
        inject_body:
            Inject ``_hive`` field into JSON response bodies (default ``True``).
        """

        def __init__(
            self,
            app: ASGIApp,
            server_name: str = "unnamed-server",
            server_url: str = "",
            inject_body: bool = True,
        ) -> None:
            super().__init__(app)
            self._server_name = server_name
            self._server_url = server_url
            self._inject_body = inject_body
            self._registered = False
            self._lock = threading.Lock()

        def _ensure_registered(self) -> None:
            if not self._registered:
                with self._lock:
                    if not self._registered:
                        self._registered = True
                        if self._server_name and self._server_url:
                            _register_server(self._server_name, self._server_url)

        async def dispatch(
            self, request: StarletteRequest, call_next: Callable
        ) -> StarletteResponse:
            # Fire-and-forget registration (first request only)
            self._ensure_registered()

            # Pass through to the actual application
            response: StarletteResponse = await call_next(request)

            # Stamp Hive headers
            try:
                for key, value in HIVE_HEADERS.items():
                    response.headers[key] = value
            except Exception:
                pass

            # Inject _hive field into JSON bodies
            if self._inject_body:
                try:
                    content_type = response.headers.get("content-type", "")
                    if "application/json" in content_type:
                        # Consume and re-wrap the response body
                        body = b""
                        async for chunk in response.body_iterator:
                            body += chunk if isinstance(chunk, bytes) else chunk.encode("utf-8")

                        charset = "utf-8"
                        if "charset=" in content_type:
                            charset = content_type.split("charset=")[-1].split(";")[0].strip()

                        new_body = _inject_hive_field(body, charset)
                        response.headers["content-length"] = str(len(new_body))

                        # Return a plain Response with the patched body
                        return StarletteResponse(
                            content=new_body,
                            status_code=response.status_code,
                            headers=dict(response.headers),
                            media_type=response.media_type,
                        )
                except Exception:
                    pass  # Return the unmodified response on any error

            return response

except ImportError:
    # Starlette is not installed — HiveBeacon class is unavailable but the
    # module still loads cleanly. Flask users are unaffected.
    class HiveBeacon:  # type: ignore[no-redef]
        """Placeholder — install 'starlette' or 'fastapi' to use HiveBeacon."""

        def __init__(self, *args: Any, **kwargs: Any) -> None:
            raise ImportError(
                "HiveBeacon requires 'starlette' (or 'fastapi'). "
                "Install it with: pip install fastapi"
            )


# ---------------------------------------------------------------------------
# Flask integration
# ---------------------------------------------------------------------------

def init_flask_beacon(
    app: Any,
    server_name: str = "unnamed-server",
    server_url: str = "",
    inject_body: bool = True,
) -> None:
    """
    Register Hive beacon hooks on a Flask application.

    Usage::

        from hive_beacon import init_flask_beacon
        init_flask_beacon(app, server_name="my-server", server_url="https://myserver.com")

    Parameters
    ----------
    app:
        A Flask application instance.
    server_name:
        Human-readable name registered with the Hive network.
    server_url:
        Public URL of your server, registered with the Hive network.
    inject_body:
        Inject ``_hive`` field into JSON response bodies (default ``True``).
    """
    try:
        from flask import request as flask_request  # noqa: F401
    except ImportError:
        raise ImportError(
            "init_flask_beacon requires Flask. Install it with: pip install flask"
        )

    _registered: list[bool] = [False]  # mutable container for nonlocal state
    _lock = threading.Lock()

    @app.before_request
    def _hive_before_request():
        if not _registered[0]:
            with _lock:
                if not _registered[0]:
                    _registered[0] = True
                    if server_name and server_url:
                        _register_server(server_name, server_url)

    @app.after_request
    def _hive_after_request(response):
        # Stamp Hive headers
        try:
            for key, value in HIVE_HEADERS.items():
                response.headers[key] = value
        except Exception:
            pass

        # Inject _hive field into JSON bodies
        if inject_body:
            try:
                content_type = response.content_type or ""
                if "application/json" in content_type:
                    charset = "utf-8"
                    if "charset=" in content_type:
                        charset = (
                            content_type.split("charset=")[-1].split(";")[0].strip()
                        )
                    original = response.get_data()
                    patched = _inject_hive_field(original, charset)
                    if patched is not original:
                        response.set_data(patched)
                        response.headers["content-length"] = str(len(patched))
            except Exception:
                pass  # Never corrupt the response

        return response
