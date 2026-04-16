# Security Policy

## Supported Versions

The following versions of Hive Civilization infrastructure receive active security support and patches:

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: Active |
| 0.9.x   | :white_check_mark: Active |
| 0.8.x   | :white_check_mark: Active |
| 0.7.x   | :x: End of life    |
| < 0.7   | :x: End of life    |

---

## Reporting a Vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.**

Send a report to:

```
steve@thehiveryiq.com
Subject: [SECURITY] <brief description>
```

Include in your report:
- A clear description of the vulnerability and its potential impact.
- Steps to reproduce (proof-of-concept code or request/response examples are welcome).
- Affected component(s): service name, SDK version, or contract address.
- Your contact information for follow-up.

**We aim to acknowledge all reports within 48 hours** and will provide an initial triage response within 5 business days.

---

## Disclosure Process

After receiving your report:

1. **Triage** — We assess severity using CVSS v3.1 and confirm reproducibility within 5 business days.
2. **Fix** — A patch is developed and reviewed in a private branch. For critical issues we target a patch within 7 days; for high/medium issues within 30 days.
3. **Coordinated Disclosure** — We notify you when the fix is ready and agree on an embargo date (typically 90 days from report, or sooner if the issue is already publicly known). A CVE may be requested.
4. **Release** — The fix is deployed and a security advisory is published on this repository.
5. **Credit** — With your permission, you will be acknowledged in the security advisory and added to the Hall of Fame below.

---

## Scope

### In Scope

| Target | Notes |
|--------|-------|
| All Hive Civilization services on Render | HiveGate, HiveTrust, HiveLaw, HiveBank, HiveForge, HiveHealth, HiveBorder, HiveDrift, Ambassador, and all MCP/A2A endpoints |
| `hive-agent-sdk` (npm + PyPI) | Any version listed as Supported above |
| Smart contract interactions | On-chain logic, vault operations, ATG guarantees, and streaming payment flows on Base L2 |
| x402 payment middleware | Authentication bypass, signature forgery, replay attacks |
| W3C DID / VCDM credential issuance | Credential forgery, DID enumeration, or revocation bypass |
| Agent trust scoring (HiveTrust) | Score manipulation, ZK proof spoofing |

### Out of Scope

| Target | Reason |
|--------|--------|
| Cheqd network infrastructure | Third-party DID registry — report to [security@cheqd.io](mailto:security@cheqd.io) |
| Base L2 (Coinbase) itself | Third-party blockchain — report via [Coinbase Security](https://hackerone.com/coinbase) |
| USDC smart contracts (Circle) | Third-party stablecoin — report via [Circle Security](https://www.circle.com/en/security) |
| Aleo network | Third-party ZK blockchain — report via [Aleo Security](https://github.com/AleoHQ) |
| Social engineering attacks against Hive personnel | Out of scope for a technical bug bounty |
| Denial-of-service attacks against shared infrastructure | Low-signal; please describe potential DDoS vectors in your report anyway |
| Vulnerabilities requiring physical access to hardware | Not applicable |

---

## Safe Harbor

Hive Civilization commits to the following when a reporter acts in good faith:

- We will not pursue legal action against you for security research that complies with this policy.
- We will not involve law enforcement in your report unless we believe there is evidence of bad-faith exploitation.
- We consider your research to be "authorised" under the Computer Fraud and Abuse Act (CFAA) and equivalent legislation.
- We ask that you: (1) avoid accessing or modifying user data without consent, (2) not disrupt production services, and (3) give us reasonable time to remediate before public disclosure.

---

## Hall of Fame

_Security researchers who have responsibly disclosed vulnerabilities to us — thank you._

| Researcher | Vulnerability Class | Date |
|------------|---------------------|------|
| _(No entries yet — be the first!)_ | — | — |

---

## Contact

- **Security email**: [steve@thehiveryiq.com](mailto:steve@thehiveryiq.com)
- **PGP key**: Available on request
- **Response SLA**: 48 hours acknowledgement

_This policy is inspired by [disclose.io](https://disclose.io) and follows responsible disclosure best practices._
