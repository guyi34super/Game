import { v4 as uuid } from "uuid";
import { GameState, Employee, NetworkNode, Difficulty, DIFFICULTY_CONFIGS } from "./types";
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

export function createInitialState(difficulty: Difficulty = "medium"): GameState {
  const config = DIFFICULTY_CONFIGS[difficulty];
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
    difficulty,
    day: 1,
    hour: 8,
    company: {
      securityBudget: config.startingBudget,
      maxBudget: config.startingBudget * 2,
      income: config.income,
      reputation: config.startingReputation,
      maxReputation: 100,
      securityMaturity: config.startingStats.securityMaturity,
      employeeAwareness: config.startingStats.employeeAwareness,
      patchLevel: config.startingStats.patchLevel,
      aiDetectionLevel: config.startingStats.aiDetectionLevel,
      firewallStrength: config.startingStats.firewallStrength,
      incidentResponseTime: 10,
      dataEncryption: config.startingStats.dataEncryption,
      threatIntelligence: config.startingStats.threatIntelligence,
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
