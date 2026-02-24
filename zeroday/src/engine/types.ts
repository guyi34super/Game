export type AttackType =
  | "phishing"
  | "ransomware"
  | "zero_day"
  | "insider_threat"
  | "ddos"
  | "social_engineering"
  | "supply_chain"
  | "brute_force"
  | "man_in_the_middle"
  | "sql_injection";

export type Severity = "low" | "medium" | "high" | "critical";

export type IncidentStatus = "active" | "investigating" | "contained" | "resolved" | "failed";

export type EventChoice = {
  id: string;
  label: string;
  description: string;
  timeCost: number;
  moneyCost: number;
  reputationImpact: number;
  successRate: number;
  outcome?: string;
};

export type SecurityEvent = {
  id: string;
  type: AttackType;
  severity: Severity;
  title: string;
  description: string;
  source: string;
  timestamp: number;
  expiresAt: number;
  choices: EventChoice[];
  resolved: boolean;
  chosenAction?: string;
  outcome?: string;
};

export type Employee = {
  id: string;
  name: string;
  role: string;
  department: string;
  awarenessScore: number;
  riskScore: number;
  trained: boolean;
  compromised: boolean;
  productivity: number;
};

export type NetworkNode = {
  id: string;
  name: string;
  type: "server" | "workstation" | "firewall" | "router" | "database" | "cloud";
  status: "online" | "offline" | "compromised" | "patching";
  vulnerabilities: number;
  patchLevel: number;
  traffic: number;
  x?: number;
  y?: number;
};

export type Research = {
  id: string;
  name: string;
  description: string;
  category: "detection" | "prevention" | "response" | "ai";
  cost: number;
  duration: number;
  unlocked: boolean;
  researching: boolean;
  progress: number;
  effect: Partial<CompanyStats>;
  prerequisites: string[];
};

export type CompanyStats = {
  securityBudget: number;
  maxBudget: number;
  income: number;
  reputation: number;
  maxReputation: number;
  securityMaturity: number;
  employeeAwareness: number;
  patchLevel: number;
  aiDetectionLevel: number;
  firewallStrength: number;
  incidentResponseTime: number;
  dataEncryption: number;
  threatIntelligence: number;
};

export type GameLog = {
  id: string;
  timestamp: number;
  type: "info" | "warning" | "danger" | "success" | "critical";
  message: string;
  source: string;
};

export type GameState = {
  tick: number;
  gameSpeed: number;
  paused: boolean;
  gameOver: boolean;
  gameOverReason?: string;
  day: number;
  hour: number;
  company: CompanyStats;
  employees: Employee[];
  network: NetworkNode[];
  events: SecurityEvent[];
  logs: GameLog[];
  research: Research[];
  stats: {
    totalAttacks: number;
    attacksBlocked: number;
    attacksSucceeded: number;
    moneySpent: number;
    moneyLost: number;
    employeesTrained: number;
    patchesApplied: number;
    incidentsResolved: number;
    score: number;
  };
};
