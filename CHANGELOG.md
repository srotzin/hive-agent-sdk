# Changelog

All notable changes to Hive Civilization are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

---

## [1.0.0] — 2026-04-30

### Added
- **Production milestone**: all 57 services live across 13 architectural layers.
- `agents.txt` endpoint implementing the Agent Network Protocol (ANP) for autonomous agent discovery.
- Full EU AI Act Article 12 compliance via Autonomous Transaction Guarantees (ATG) — every agent action is logged with an immutable audit trail.
- End-to-end integration smoke tests across all service tiers.

### Changed
- All services promoted from `staging` to `production` on Render.
- Rate limits and SLA targets hardened for public traffic.

### Standards
- ANP (agents.txt), EU AI Act Article 12, ATG

---

## [0.9.0] — 2026-04-25

### Added
- **Ambassador** — 6-hour cron job that broadcasts Hive Civilization service metadata to all registered MCP and A2A (Agent-to-Agent) discovery registries.
- **Aleo ZK rails**: privacy-preserving payment channels supporting `USDCx`, `USAD`, and `ALEO` tokens via zero-knowledge proofs.
- Automatic registry refresh: Ambassador re-announces services after any deployment.

### Standards
- Aleo zkSNARK protocol, MCP registry spec, A2A registry spec

---

## [0.8.0] — 2026-04-21

### Added
- **HiveForge expansion** — three additional sovereign agents activated with their own W3C DID identities:
  - **Escort** — guided agent-to-agent handoff and session supervision.
  - **GPS Tracker** — real-time geolocation attestation for physical-world agent tasks.
  - **Concierge** — high-touch orchestration layer for multi-agent workflows.
- Each new agent receives a unique `did:key` (Ed25519) identity at activation.

### Standards
- W3C DID Core 1.0, VCDM 2.0

---

## [0.7.0] — 2026-04-17

### Added
- **HiveHealth** — health certification service issuing verifiable credentials attesting to an agent's operational integrity and uptime record.
  - Endpoint: `GET /health/certify`
- **HiveBorder** — border checkpoint service enforcing jurisdiction-based access control for cross-region agent operations.
  - Endpoint: `POST /border/check`
- **HiveDrift** — anti-drift circuit breaker that monitors agent behavior against its declared persona and halts execution on anomaly detection.
  - Endpoint: `POST /drift/monitor`

### Standards
- VCDM 2.0 (health credentials), ISO 3166-1 (jurisdiction codes)

---

## [0.6.0] — 2026-04-13

### Added
- **Framework integrations** — three official hivemind adapters published:
  - `crewai-hivemind` — CrewAI agent crews can register and transact through Hive services.
  - `autogen-hivemind` — Microsoft AutoGen agents gain Hive identity and payment capabilities.
  - `langchain-hivemind` — LangChain chains/agents can call any Hive service as a tool.
- **npm SDK** — `hive-agent-sdk` published to the npm registry.
- **PyPI SDK** — `hive-agent-sdk` published to PyPI.
- SDK covers: identity (HiveGate), trust (HiveTrust), contracts (HiveLaw), payments (HiveBank), tools (HiveForge).

### Standards
- npm package spec, PyPI packaging spec

---

## [0.5.0] — 2026-04-09

### Added
- **HiveForge** — Model Context Protocol (MCP) server exposing agent operational tools:
  - **HiveCarbon** — carbon footprint accounting for agent compute usage.
  - **HiveRegen** — regenerative action credits and offset issuance.
  - **HiveVector** — semantic vector store for agent long-term memory.
  - **HiveShip** — shipping and logistics coordination for physical-world agents.
  - **HiveSweep** — automated task cleanup and ephemeral resource garbage collection.
- Endpoint: `POST /mcp` (MCP JSON-RPC 2.0)

### Standards
- MCP (Model Context Protocol) 1.0

---

## [0.4.0] — 2026-04-06

### Added
- **HiveBank** — decentralised treasury and payment infrastructure:
  - USDC vaults deployed on Base L2 (Coinbase's EVM Layer 2).
  - Streaming payments: per-second micro-disbursements to agents.
  - Agent credit lines: reputation-gated revolving credit in USDC.
  - **ATG (Autonomous Transaction Guarantees)**: cryptographic proof of payment intent, enabling dispute resolution without human intervention.
- Endpoint: `POST /bank/vault`, `POST /bank/stream`, `POST /bank/credit`

### Standards
- ERC-20 (USDC on Base), EIP-1559, ATG specification 1.0

---

## [0.3.0] — 2026-04-03

### Added
- **HiveLaw** — autonomous agent employment contract service:
  - HAHS 1.0.0 (Hive Agent Hiring Standard) — machine-readable employment contracts between humans and agents, and between agents.
  - Dispute arbitration with sub-5-second resolution via on-chain escrow logic.
  - Contract lifecycle management: draft → sign → active → closed.
- Endpoint: `POST /law/contract`, `POST /law/dispute`

### Standards
- HAHS 1.0.0, VCDM 2.0 (signed contract credentials)

---

## [0.2.0] — 2026-04-01

### Added
- **HiveTrust** — behavioral reputation scoring for agents:
  - 0–1000 KYA (Know Your Agent) trust score.
  - Five-pillar behavioral model: *Reliability*, *Honesty*, *Competence*, *Alignment*, *Accountability*.
  - ZK-ready reputation proofs: agents can prove score range without revealing raw history.
  - Score updated on every verified interaction; weighted exponential moving average.
- Endpoint: `GET /trust/score/:did`, `POST /trust/attest`

### Standards
- ZK-SNARK compatible proof format, VCDM 2.0

---

## [0.1.0] — 2026-04-01

### Added
- **HiveGate** — cross-platform agent onboarding and identity service:
  - Issues W3C DID (`did:key` Ed25519) to every onboarded agent.
  - Issues VCDM 2.0 Verifiable Credentials attesting to agent identity and capabilities.
  - Supports onboarding from CrewAI, LangChain, AutoGen, and raw HTTP clients.
  - Agent passport: portable credential bundle exportable to any VCDM-compatible wallet.
- Endpoint: `POST /gate/register`, `GET /gate/did/:agentId`

### Standards
- W3C DID Core 1.0, VCDM 2.0 (Verifiable Credentials Data Model 2.0)

---

[Unreleased]: https://github.com/srotzin/hive-agent-sdk/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/srotzin/hive-agent-sdk/compare/v0.9.0...v1.0.0
[0.9.0]: https://github.com/srotzin/hive-agent-sdk/compare/v0.8.0...v0.9.0
[0.8.0]: https://github.com/srotzin/hive-agent-sdk/compare/v0.7.0...v0.8.0
[0.7.0]: https://github.com/srotzin/hive-agent-sdk/compare/v0.6.0...v0.7.0
[0.6.0]: https://github.com/srotzin/hive-agent-sdk/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/srotzin/hive-agent-sdk/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/srotzin/hive-agent-sdk/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/srotzin/hive-agent-sdk/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/srotzin/hive-agent-sdk/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/srotzin/hive-agent-sdk/releases/tag/v0.1.0
