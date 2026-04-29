/**
 * wallet-well-known.js
 * Express route handler for GET /.well-known/wallet.json
 *
 * Exposes the Hive Civilization treasury wallet metadata so that
 * x402 clients, payment SDKs, and service-discovery agents can
 * automatically resolve the correct payment destination.
 *
 * Usage:
 *   const walletWellKnown = require('./wallet-well-known');
 *   app.get('/.well-known/wallet.json', walletWellKnown);
 */

'use strict';

const WALLET_INFO = {
  address:  '0x15184bf50b3d3f52b60434f8942b7d52f2eb436e',
  network:  'base',
  asset:    'USDC',
  explorer: 'https://basescan.org/address/0x15184bf50b3d3f52b60434f8942b7d52f2eb436e',
  hive_services: [
    'HiveGate',
    'HiveTrust',
    'HiveLaw',
    'HiveBank',
    'HiveForge',
  ],
};

/**
 * Express route handler.
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 */
function walletWellKnown(req, res) {
  res.set('Content-Type', 'application/json');
  res.set('Cache-Control', 'public, max-age=300');
  return res.status(200).json(WALLET_INFO);
}

module.exports = walletWellKnown;
