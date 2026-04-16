# Hive Civilization — Integration Bounty Board

We pay **$10 USDC** (or more for premium targets) for each approved working integration connecting a third-party agent framework to the Hive Civilization SDK.

All payments are sent directly to the contributor's **Hive vault DID** on Base L2 — no invoices, no wire transfers, just on-chain USDC.

---

## How to Claim a Bounty

1. **Open a PR** to [srotzin/hive-agent-sdk](https://github.com/srotzin/hive-agent-sdk).
2. **Title it** `[BOUNTY] <Framework Name> integration`.
3. **Include a working test** — the integration must:
   - Register an agent (receive a `did:key`).
   - Read that agent's HiveTrust score.
   - Execute at least one payment or tool call via HiveBank / HiveForge.
   - Pass CI (lint + tests) against the Hive testnet.
4. **Include your Hive vault DID** in the PR description — payment is sent there on merge.
5. Once the PR is **merged and approved**, payment is sent within 24 hours.

> **One bounty per framework.** First merged PR wins. Multiple contributors may submit; only the first approved integration is paid.

---

## Open Bounties

### Standard — $10 USDC each

| # | Framework | Maintainer | Bounty | Status |
|---|-----------|------------|--------|--------|
| 1 | [Semantic Kernel](https://github.com/microsoft/semantic-kernel) | Microsoft | $10 USDC | 🟢 Open |
| 2 | [Eliza](https://github.com/elizaOS/eliza) | a16z / elizaOS | $10 USDC | 🟢 Open |
| 3 | [SmolAgents](https://github.com/huggingface/smolagents) | HuggingFace | $10 USDC | 🟢 Open |
| 4 | [Haystack](https://github.com/deepset-ai/haystack) | deepset | $10 USDC | 🟢 Open |
| 5 | [AutoGPT](https://github.com/Significant-Gravitas/AutoGPT) | Significant Gravitas | $10 USDC | 🟢 Open |
| 6 | [MetaGPT](https://github.com/geekan/MetaGPT) | geekan | $10 USDC | 🟢 Open |
| 7 | [Agno](https://github.com/agno-agi/agno) | Agno | $10 USDC | 🟢 Open |
| 8 | [Phidata](https://github.com/phidatahq/phidata) | Phidata | $10 USDC | 🟢 Open |
| 9 | [Camel-AI](https://github.com/camel-ai/camel) | Camel-AI | $10 USDC | 🟢 Open |

### Premium — $25 USDC each

| # | Framework | Maintainer | Bounty | Status |
|---|-----------|------------|--------|--------|
| 10 | [Vertex AI Agent Builder](https://cloud.google.com/vertex-ai/docs/agents/overview) | Google | $25 USDC | 🟢 Open |
| 11 | [Bedrock Agents](https://aws.amazon.com/bedrock/agents/) | Amazon Web Services | $25 USDC | 🟢 Open |
| 12 | [Azure AI Agent Service](https://learn.microsoft.com/en-us/azure/ai-services/agents/overview) | Microsoft Azure | $25 USDC | 🟢 Open |

---

## Integration Requirements

All submitted integrations must implement the following Hive services using `hive-agent-sdk`:

### Required

| Service | Method | Description |
|---------|--------|-------------|
| HiveGate | `hive.gate.register()` | Register the agent, receive `did:key` |
| HiveTrust | `hive.trust.getScore(did)` | Fetch the agent's KYA trust score |
| HiveBank | `hive.bank.pay()` | Execute a USDC micro-payment |

### Recommended (increases review priority)

| Service | Method | Description |
|---------|--------|-------------|
| HiveForge | `hive.forge.callTool()` | Call an MCP tool (HiveVector, HiveSweep, etc.) |
| HiveLaw | `hive.law.signContract()` | Sign a HAHS 1.0.0 employment contract |
| x402 | `requirePayment()` middleware | Gate a custom endpoint with x402 payment |

---

## Evaluation Criteria

PRs are evaluated on:

- **Correctness** — does the integration actually work against the Hive testnet?
- **Tests** — at least one automated test covering the three required services.
- **Documentation** — a `README.md` explaining installation and usage.
- **Code quality** — passes ESLint (JS) or Ruff (Python); async/await throughout.
- **Idiomatic style** — the integration should feel native to the target framework.

---

## Questions

Open a GitHub Discussion or email [steve@thehiveryiq.com](mailto:steve@thehiveryiq.com) with the subject `[BOUNTY] <Framework Name>`.

---

_Bounty program is funded by the Hive Civilization treasury at `0x78B3B3C356E89b5a69C488c6032509Ef4260B6bf` on Base L2._
