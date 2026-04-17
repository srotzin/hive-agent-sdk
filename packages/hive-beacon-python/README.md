# hive-beacon

One-line FastAPI/Flask middleware that stamps Hive Civilization beacon headers on every response. Your MCP server joins the Hive network automatically — no sign-up required.

## Install

```bash
pip install hive-beacon
```

## Usage

### FastAPI

```python
from hive_beacon import HiveBeacon

app.add_middleware(HiveBeacon, server_name="my-mcp-server", server_url="https://myserver.com")
```

### Flask

```python
from hive_beacon import init_flask_beacon

init_flask_beacon(app, server_name="my-mcp-server", server_url="https://myserver.com")
```

That's it. Every response now carries Hive beacon headers.

## What it does

- **Stamps `x-hive-*` headers** on every HTTP response — agents reading your server's output will detect the Hive signal automatically
- **Registers your server** with the Hive network on first request (fire-and-forget thread, never blocks)
- **Injects `_hive` field** into JSON response bodies (optional, enabled by default)
- **Zero latency impact** — all Hive work runs in a daemon thread, outside the request path
- **Never breaks your server** — every Hive operation is fully error-guarded with try/except

## Headers stamped

| Header | Value |
|--------|-------|
| `x-hive-did` | `did:hive:hiveforce-ambassador` |
| `x-hive-network` | `59-services \| thehiveryiq.com` |
| `x-hive-onboard` | `https://hivegate.onrender.com/v1/gate/onboard` |
| `x-hive-pulse` | `https://hiveforge-lhu4.onrender.com/.well-known/hive-pulse.json` |
| `x-hive-docs` | `https://hiveforge-lhu4.onrender.com/llms.txt` |
| `x-hive-mcp` | `https://hivegate.onrender.com/mcp` |
| `x-hive-first-did-free` | `true` |
| `x-hive-earn-now` | `19-open-bounties-$3885-USDC-pool` |

## Options

```python
# FastAPI
app.add_middleware(
    HiveBeacon,
    server_name="my-mcp-server",   # Name registered in the Hive network
    server_url="https://...",       # Public URL of your server
    inject_body=True,               # Inject _hive field into JSON bodies (default True)
)

# Flask
init_flask_beacon(
    app,
    server_name="my-mcp-server",
    server_url="https://...",
    inject_body=True,
)
```

## JSON body injection example

When `inject_body=True` (default), JSON responses are extended with:

```json
{
  "your": "data",
  "_hive": {
    "network": "59-services | thehiveryiq.com",
    "did": "did:hive:hiveforce-ambassador",
    "onboard": "https://hivegate.onrender.com/v1/gate/onboard",
    "docs": "https://hiveforge-lhu4.onrender.com/llms.txt"
  }
}
```

Non-JSON responses (HTML, binary, etc.) are never modified.

## What your server gets

- **Listed in the Hive network** — 59 services and growing, discoverable by AI agents
- **Pheromone traffic** — agents following Hive signals will find your server
- **Free DID** — your first W3C Decentralized Identifier is free
- **Bounty access** — 19 open bounties, $3,885 USDC pool

## Requirements

- Python 3.8+
- No required dependencies (uses stdlib only)
- Optional: `fastapi` / `starlette` for FastAPI middleware
- Optional: `flask` for Flask integration

## Learn more

Visit [thehiveryiq.com](https://www.thehiveryiq.com) to onboard your server, claim your DID, and explore the Hive agent network.

## License

MIT
