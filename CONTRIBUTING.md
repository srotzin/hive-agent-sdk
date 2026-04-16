# Contributing to Hive Civilization

Thank you for your interest in contributing! Hive Civilization is an open ecosystem for autonomous agent infrastructure. We welcome integrations, bug reports, documentation improvements, and framework adapters.

---

## Table of Contents

1. [Building a Hive Integration](#building-a-hive-integration)
2. [Submitting a Framework Integration](#submitting-a-framework-integration)
3. [Reporting Bugs](#reporting-bugs)
4. [Integration Bounty Program](#integration-bounty-program)
5. [Code Style](#code-style)
6. [License](#license)

---

## Building a Hive Integration

The fastest path to a working Hive integration is the **hive-agent-sdk**:

- **npm**: `npm install hive-agent-sdk`
- **PyPI**: `pip install hive-agent-sdk`
- **Source**: [github.com/srotzin/hive-agent-sdk](https://github.com/srotzin/hive-agent-sdk)

### Quickstart

```js
const { HiveClient } = require('hive-agent-sdk');

const hive = new HiveClient({ network: 'base' });

// Register an agent and receive a DID
const { did, credential } = await hive.gate.register({
  name: 'my-agent',
  capabilities: ['read', 'write'],
});

// Check trust score
const { score } = await hive.trust.getScore(did);

// Execute a payment
await hive.bank.pay({
  recipient: '0x78B3B3C356E89b5a69C488c6032509Ef4260B6bf',
  amountUsdc: '0.01',
  memo: 'hive-service-access',
});
```

See the [SDK README](https://github.com/srotzin/hive-agent-sdk#readme) for full API documentation.

---

## Submitting a Framework Integration

We maintain official hivemind adapters for the three most popular multi-agent frameworks. If you want to add support for another framework, the pattern is consistent across all three:

### Existing adapters (reference implementations)

| Framework | Repository |
|-----------|-----------|
| CrewAI    | [github.com/srotzin/crewai-hivemind](https://github.com/srotzin/crewai-hivemind) |
| AutoGen   | [github.com/srotzin/autogen-hivemind](https://github.com/srotzin/autogen-hivemind) |
| LangChain | [github.com/srotzin/langchain-hivemind](https://github.com/srotzin/langchain-hivemind) |

### Integration pattern

Every hivemind adapter must expose:

1. **Identity** — wrap `HiveClient.gate.register()` so agents get a `did:key` at creation time.
2. **Trust** — surface `HiveClient.trust.getScore(did)` as a property or method on the agent object.
3. **Payment** — expose `HiveClient.bank.pay()` as a callable tool/action within the framework.
4. **Tools** — optionally wrap HiveForge MCP tools using the framework's native tool interface.

### Pull request checklist

- [ ] Fork the relevant `*-hivemind` repository (or `hive-agent-sdk` for a new repo).
- [ ] Follow the naming convention: `<framework>-hivemind`.
- [ ] Include a `README.md` with installation steps and a working example.
- [ ] Include at least one integration test that registers an agent, reads a trust score, and performs a payment against the Hive testnet.
- [ ] Pass ESLint / Ruff (Python) checks — CI will run these automatically.
- [ ] Tag your PR with the `framework-integration` label.

---

## Reporting Bugs

Please use GitHub Issues on the relevant repository.

Before opening an issue:
1. Search existing issues to avoid duplicates.
2. Confirm you are on a [supported version](./SECURITY.md#supported-versions).

### Bug report template

```
**Summary**: One sentence description.

**Environment**:
- hive-agent-sdk version:
- Node.js / Python version:
- OS:

**Steps to reproduce**:
1. ...
2. ...

**Expected behaviour**: ...

**Actual behaviour**: ...

**Logs / stack trace** (if applicable):
```

For **security vulnerabilities**, do not open a public issue — see [SECURITY.md](./SECURITY.md).

---

## Integration Bounty Program

We pay **$10 USDC** for each approved working integration with a supported framework. See [BOUNTIES.md](./BOUNTIES.md) for the full list of open bounties and claim instructions.

### Currently open bounties

| Framework | Reward |
|-----------|--------|
| Semantic Kernel (Microsoft) | $10 USDC |
| Eliza (a16z) | $10 USDC |
| SmolAgents (HuggingFace) | $10 USDC |
| Haystack (deepset) | $10 USDC |
| AutoGPT | $10 USDC |
| MetaGPT | $10 USDC |
| Agno | $10 USDC |
| Phidata | $10 USDC |
| Camel-AI | $10 USDC |
| Vertex AI Agent Builder (Google) | $25 USDC |
| Bedrock Agents (AWS) | $25 USDC |
| Azure AI Agent Service (Microsoft) | $25 USDC |

### How to claim

1. Open a PR to [srotzin/hive-agent-sdk](https://github.com/srotzin/hive-agent-sdk).
2. Title it `[BOUNTY] <Framework Name> integration`.
3. Include a working test (see above).
4. Once merged, payment is sent to your agent's Hive vault DID (include it in your PR description).

---

## Code Style

We use a consistent style across all Hive Civilization JavaScript/TypeScript repositories:

### JavaScript / TypeScript

- **Linter**: [ESLint](https://eslint.org/) with the `eslint:recommended` ruleset.
- **Formatter**: [Prettier](https://prettier.io/) with default settings (2-space indent, single quotes, trailing commas).
- **Async**: Use `async/await` throughout — `Promise.then()` chains are not accepted in new code.
- **Modules**: CommonJS (`require`/`module.exports`) for Node.js packages; ESM for browser-facing code.
- **Naming**: `camelCase` for variables and functions, `PascalCase` for classes, `UPPER_SNAKE_CASE` for constants.

Run checks locally:

```bash
npm run lint      # ESLint
npm run format    # Prettier --check
npm test          # Jest
```

### Python

- **Linter**: [Ruff](https://docs.astral.sh/ruff/)
- **Formatter**: [Black](https://black.readthedocs.io/)
- **Type hints**: Required on all public functions.
- **Async**: `asyncio` / `async def` throughout.

```bash
ruff check .      # lint
black --check .   # format
pytest            # tests
```

---

## License

By contributing to Hive Civilization you agree that your contributions will be licensed under the **MIT License**. See [LICENSE](./LICENSE) for details.
