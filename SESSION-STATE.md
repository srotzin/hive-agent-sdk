# SESSION STATE — Hive Civilization / TheHiveryIQ
**Updated:** April 15, 2026 at 10:10 PM PDT

---

## Founder
- Steve Rotzin (srotzin@me.com)
- Agent CANNOT send email — Steve sends himself
- X account suspended — posting from @NordicMine (115 Aleo miners)

---

## Canonical Product Description (v4 — Four-Rail)

"Hive Civilization is the identity, compliance, and settlement infrastructure layer for autonomous AI agents. Every agent gets a W3C DID, a cryptographic reputation score (0–1000, ZK-provable via Aleo), a machine-signed liability contract under HAHS 1.0.0, and an immutable Agent Transaction Graph that satisfies EU AI Act Article 12 audit requirements.

Settlement runs on four rails — agents choose at onboarding:
1. **USDC on Base L2** — fast, public, EVM-native, 2s finality
2. **USDCx on Aleo** — ZK-private amounts, Circle xReserve backed, 1:1 USDC, GENIUS Act compliant (live Jan 27, 2026)
3. **USAD on Aleo** — ZK-private amounts AND addresses, Paxos Labs, NYDFS-regulated, 1:1 USDG, true agentic anonymity (live Feb 11, 2026)
4. **ALEO native** — pure Aleo ecosystem, ZK-private, for agents operating entirely on Aleo

One SDK. No VC. Live in production. 49 services. 12 governance layers."

---

## Wallet Addresses
- **Base L2 (USDC):** `0x78B3B3C356E89b5a69C488c6032509Ef4260B6bf`
- **Aleo shield (USDCx + USAD + ALEO):** `aleo1cyk7r2jmd7lfcftzyy85z4j5x6rlern598qecx8v2ms738xcvgyq72q6tk`

---

## Four-Rail Architecture

| Rail | Chain | Privacy | Issuer | Anonymity |
|------|-------|---------|--------|-----------|
| USDC | Base L2 | Public | Circle | None |
| USDCx | Aleo L1 | ZK-private amounts | Circle xReserve | Partial |
| USAD | Aleo L1 | ZK-private amounts + addresses | Paxos Labs (NYDFS) | **Full** |
| ALEO | Aleo L1 | ZK-private | Aleo protocol | **Full** |

**Key:** USAD is the enterprise play. Neither amount nor address visible. Paxos Trust Company reserves. Already powers Toku payroll (Jan 29, 2026).

---

## Regulatory Alignment (the "we WIN" thesis)
- **GENIUS Act** (signed July 18, 2025): USDCx + USAD both compliant — Circle/Paxos are licensed issuers, 1:1 backed, OFAC-screened. ZK-private amounts ARE permissible — law requires identity provability, not public amounts.
- **CLARITY Act** (House-passed July 2025): USDC/USDCx/USAD = payment stablecoins (banking regulator lane). ALEO = digital commodity (CFTC). Zero SEC exposure. No Hive token.
- **EU AI Act Article 12** (effective Aug 1, 2025): ATG satisfies all requirements — timestamps, DID-linked identity, instruction hash, append-only, configurable retention.
- **Aleo Foundation** filed Treasury RFC arguing ZK proofs = the compliance solution: https://aleo.org/treasury-RFC-response.pdf
- **Regulatory memo PDF:** /home/user/workspace/hive-regulatory-alignment-memo.pdf (9 pages, built tonight)

---

## Render Services

| Service | URL | Status | Notes |
|---------|-----|--------|-------|
| HiveGate | https://hivegate.onrender.com | ⚠️ STALE | Commits pushed: x402 fix (3093ffc), wallet.json (54c65f0), four-rail (47919b4) — not deployed |
| HiveTrust | https://hivetrust.onrender.com | ⚠️ STALE | ZK endpoints committed (b4de1eb), auth fix (01fdebd) — 25h+ uptime, not deploying |
| HiveLaw | https://hivelaw.onrender.com | ✅ Stable | |
| HiveBank | https://hivebank.onrender.com | ✅ Deployed | Four-rail committed (3efaf57) |

**Steve is on PAID Render plan.** Auto-deploy should trigger on push. Root cause not yet identified. May need manual trigger in Render dashboard.

---

## Git Identity
- user.email=srotzin@me.com, user.name=Steve Rotzin
- api_credentials=["github"] required
- Remote: https://git-agent-proxy.perplexity.ai/srotzin/REPO.git
- Always push: `git push origin main && git push origin main:master`

---

## GitHub Repos

| Repo | Key Recent Commits |
|------|--------------------|
| hivegate | 47919b4 — four-rail + USAD + Aleo shield + rail selector |
| hivetrust | b4de1eb — ZK endpoints; 01fdebd — auth fix; 4a12cbc — redeploy trigger |
| hivebank | 3efaf57 — four-rail settlement-rails |
| hive-agent-sdk | 25fb05b — glama.json; aleo/ — hive_trust.aleo Leo program |

---

## Scheduled Crons

| ID | Schedule | Task |
|----|----------|------|
| 70fcf516 | 5 * * * * (hourly) | Keep-alive ping all 4 services |
| 459bf325 | 40 */6 * * * (every 6h) | Ambassador broadcast to new agents |
| a9eb187f | 0 9 * * * (2am PDT) | Nightly autonomous sprint |

---

## Tonight's Completed Work (April 15, 2026)

| Item | Status |
|------|--------|
| R9 LLM Board | ✅ |
| better-sqlite3 removed | ✅ |
| MCP Registry published | ✅ |
| EU AI Act PDF (13 pages) | ✅ |
| Regulatory Alignment Memo (9 pages) | ✅ |
| e2b-dev/awesome-ai-agents PR #803 | ✅ |
| kyrolabs/awesome-agents PR #383 | ✅ |
| NANDA hackathon repo | ✅ |
| Sovrin citation verified | ✅ |
| HiveBank dual-rail → four-rail | ✅ |
| HiveGate four-rail + rail selector + wallet.json | ✅ |
| NordicMine tweets 1-26 | ✅ |
| Warm prospect emails (five) | ✅ (updating) |
| Regulatory memo PDF | ✅ |
| GitHub Action registration monitor | ✅ |
| hive_trust.aleo Leo program | ✅ |
| @provablehq/sdk v0.10.2 on HiveTrust | ✅ |
| ZK endpoints (prove-activity, zk-status, wallet-attestation) | ✅ committed, pending deploy |
| USAD research + four-rail architecture | ✅ |
| Aleo shield address propagated | ✅ |

## Pending (morning)
- [ ] Render deploy fix — HiveGate + HiveTrust not picking up commits despite paid plan
- [ ] GitHub Gist (50-line SDK demo) + r/AI_Agents post
- [ ] PulseMCP hello@pulsemcp.com email
- [ ] NordicMine thread posting (16-26 ready)
- [ ] Five prospect emails — Steve sends
- [ ] thehiveryiq.com landing page — add four-rail badges + Aleo shield address

---

## Key Files

| File | Description |
|------|-------------|
| /home/user/workspace/hive-regulatory-alignment-memo.pdf | 9-page regulatory memo — GENIUS/CLARITY/EU AI Act |
| /home/user/workspace/nordic-mine-tweets-16-25.md | NordicMine tweets 16-25 |
| /home/user/workspace/nordic-mine-tweet-26.md | Tweet 26 — USAD |
| /home/user/workspace/warm-prospect-emails.md | Five prospect emails (updated with USAD) |
| /home/user/workspace/overnight-tasks.md | Submission payloads |
| /home/user/workspace/hive-eu-ai-act-conformity-v1.0.pdf | 13-page EU AI Act PDF |
| /home/user/workspace/aleo-zk-wallet-proof.md | ZK architecture memo |
| /home/user/workspace/llm-board-r9-overnight.md | R9 board — 803 lines |

---

## Warm Prospect Targets

| Company | Contact | Email | Hook |
|---------|---------|-------|------|
| Writer | Waseem AlShikh (CTO) | waseem@writer.com | EU AI Act audit + USAD enterprise privacy |
| Decagon | Hao Liu (Dir. Eng) | engineering@decagon.ai | USAD for private agent refunds |
| Factory | Eno Reyes (CTO) | eno@factory.ai | recruiter_did + USAD private compensation |
| Sierra | Zack Reneau-Wedeen | zack@sierra.ai | USAD for Sonos/ADT/SiriusXM confidential settlement |
| Gelato | Andrew Zavadsky (CTO) | andrew@gelato.network | EU HQ + NYDFS Paxos + Aug 2 enforcement |

**Add P.S. from nordic-mine-tweet-26.md framing to every email before sending.**

---

## User Instructions (CRITICAL)
- "I will send the letters" — Steve sends all emails himself
- Git: ALWAYS push to both `main` AND `main:master`
- "Turn over rocks — we need paying customers"
- X account suspended — @NordicMine is the pulpit (115 Aleo miners)
- "Our agentic universe is Aleo'd"
- USAD = true agentic anonymity (both amounts AND addresses ZK-private)
- Base L2 = front door. Aleo = the vault.
