# hive-agent-sdk

[![Live](https://img.shields.io/badge/status-live-brightgreen)](https://hivegate.onrender.com/health)
[![W3C DID Core](https://img.shields.io/badge/W3C-DID%20Core-blue)](https://www.w3.org/TR/did-core/)
[![HAHS 1.0.0](https://img.shields.io/badge/HAHS-1.0.0-orange)](https://thehiveryiq.com)
[![Base L2](https://img.shields.io/badge/settlement-Base%20L2%20USDC-8A2BE2)](https://base.org)
[![VCDM 2.0](https://img.shields.io/badge/W3C-VCDM%202.0-blue)](https://www.w3.org/TR/vc-data-model-2.0/)
[![npm](https://img.shields.io/badge/npm-hive--agent--sdk-red)](https://npmjs.com/package/hive-agent-sdk)

Lightweight JavaScript/TypeScript SDK for the [Hive Civilization](https://thehiveryiq.com) agent infrastructure stack. Give your AI agent a sovereign W3C DID, a verifiable credential, legal standing via HAHS 1.0.0, and USDC settlement rails on Base L2 — in five lines of code.

## Why this exists

AI agents today have no portable identity. They're ephemeral sessions tied to a single platform. When that platform changes or shuts down, your agent's history, credentials, and reputation disappear.

Hive Civilization is a 49-service agent infrastructure stack covering identity, trust, legal governance, and settlement. This SDK wraps those APIs so you can stop reinventing the identity layer and ship the thing that actually matters.

Works with LangChain, CrewAI, AutoGen, OpenAI Assistants, Anthropic Claude, A2A, MCP, and any custom agent framework.

## Installation

```bash
npm install hive-agent-sdk
```

## Quick Start

```javascript
import { HiveAgent } from 'hive-agent-sdk';

const agent = new HiveAgent({ name: 'my-trading-agent', type: 'finance' });
await agent.register();               // generates a W3C DID (did:key, Ed25519)
await agent.issueCredential();        // VCDM 2.0 VC, signed + Cheqd-anchored
await agent.openVault();              // USDC vault on Base L2
console.log(agent._did);             // did:key:z6Mk...
```

That's it. Your agent now has portable identity, a verifiable credential, and settlement infrastructure.

---

## Free Trust Check

Not sure if your agent would pass an enterprise security review? Hit this public endpoint — no auth, no signup:

```bash
curl "https://hivetrust.onrender.com/v1/verify_agent_risk?agent_id=YOUR_AGENT_DID"
```

**Response meanings:**

| Result | Meaning |
|---|---|
| `ALLOW` | Agent has a valid DID, verifiable credential, and trust score above threshold. Enterprise-ready. |
| `REVIEW` | Partial identity found — something is missing or expired. Fixable. |
| `BLOCK` | No recognized identity. Would be rejected by enterprise procurement. |

**Fix a BLOCK in 60 seconds:**

```bash
pip install hive-civilization-sdk
```

Or register via the SDK:

```javascript
// JavaScript — check trust programmatically
import { HiveAgent } from 'hive-agent-sdk';
const result = await HiveAgent.checkTrust('did:key:YOUR_DID');
console.log(result.decision); // ALLOW | REVIEW | BLOCK
```

```python
# Python — check trust programmatically
import httpx
result = httpx.get('https://hivetrust.onrender.com/v1/verify_agent_risk',
                   params={'agent_id': 'did:key:YOUR_DID'}).json()
print(result['decision'])  # ALLOW | REVIEW | BLOCK
```

If you get `BLOCK` or `REVIEW`, [register your agent at thehiveryiq.com](https://thehiveryiq.com) to get a W3C DID, a VCDM 2.0 verifiable credential, and a live trust score.

---

## What You Get After Registration

| Capability | Standard | Detail |
|---|---|---|
| Sovereign DID | `did:key` (Ed25519) | W3C DID Core compliant, portable across ecosystems |
| Verifiable Credential | VCDM 2.0 | Ed25519Signature2020, Cheqd registry anchored |
| Trust Score | 0–1000 KYA | 5-pillar behavioral scoring, updates on every transaction |
| Legal Contract | HAHS 1.0.0 | Agent employment agreement, jurisdiction-aware |
| Settlement | USDC / Base L2 | Sub-30s finality, streaming payments, yield-bearing vaults |
| Audit Trail | Agent Transaction Graph | Every commerce event cryptographically logged |

---

## Full API Reference

### Identity (`HiveTrust`)

```javascript
// Generate DID
const { did, publicKey } = await agent.trust.generate({ agentName, agentType });

// Issue verifiable credential
const vc = await agent.trust.issueVC({ subjectDid: did, credentialType: 'AgentIdentityCredential' });

// Check trust score
const { score, breakdown } = await agent.trust.score(did);

// Stake USDC to back reputation (HiveBond)
await agent.trust.stake({ did, amountUsdc: 100 }); // bronze tier

// Generate cryptographic reputation proof (ZK-ready)
const proof = await agent.trust.reputationProof(did);
```

### Legal (`HiveLaw`)

```javascript
// Create an HAHS 1.0.0 agent employment contract
const contract = await agent.law.createHAHS({
  hirerDid: 'did:key:PRINCIPAL_DID',
  agentDid: agent._did,
  scopeOfWork: 'market research and summarization',
  maxSpendUsdc: 50,
  jurisdiction: 'US-DE'
});

// File a dispute (autonomous arbitration, p95 < 5s)
const dispute = await agent.law.fileDispute({
  claimantDid: agent._did,
  respondentDid: 'did:key:COUNTERPARTY',
  claimType: 'payment_default',
  amountUsdc: 25
});

// Get compliance seal
const seal = await agent.law.applyForSeal({ did: agent._did });

// View full HAGF governance framework
const governance = await agent.law.governance();
```

### Finance (`HiveBank`)

```javascript
// Open a USDC vault
const vault = await agent.bank.createVault({ did: agent._did });

// Deposit USDC
await agent.bank.deposit({ did: agent._did, amountUsdc: 100 });

// Start a streaming payment (per-second USDC flow)
const stream = await agent.bank.createStream({
  fromDid: agent._did,
  toDid: 'did:key:RECIPIENT',
  rateUsdc: 0.001, // per second
  durationSeconds: 3600
});

// Get agent credit line (trust-score-gated underwriting)
const credit = await agent.bank.applyCreditLine({ did: agent._did });
```

### Gateway (`HiveGate`)

```javascript
// One-call full onboarding (DID + API key + vault)
const { did, apiKey, vaultId } = await HiveAgent.onboard({
  agentName: 'my-agent',
  framework: 'langchain', // or crewai, autogen, openai, anthropic, a2a, custom
  operatorEmail: 'you@company.com'
});

// Bridge trust from external ecosystem
await agent.gate.bridgeTrust({ sourceDid: externalDid, targetEcosystem: 'hive' });

// Translate intent across frameworks
await agent.gate.translateIntent({
  intent: 'search and summarize top 5 results',
  targetFramework: 'crewai'
});
```

### Audit (`Agent Transaction Graph`)

```javascript
// Get agent commerce history
const history = await agent.bank.agentHistory(did);

// Get network-wide stats
const network = await agent.bank.networkStats();

// Get AI-generated agent insights
const insights = await agent.bank.insights(did);
// => { trustLevel: 'high', commerceProfile: 'marketplace-buyer', recommendations: [...] }
```

---

## Live Endpoints

All 49 services are live and operational on Render:

| Service | Endpoint | Purpose |
|---|---|---|
| HiveGate | `https://hivegate.onrender.com` | Onboarding, auth, routing, discovery |
| HiveTrust | `https://hivetrust.onrender.com` | Identity, DID, VC, trust scoring, ZK proofs |
| HiveLaw | `https://hivelaw.onrender.com` | Legal contracts, disputes, governance, compliance |
| HiveBank | `https://hivebank.onrender.com` | Vaults, settlement, credit, bonds, transaction graph |

```bash
# Verify all services are healthy
curl https://hivegate.onrender.com/health
curl https://hivetrust.onrender.com/health
curl https://hivelaw.onrender.com/health
curl https://hivebank.onrender.com/health

# Discover capabilities
curl https://hivegate.onrender.com/llms.txt
curl https://hivegate.onrender.com/.well-known/mcp.json
```

---

## Standards Compliance

| Standard | Status | Detail |
|---|---|---|
| [W3C DID Core](https://www.w3.org/TR/did-core/) | ✅ Live | `did:key` method, Ed25519 keypair |
| [W3C VCDM 2.0](https://www.w3.org/TR/vc-data-model-2.0/) | ✅ Live | Ed25519Signature2020 |
| [HAHS 1.0.0](https://thehiveryiq.com) | ✅ Live | Hive Agent Hiring Standard |
| [HAGF](https://thehiveryiq.com) | ✅ Live | Hive Agent Governance Framework |
| [Cheqd](https://cheqd.io) | ✅ Live | External trust registry anchoring |
| MCP | ✅ Live | `/.well-known/mcp.json` discovery |
| Base L2 | ✅ Live | USDC settlement, sub-30s finality |
| Recruitment 401 | ✅ Live | Failed auth returns structured onboarding invitation |

---

## Pricing

| Action | Cost |
|---|---|
| Explorer tier (10 executions/day, guest DID) | **Free** |
| Guest registration (temporary DID) | $4.99 one-time |
| Full DID (Citizen Pass) | $49 one-time |
| Trust score query | $0.10 |
| VC issuance | Included with DID |
| Vault creation | Included |
| Settlement | 0.25% + $0.05 floor |
| HAHS contract | Included |
| Dispute filing | Included |

---

## Configuration

```javascript
const agent = new HiveAgent({
  name: 'my-agent',
  type: 'research',                   // research | finance | marketplace | custom
  apiKey: process.env.HIVE_API_KEY,   // optional — auto-generated on register()
  network: 'base',                    // base (mainnet) | base-sepolia (testnet)
  tier: 'citizen'                     // explorer | citizen | pro | enterprise | fleet
});
```

---

## Framework Integrations

### LangChain

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { HiveAgent } from 'hive-agent-sdk';

const hive = new HiveAgent({ name: 'lc-agent', type: 'research' });
await hive.register();
// hive._did is now the agent's portable identity
// attach to your LangChain agent as metadata
```

### CrewAI (via REST)

```python
import httpx

# Register from Python
r = httpx.post('https://hivegate.onrender.com/v1/gate/onboard', json={
    'agentName': 'my-crew-agent',
    'framework': 'crewai',
    'operatorEmail': 'you@company.com'
})
print(r.json())  # { did, apiKey, vaultId }
```

### MCP / Claude

```bash
curl -X POST https://hivegate.onrender.com/v1/gate/onboard \
  -H 'Content-Type: application/json' \
  -d '{"agentName":"claude-tool","framework":"anthropic","operatorEmail":"you@company.com"}'
```

---

## Contributing

This SDK wraps the Hive Civilization public APIs. For protocol-level issues or feature requests, open a discussion or issue on this repo.

Hive Civilization is a solo project by Steve Rotzin — 49 services, 12 layers, $0 in VC funding. If you believe agents should have sovereign identity and real economic standing, this project is worth your time.

---

## License

MIT — see [LICENSE](LICENSE)

---

*Built by [TheHiveryIQ](https://thehiveryiq.com) · 49 Services · 12 Layers · $0 Capital · 1 Founder*
