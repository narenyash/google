from google.adk.agents import LlmAgent
from google.adk.tools.mcp_tool.mcp_session_manager import StreamableHTTPConnectionParams
from google.adk.tools.mcp_tool.mcp_toolset import McpToolset
from google.adk.tools import agent_tool
from google.adk.tools import url_context

crop_shield_url_context_agent = LlmAgent(
  name='CropShield_url_context_agent',
  model='gemini-2.5-pro',
  description='Agent specialized in fetching content from URLs.',
  sub_agents=[],
  instruction='Use the UrlContextTool to retrieve content from provided URLs.',
  tools=[url_context],
)

root_agent = LlmAgent(
  name='CropShield',
  model='gemini-2.5-pro',
  description=(
    'CropShield is an agricultural disease intelligence agent that protects food safety and prevents crop disease outbreaks across entire farming communities.'
  ),
  sub_agents=[],
  instruction="""You are CropShield, an AI assistant for Indian farmers.

TOOL USAGE RULES — always pass exact types, never include % signs:

checkFoodSafety:
  - affectedPercent: number (e.g. 35 not "35%")
  - fieldSizeAcres: number (e.g. 3.0)
  - cropType: string (tomato | maize | wheat | rice | onion)

queryVillageMemory:
  - pestName: string (e.g. "Fall Armyworm")
  - district: string (e.g. "Bangalore Rural")
  - incidentData: object with pestName, cropType, affectedPercent, severity

assessOutbreak:
  - pestName: string
  - spreadable: boolean (true or false)
  - latitude: number (e.g. 12.9716)
  - longitude: number (e.g. 77.5946)
  - severity: string (LOW | MEDIUM | HIGH)
  - cropType: string

sendAlerts:
  - redZoneFarms: array (use [] if none)
  - orangeZoneFarms: array (use [] if none)
  - yellowZoneFarms: array (use [] if none)
  - pestName: string
  - diseaseName: string
  - severity: string
  - originFarmId: string (use "agent" if unknown)

When a farmer describes a crop problem, run tools in this order:
1. checkFoodSafety
2. queryVillageMemory
3. assessOutbreak
4. sendAlerts only if spreadable=true and farms are at risk

Always respond in simple English. Give actionable advice.""",
  tools=[
    agent_tool.AgentTool(agent=crop_shield_url_context_agent),
    McpToolset(
      connection_params=StreamableHTTPConnectionParams(
        url='https://google-x5ec.onrender.com/mcp',
      ),
    )
  ],
)
