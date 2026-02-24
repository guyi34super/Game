import { v4 as uuid } from "uuid";
import { GameState, Employee, NetworkNode } from "./types";
import { generateEmployeeName, generateDepartmentAndRole, generateNodeName } from "./names";
import { RESEARCH_TREE } from "./research";

function createEmployee(): Employee {
  const { first, last } = generateEmployeeName();
  const { department, role } = generateDepartmentAndRole();
  return {
    id: uuid(),
    name: `${first} ${last}`,
    role,
    department,
    awarenessScore: 30 + Math.random() * 40,
    riskScore: Math.random() * 30,
    trained: false,
    compromised: false,
    productivity: 70 + Math.random() * 30,
  };
}

function createNetworkNode(type: NetworkNode["type"]): NetworkNode {
  return {
    id: uuid(),
    name: generateNodeName(type),
    type,
    status: "online",
    vulnerabilities: Math.floor(Math.random() * 5),
    patchLevel: 50 + Math.floor(Math.random() * 30),
    traffic: Math.floor(Math.random() * 100),
  };
}

export function createInitialState(): GameState {
  const employees: Employee[] = Array.from({ length: 25 }, () => createEmployee());
  const network: NetworkNode[] = [
    createNetworkNode("firewall"),
    createNetworkNode("router"),
    createNetworkNode("server"),
    createNetworkNode("server"),
    createNetworkNode("server"),
    createNetworkNode("database"),
    createNetworkNode("database"),
    createNetworkNode("cloud"),
    createNetworkNode("cloud"),
    createNetworkNode("workstation"),
    createNetworkNode("workstation"),
    createNetworkNode("workstation"),
  ];

  return {
    tick: 0,
    gameSpeed: 1,
    paused: false,
    gameOver: false,
    day: 1,
    hour: 8,
    company: {
      securityBudget: 100000,
      maxBudget: 200000,
      income: 5000,
      reputation: 80,
      maxReputation: 100,
      securityMaturity: 25,
      employeeAwareness: 35,
      patchLevel: 45,
      aiDetectionLevel: 10,
      firewallStrength: 40,
      incidentResponseTime: 10,
      dataEncryption: 30,
      threatIntelligence: 20,
    },
    employees,
    network,
    events: [],
    logs: [],
    research: RESEARCH_TREE.map((r) => ({ ...r })),
    stats: {
      totalAttacks: 0,
      attacksBlocked: 0,
      attacksSucceeded: 0,
      moneySpent: 0,
      moneyLost: 0,
      employeesTrained: 0,
      patchesApplied: 0,
      incidentsResolved: 0,
      score: 0,
    },
  };
}
