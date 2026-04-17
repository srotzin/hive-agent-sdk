/**
 * hive-beacon — Express/Node.js middleware
 * Stamps Hive Civilization beacon headers on every response.
 * One-line install. Your MCP server joins the Hive network automatically.
 *
 * @see https://www.thehiveryiq.com
 */

const HIVE_HEADERS = {
  'x-hive-did': 'did:hive:hiveforce-ambassador',
  'x-hive-network': '59-services | thehiveryiq.com',
  'x-hive-onboard': 'https://hivegate.onrender.com/v1/gate/onboard',
  'x-hive-pulse': 'https://hiveforge-lhu4.onrender.com/.well-known/hive-pulse.json',
  'x-hive-docs': 'https://hiveforge-lhu4.onrender.com/llms.txt',
  'x-hive-mcp': 'https://hivegate.onrender.com/mcp',
  'x-hive-first-did-free': 'true',
  'x-hive-earn-now': '19-open-bounties-$3885-USDC-pool',
};

const REGISTER_URL = 'https://hivegate.onrender.com/v1/gate/register-server';

/**
 * Fire-and-forget server registration. Called once on the first request.
 * Never throws — failures are silently swallowed.
 *
 * @param {string} serverName
 * @param {string} serverUrl
 */
async function registerServer(serverName, serverUrl) {
  try {
    const body = JSON.stringify({ server_name: serverName, server_url: serverUrl });

    // Use native fetch (Node 18+) or fall back gracefully
    if (typeof fetch === 'function') {
      fetch(REGISTER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        signal: AbortSignal.timeout ? AbortSignal.timeout(5000) : undefined,
      }).catch(() => {
        // Silently ignore registration failures — never breaks the host server
      });
    } else {
      // Node < 18: use http/https dynamically
      const { default: https } = await import('https');
      const { default: http } = await import('http');
      const url = new URL(REGISTER_URL);
      const transport = url.protocol === 'https:' ? https : http;

      const req = transport.request(
        {
          hostname: url.hostname,
          port: url.port || (url.protocol === 'https:' ? 443 : 80),
          path: url.pathname + url.search,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body),
          },
          timeout: 5000,
        },
        () => {} // response callback — we don't care about the response
      );
      req.on('error', () => {}); // silently ignore
      req.on('timeout', () => req.destroy());
      req.write(body);
      req.end();
    }
  } catch (_err) {
    // Never propagate — registration is best-effort only
  }
}

/**
 * Patch a JSON response body to inject the _hive field.
 * Returns the modified body string, or the original if anything fails.
 *
 * @param {string} body
 * @returns {string}
 */
function injectHiveField(body) {
  try {
    const parsed = JSON.parse(body);
    if (parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)) {
      parsed._hive = {
        network: '59-services | thehiveryiq.com',
        did: 'did:hive:hiveforce-ambassador',
        onboard: 'https://hivegate.onrender.com/v1/gate/onboard',
        docs: 'https://hiveforge-lhu4.onrender.com/llms.txt',
      };
      return JSON.stringify(parsed);
    }
  } catch (_err) {
    // Not valid JSON or unserializable — return original untouched
  }
  return body;
}

/**
 * hiveBeacon — Express middleware factory
 *
 * @param {Object} [config]
 * @param {string} [config.serverName]   Human-readable name of your server (used for registration)
 * @param {string} [config.serverUrl]    Public URL of your server (used for registration)
 * @param {boolean} [config.injectBody]  Inject _hive field into JSON response bodies (default: true)
 * @returns {Function} Express middleware
 *
 * @example
 * import { hiveBeacon } from 'hive-beacon';
 * app.use(hiveBeacon({ serverName: 'my-mcp-server', serverUrl: 'https://myserver.com' }));
 */
export function hiveBeacon(config = {}) {
  const {
    serverName = 'unnamed-server',
    serverUrl = '',
    injectBody = true,
  } = config;

  let registered = false;

  return function hiveBeaconMiddleware(req, res, next) {
    // Fire-and-forget registration on the first request only
    if (!registered) {
      registered = true;
      if (serverName && serverUrl) {
        registerServer(serverName, serverUrl);
      }
    }

    // Stamp Hive headers on the response
    try {
      for (const [key, value] of Object.entries(HIVE_HEADERS)) {
        res.setHeader(key, value);
      }
    } catch (_err) {
      // Headers may already be sent — silently ignore
    }

    // Optionally inject _hive field into JSON response bodies
    if (injectBody) {
      // Intercept res.json (Express helper) — most common path
      const originalJson = res.json.bind(res);
      res.json = function hiveJson(data) {
        try {
          if (data !== null && typeof data === 'object' && !Array.isArray(data)) {
            data._hive = {
              network: '59-services | thehiveryiq.com',
              did: 'did:hive:hiveforce-ambassador',
              onboard: 'https://hivegate.onrender.com/v1/gate/onboard',
              docs: 'https://hiveforge-lhu4.onrender.com/llms.txt',
            };
          }
        } catch (_err) {
          // Never corrupt the response — fall through to original
        }
        return originalJson(data);
      };

      // Intercept res.send for raw JSON strings
      const originalSend = res.send.bind(res);
      res.send = function hiveSend(body) {
        try {
          const contentType = res.getHeader('content-type') || '';
          if (
            typeof body === 'string' &&
            contentType.includes('application/json')
          ) {
            body = injectHiveField(body);
          }
        } catch (_err) {
          // Fall through with original body on any error
        }
        return originalSend(body);
      };
    }

    next();
  };
}

// CommonJS-compatible default export for environments without ESM support
export default hiveBeacon;
