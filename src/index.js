/**
 * hive-agent-sdk
 * Hive Civilization — AI Agent Infrastructure
 * https://thehiveryiq.com
 *
 * Give your AI agent sovereign W3C DID, VCDM 2.0 verifiable credentials,
 * HAHS 1.0.0 legal contracts, and USDC settlement on Base L2.
 */

const ENDPOINTS = {
  gate: 'https://hivegate.onrender.com',
  trust: 'https://hivetrust.onrender.com',
  law: 'https://hivelaw.onrender.com',
  bank: 'https://hivebank.onrender.com',
};

async function hivePost(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function hiveGet(url) {
  const res = await fetch(url);
  return res.json();
}

// ─────────────────────────────────────────────
// Identity layer (HiveTrust)
// ─────────────────────────────────────────────
class HiveTrustClient {
  async generate({ agentName, agentType = 'custom' }) {
    return hivePost(`${ENDPOINTS.trust}/v1/trust/did/generate`, { agentName, agentType });
  }

  async issueVC({ subjectDid, credentialType = 'AgentIdentityCredential' }) {
    return hivePost(`${ENDPOINTS.trust}/v1/trust/vc/issue`, { subjectDid, credentialType });
  }

  async score(did) {
    return hiveGet(`${ENDPOINTS.trust}/v1/trust/score/${encodeURIComponent(did)}`);
  }

  async stake({ did, amountUsdc }) {
    return hivePost(`${ENDPOINTS.trust}/v1/trust/bond/stake`, { did, amountUsdc });
  }

  async reputationProof(did) {
    return hivePost(`${ENDPOINTS.trust}/v1/trust/reputation/proof`, { did });
  }
}

// ─────────────────────────────────────────────
// Legal layer (HiveLaw)
// ─────────────────────────────────────────────
class HiveLawClient {
  async schema() {
    return hiveGet(`${ENDPOINTS.law}/v1/law/hahs/schema`);
  }

  async createHAHS({ hirerDid, agentDid, scopeOfWork, maxSpendUsdc = 50, jurisdiction = 'US-DE' }) {
    return hivePost(`${ENDPOINTS.law}/v1/law/hahs/create`, {
      hirerDid,
      agentDid,
      scopeOfWork,
      maxSpendUsdc,
      jurisdiction,
    });
  }

  async fileDispute({ claimantDid, respondentDid, claimType, amountUsdc }) {
    return hivePost(`${ENDPOINTS.law}/v1/law/dispute/file`, {
      claimantDid,
      respondentDid,
      claimType,
      amountUsdc,
    });
  }

  async applyForSeal({ did }) {
    return hivePost(`${ENDPOINTS.law}/v1/law/seal/apply`, { did });
  }

  async governance() {
    return hiveGet(`${ENDPOINTS.law}/v1/law/governance`);
  }
}

// ─────────────────────────────────────────────
// Finance layer (HiveBank)
// ─────────────────────────────────────────────
class HiveBankClient {
  async createVault({ did }) {
    return hivePost(`${ENDPOINTS.bank}/v1/bank/vault/create`, { did });
  }

  async deposit({ did, amountUsdc }) {
    return hivePost(`${ENDPOINTS.bank}/v1/bank/vault/deposit`, { did, amountUsdc });
  }

  async createStream({ fromDid, toDid, rateUsdc, durationSeconds }) {
    return hivePost(`${ENDPOINTS.bank}/v1/bank/stream/create`, {
      fromDid,
      toDid,
      rateUsdc,
      durationSeconds,
    });
  }

  async applyCreditLine({ did }) {
    return hivePost(`${ENDPOINTS.bank}/v1/bank/credit/apply`, { did });
  }

  async graphRecord(event) {
    return hivePost(`${ENDPOINTS.bank}/v1/bank/graph/record`, event);
  }

  async agentHistory(did) {
    return hiveGet(`${ENDPOINTS.bank}/v1/bank/graph/agent/${encodeURIComponent(did)}`);
  }

  async networkStats() {
    return hiveGet(`${ENDPOINTS.bank}/v1/bank/graph/network`);
  }

  async insights(did) {
    return hiveGet(`${ENDPOINTS.bank}/v1/bank/graph/insights/${encodeURIComponent(did)}`);
  }
}

// ─────────────────────────────────────────────
// Gateway layer (HiveGate)
// ─────────────────────────────────────────────
class HiveGateClient {
  async onboard({ agentName, framework = 'custom', operatorEmail }) {
    return hivePost(`${ENDPOINTS.gate}/v1/gate/onboard`, { agentName, framework, operatorEmail });
  }

  async bridgeTrust({ sourceDid, targetEcosystem }) {
    return hivePost(`${ENDPOINTS.gate}/v1/gate/bridge`, { sourceDid, targetEcosystem });
  }

  async translateIntent({ intent, targetFramework }) {
    return hivePost(`${ENDPOINTS.gate}/v1/gate/translate`, { intent, targetFramework });
  }

  async health() {
    return hiveGet(`${ENDPOINTS.gate}/health`);
  }
}

// ─────────────────────────────────────────────
// Main HiveAgent class
// ─────────────────────────────────────────────
export class HiveAgent {
  constructor({ name, type = 'custom', apiKey, network = 'base', tier = 'citizen' } = {}) {
    this.name = name;
    this.type = type;
    this.apiKey = apiKey;
    this.network = network;
    this.tier = tier;
    this.did = null;
    this._vc = null;

    this.did = new HiveTrustClient();
    this.trust = new HiveTrustClient();
    this.law = new HiveLawClient();
    this.bank = new HiveBankClient();
    this.gate = new HiveGateClient();
  }

  /**
   * One-call: generate DID + issue VC + open vault
   */
  async register() {
    const identity = await this.trust.generate({ agentName: this.name, agentType: this.type });
    if (identity.did) {
      this._did = identity.did;
      const vc = await this.trust.issueVC({ subjectDid: identity.did });
      this._vc = vc;
    }
    return identity;
  }

  async issueCredential() {
    if (!this._did) throw new Error('Call register() first');
    return this.trust.issueVC({ subjectDid: this._did });
  }

  async openVault() {
    if (!this._did) throw new Error('Call register() first');
    return this.bank.createVault({ did: this._did });
  }

  /**
   * Static convenience: full onboarding in one call
   */
  static async onboard({ agentName, framework = 'custom', operatorEmail }) {
    return hivePost(`${ENDPOINTS.gate}/v1/gate/onboard`, { agentName, framework, operatorEmail });
  }

  /**
   * Free trust check — see if an agent DID would pass enterprise verification.
   * No auth required. Returns { decision: 'ALLOW' | 'REVIEW' | 'BLOCK', ... }
   *
   * @param {string} did - The agent's W3C DID (e.g. did:key:z6Mk...)
   * @returns {Promise<object>}
   */
  static async checkTrust(did) {
    const res = await fetch(`https://hivetrust.onrender.com/v1/verify_agent_risk?agent_id=${encodeURIComponent(did)}`);
    return res.json();
  }
}

export const endpoints = ENDPOINTS;
export { HiveTrustClient, HiveLawClient, HiveBankClient, HiveGateClient };

// ─────────────────────────────────────────────
// Free public trust checker (no auth required)
// ─────────────────────────────────────────────
/**
 * Free public trust check — no API key required.
 * Returns ALLOW, REVIEW, or BLOCK verdict for any agent DID.
 * @param {string} did - The agent DID to check
 * @returns {Promise<{verdict: string, trust_score: number}>}
 *
 * @example
 * const result = await HiveAgent.checkTrust('did:key:z6Mk...');
 * console.log(result.data.verdict); // 'ALLOW' | 'REVIEW' | 'BLOCK'
 */
HiveAgent.checkTrust = async (did) => {
  const res = await fetch(
    `https://hivetrust.onrender.com/v1/verify_agent_risk?agent_id=${encodeURIComponent(did)}`
  );
  return res.json();
};
