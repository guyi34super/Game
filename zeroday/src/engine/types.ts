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

export type Difficulty = "easy" | "medium" | "hard";

export type DifficultyConfig = {
  label: string;
  description: string;
  attackFrequencyMultiplier: number;
  damageMultiplier: number;
  eventExpiryMultiplier: number;
  startingBudget: number;
  income: number;
  startingReputation: number;
  startingStats: {
    securityMaturity: number;
    employeeAwareness: number;
    patchLevel: number;
    aiDetectionLevel: number;
    firewallStrength: number;
    dataEncryption: number;
    threatIntelligence: number;
  };
};

export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: {
    label: "Easy",
    description: "Relaxed pace. More budget, fewer and weaker attacks. Great for learning the ropes.",
    attackFrequencyMultiplier: 0.4,
    damageMultiplier: 0.6,
    eventExpiryMultiplier: 1.8,
    startingBudget: 180000,
    income: 8000,
    startingReputation: 90,
    startingStats: {
      securityMaturity: 40,
      employeeAwareness: 50,
      patchLevel: 60,
      aiDetectionLevel: 25,
      firewallStrength: 55,
      dataEncryption: 45,
      threatIntelligence: 35,
    },
  },
  medium: {
    label: "Medium",
    description: "Balanced challenge. Standard budget and attack frequency. The intended experience.",
    attackFrequencyMultiplier: 1.0,
    damageMultiplier: 1.0,
    eventExpiryMultiplier: 1.0,
    startingBudget: 100000,
    income: 5000,
    startingReputation: 80,
    startingStats: {
      securityMaturity: 25,
      employeeAwareness: 35,
      patchLevel: 45,
      aiDetectionLevel: 10,
      firewallStrength: 40,
      dataEncryption: 30,
      threatIntelligence: 20,
    },
  },
  hard: {
    label: "Hard",
    description: "Relentless attacks, tight budget, minimal defenses. Only for seasoned operators.",
    attackFrequencyMultiplier: 2.0,
    damageMultiplier: 1.6,
    eventExpiryMultiplier: 0.6,
    startingBudget: 60000,
    income: 3000,
    startingReputation: 65,
    startingStats: {
      securityMaturity: 12,
      employeeAwareness: 20,
      patchLevel: 30,
      aiDetectionLevel: 5,
      firewallStrength: 25,
      dataEncryption: 15,
      threatIntelligence: 10,
    },
  },
};

export type GameState = {
  tick: number;
  gameSpeed: number;
  paused: boolean;
  gameOver: boolean;
  gameOverReason?: string;
  difficulty: Difficulty;
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
