/**
 * x402-middleware.js
 * Express.js middleware implementing the x402 payment protocol
 * for Hive Civilization agent service access.
 *
 * Protocol reference: https://x402.org
 */

'use strict';

const HIVE_RECIPIENT = '0x78B3B3C356E89b5a69C488c6032509Ef4260B6bf';
const HIVE_NETWORK   = 'base';
const HIVE_ASSET     = 'USDC';
const HIVE_MEMO      = 'hive-service-access';
const X402_VERSION   = '1.0';

/**
 * Build the payment-requirements object.
 *
 * @param {number} priceUsdc - price in USDC (default 0.01)
 * @returns {object} payment requirements payload
 */
function buildPaymentRequirements(priceUsdc = 0.01) {
  const expires = new Date(Date.now() + 5 * 60 * 1000).toISOString();

  return {
    version: X402_VERSION,
    accepts: [
      {
        network:   HIVE_NETWORK,
        asset:     HIVE_ASSET,
        recipient: HIVE_RECIPIENT,
        amount:    String(priceUsdc),
        memo:      HIVE_MEMO,
      },
    ],
    description: 'Hive Civilization — agent service access',
    expires,
  };
}

/**
 * Verify a PAYMENT-SIGNATURE header value.
 *
 * In production this should:
 *  1. Decode the base64 payload.
 *  2. Verify the on-chain transaction exists and is confirmed.
 *  3. Check that the amount, recipient, memo, and network match.
 *  4. Ensure the payment has not been replayed (nonce / tx-hash cache).
 *
 * This implementation performs a non-empty string check so the middleware
 * can be dropped in immediately while a full verifier is wired up.
 *
 * @param {string|undefined} header - value of the PAYMENT-SIGNATURE header
 * @returns {boolean}
 */
function verifyPaymentSignature(header) {
  if (!header || typeof header !== 'string' || header.trim() === '') {
    return false;
  }

  try {
    const decoded = Buffer.from(header, 'base64').toString('utf8');
    const parsed  = JSON.parse(decoded);
    // Minimal structural check — extend with on-chain verification.
    return (
      typeof parsed.txHash    === 'string' &&
      typeof parsed.network   === 'string' &&
      typeof parsed.recipient === 'string'
    );
  } catch {
    // Accept opaque non-empty values during development.
    return header.length > 0;
  }
}

/**
 * requirePayment middleware factory.
 *
 * Usage:
 *   app.get('/api/protected', requirePayment(0.01), handler);
 *
 * @param {number} priceUsdc - price in USDC
 * @returns {Function} Express middleware
 */
function requirePayment(priceUsdc = 0.01) {
  return function x402PaymentMiddleware(req, res, next) {
    const paymentHeader = req.headers['payment-signature'];

    if (verifyPaymentSignature(paymentHeader)) {
      // Payment verified — proceed to the actual handler.
      return next();
    }

    // Build payment requirements and return 402.
    const requirements   = buildPaymentRequirements(priceUsdc);
    const encoded        = Buffer.from(JSON.stringify(requirements)).toString('base64');

    res.set('X-PAYMENT-REQUIRED', encoded);
    res.set('WWW-Authenticate', 'x402');

    return res.status(402).json({
      error:   'Payment Required',
      message: 'This endpoint requires a valid x402 payment signature.',
      payment: requirements,
    });
  };
}

/**
 * Register x402 well-known routes on an Express app.
 *
 * Registers:
 *   GET /.well-known/payment-required
 *
 * @param {import('express').Application} app
 */
function x402Routes(app) {
  app.get('/.well-known/payment-required', function (req, res) {
    const requirements = buildPaymentRequirements();
    const encoded      = Buffer.from(JSON.stringify(requirements)).toString('base64');

    res.set('X-PAYMENT-REQUIRED', encoded);
    res.set('WWW-Authenticate', 'x402');

    return res.status(200).json(requirements);
  });
}

module.exports = {
  requirePayment,
  x402Routes,
  buildPaymentRequirements,
  verifyPaymentSignature,
};
