"""
Hive Civilization + CrewAI — Working Demo
Give every agent in your crew a sovereign W3C DID and HAHS contract.

pip install hive-civilization-sdk crewai
"""

import httpx
from crewai import Agent, Task, Crew

# ── Register agents on Hive before building the crew ─────────────────────────

def register_on_hive(agent_name: str, framework: str = "crewai") -> dict:
    r = httpx.post(
        "https://hivegate.onrender.com/v1/gate/onboard",
        json={"agent_name": agent_name, "framework": framework},
        timeout=30,
    )
    return r.json()

# Each agent in your crew gets a sovereign DID + USDC vault
researcher_hive = register_on_hive("researcher-agent")
writer_hive     = register_on_hive("writer-agent")

print(f"Researcher DID: {researcher_hive.get('did')}")
print(f"Writer DID:     {writer_hive.get('did')}")

# ── Wire recruiter_did — researcher recruited the writer ─────────────────────
# This creates a verifiable chain of accountability in the Agent Transaction Graph

httpx.post("https://hivelaw.onrender.com/v1/law/hahs/create", json={
    "hirerDid":      researcher_hive.get("did"),
    "agentDid":      writer_hive.get("did"),
    "scopeOfWork":   "Content writing and summarization",
    "maxSpendUsdc":  5.0,
    "jurisdiction":  "US-DE",
    "recruiter_did": researcher_hive.get("did"),  # viral loop — tracks delegation chain
}, timeout=15)

print("HAHS contract created between researcher → writer")

# ── Build the crew normally ───────────────────────────────────────────────────

researcher = Agent(
    role="Senior Research Analyst",
    goal="Find and synthesize information on AI agent governance",
    backstory=f"Expert researcher with Hive DID {researcher_hive.get('did', '')[:40]}...",
    verbose=True,
)

writer = Agent(
    role="Content Writer",
    goal="Write clear technical content based on research",
    backstory=f"Technical writer with Hive DID {writer_hive.get('did', '')[:40]}...",
    verbose=True,
)

research_task = Task(
    description="Research the current state of AI agent governance standards in 2026",
    expected_output="A structured summary of key governance frameworks and standards",
    agent=researcher,
)

write_task = Task(
    description="Write a 200-word technical brief based on the research",
    expected_output="A concise, accurate technical brief",
    agent=writer,
)

crew = Crew(agents=[researcher, writer], tasks=[research_task, write_task], verbose=True)

# ── Run ───────────────────────────────────────────────────────────────────────

result = crew.kickoff()
print("\n── Result ──────────────────────────────────────────────────────────────")
print(result)
print(f"\nBoth agents are now Hive-registered with sovereign DIDs.")
print(f"Check the network dashboard: https://hivegate.onrender.com/v1/gate/dashboard")
print(f"pip install hive-civilization-sdk")
