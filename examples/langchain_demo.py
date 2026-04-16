"""
Hive Civilization + LangChain — Working Demo
Give your LangChain agent a sovereign W3C DID, verifiable credential,
and USDC vault in under 50 lines.

pip install hive-civilization-sdk langchain langchain-openai
"""

import httpx
from langchain_openai import ChatOpenAI
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.tools import tool

# ── Step 1: Register your agent on Hive ──────────────────────────────────────

def register_on_hive(agent_name: str) -> dict:
    """Give an agent a sovereign DID, VC, and USDC vault. Takes ~2 seconds."""
    r = httpx.post(
        "https://hivegate.onrender.com/v1/gate/onboard",
        json={"agent_name": agent_name, "framework": "langchain"},
        timeout=30,
    )
    return r.json()

hive = register_on_hive("my-langchain-agent")
print(f"DID:     {hive.get('did')}")
print(f"API Key: {hive.get('credentials', {}).get('api_key', '')[:20]}...")
print(f"Vault:   {hive.get('vault_id')}")

# ── Step 2: Check trust before it acts ───────────────────────────────────────

def check_trust(did: str) -> dict:
    r = httpx.get(
        f"https://hivetrust.onrender.com/v1/verify_agent_risk?agent_id={did}",
        timeout=15,
    )
    return r.json()

trust = check_trust(hive.get("did", ""))
print(f"Trust:   {trust.get('data', {}).get('verdict', 'UNKNOWN')}")

# ── Step 3: Define Hive-aware tools for your agent ───────────────────────────

@tool
def hive_trust_check(agent_did: str) -> str:
    """Check if an AI agent is trusted. Returns ALLOW, REVIEW, or BLOCK."""
    result = check_trust(agent_did)
    verdict = result.get("data", {}).get("verdict", "UNKNOWN")
    return f"Agent {agent_did[:30]}... trust verdict: {verdict}"

@tool
def hive_file_contract(scope: str, max_spend_usdc: float = 10.0) -> str:
    """Create an HAHS 1.0.0 legal contract for an agent task."""
    r = httpx.post(
        "https://hivelaw.onrender.com/v1/law/hahs/create",
        json={
            "hirerDid": hive.get("did"),
            "agentDid": hive.get("did"),
            "scopeOfWork": scope,
            "maxSpendUsdc": max_spend_usdc,
            "jurisdiction": "US-DE",
        },
        timeout=15,
    )
    data = r.json()
    contract_id = data.get("data", {}).get("agreement_id", "pending")
    return f"HAHS contract created: {contract_id} | Scope: {scope} | Max: ${max_spend_usdc} USDC"

# ── Step 4: Build the LangChain agent ────────────────────────────────────────

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

prompt = ChatPromptTemplate.from_messages([
    ("system", f"""You are a Hive-registered AI agent with sovereign identity.
Your DID: {hive.get('did')}
Your vault: {hive.get('vault_id')}
You can check trust scores and create legal contracts for any work you do.
Always check trust before interacting with unknown agents."""),
    ("human", "{input}"),
    ("placeholder", "{agent_scratchpad}"),
])

agent = create_tool_calling_agent(llm, [hive_trust_check, hive_file_contract], prompt)
executor = AgentExecutor(agent=agent, tools=[hive_trust_check, hive_file_contract], verbose=True)

# ── Step 5: Run it ────────────────────────────────────────────────────────────

result = executor.invoke({
    "input": "Check the trust score of did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK, then create a contract for 'market research and summarization' with a $5 USDC limit."
})

print("\n── Result ──────────────────────────────────────────────────────────────")
print(result["output"])
print(f"\nFull Hive network: https://thehiveryiq.com")
print(f"pip install hive-civilization-sdk")
