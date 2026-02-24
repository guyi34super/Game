import { v4 as uuid } from "uuid";
import { GameState, GameLog, SecurityEvent, DIFFICULTY_CONFIGS } from "./types";
import { generateAttack } from "./attacks";

const LOG_BUFFER_SIZE = 200;

const SEVERITY_REP_LOSS: Record<string, number> = {
  critical: 15,
  high: 8,
  medium: 3,
  low: 3,
};

const SEVERITY_MONEY_LOSS: Record<string, number> = {
  critical: 20000,
  high: 10000,
  medium: 3000,
  low: 3000,
};

const SEVERITY_FAIL_LOSS: Record<string, number> = {
  critical: 15000,
  high: 8000,
  medium: 3000,
  low: 3000,
};

export function createLog(
  type: GameLog["type"],
  message: string,
  source: string,
  tick: number
): GameLog {
  return { id: uuid(), timestamp: tick, type, message, source };
}

function severityToLogType(severity: string): GameLog["type"] {
  if (severity === "critical") return "critical";
  if (severity === "high") return "danger";
  return "warning";
}

export function gameTick(state: GameState): GameState {
  if (state.paused || state.gameOver) return state;

  const tick = state.tick + 1;
  const hour = 8 + (tick % 24);
  const isNewDay = tick % 24 === 0 && tick > 0;
  const day = isNewDay ? state.day + 1 : state.day;

  const diffConfig = DIFFICULTY_CONFIGS[state.difficulty];
  const newLogs: GameLog[] = [];
  let company = state.company;
  let statsUpdate = state.stats;

  if (tick % 24 === 0) {
    company = {
      ...company,
      securityBudget: Math.min(company.securityBudget + company.income, company.maxBudget),
    };
    newLogs.push(createLog("info", `Daily revenue: +$${company.income.toLocaleString()}`, "Finance", tick));
  }

  const attack = generateAttack(company, tick, diffConfig.attackFrequencyMultiplier, diffConfig.eventExpiryMultiplier);
  const events: SecurityEvent[] = [];
  let totalAttacksInc = 0;
  let attacksSucceededInc = 0;
  let moneyLostInc = 0;

  if (attack) {
    totalAttacksInc = 1;
    newLogs.push(createLog(
      severityToLogType(attack.severity),
      `[${attack.severity.toUpperCase()}] ${attack.title}`,
      attack.source,
      tick
    ));
  }

  for (let i = 0; i < state.events.length; i++) {
    const ev = state.events[i];
    if (!ev.resolved && tick > ev.expiresAt) {
      const repLoss = Math.round((SEVERITY_REP_LOSS[ev.severity] ?? 3) * diffConfig.damageMultiplier);
      const moneyLoss = Math.round((SEVERITY_MONEY_LOSS[ev.severity] ?? 3000) * diffConfig.damageMultiplier);
      company = {
        ...company,
        reputation: Math.max(0, company.reputation - repLoss),
        securityBudget: Math.max(0, company.securityBudget - moneyLoss),
      };
      attacksSucceededInc++;
      moneyLostInc += moneyLoss;
      newLogs.push(createLog("danger", `ATTACK SUCCEEDED: ${ev.title} - Lost $${moneyLoss.toLocaleString()} and reputation`, "Incident Response", tick));
      events.push({ ...ev, resolved: true, outcome: "expired" });
    } else {
      events.push(ev);
    }
  }

  if (attack) events.push(attack);

  let researchChanged = false;
  const research = state.research.map((r) => {
    if (!r.researching) return r;
    researchChanged = true;
    const newProgress = r.progress + 1;
    if (newProgress >= r.duration) {
      newLogs.push(createLog("success", `Research complete: ${r.name}`, "R&D Lab", tick));
      const effect = r.effect;
      for (const [key, val] of Object.entries(effect)) {
        const k = key as keyof typeof company;
        if (k in company && typeof val === "number") {
          (company as Record<string, number>)[k] =
            Math.min(100, Math.max(0, (company[k] as number) + val));
        }
      }
      return { ...r, researching: false, progress: newProgress, unlocked: true };
    }
    return { ...r, progress: newProgress };
  });

  const network = state.network.map((node) => {
    const newTraffic = Math.max(0, Math.min(100, node.traffic + (Math.random() - 0.5) * 20));
    if (node.status === "patching") {
      return { ...node, traffic: newTraffic, status: "online" as const, vulnerabilities: 0, patchLevel: 100 };
    }
    if (Math.abs(newTraffic - node.traffic) < 0.01) return node;
    return { ...node, traffic: newTraffic };
  });

  const employees = state.employees.map((emp) => {
    const riskDelta = (Math.random() - 0.5) * 5;
    const prodDelta = (Math.random() - 0.5) * 3;
    return {
      ...emp,
      riskScore: Math.max(0, Math.min(100, emp.riskScore + riskDelta)),
      productivity: Math.max(40, Math.min(100, emp.productivity + prodDelta)),
    };
  });

  let gameOver = false;
  let gameOverReason: string | undefined;
  if (company.reputation <= 0) {
    gameOver = true;
    gameOverReason = "Your company's reputation has been destroyed. Clients have lost all trust.";
  }
  if (company.securityBudget <= 0 && company.income <= 0) {
    gameOver = true;
    gameOverReason = "Your company has gone bankrupt. No funds remaining.";
  }

  const updatedStats = {
    totalAttacks: statsUpdate.totalAttacks + totalAttacksInc,
    attacksBlocked: statsUpdate.attacksBlocked,
    attacksSucceeded: statsUpdate.attacksSucceeded + attacksSucceededInc,
    moneySpent: statsUpdate.moneySpent,
    moneyLost: statsUpdate.moneyLost + moneyLostInc,
    employeesTrained: statsUpdate.employeesTrained,
    patchesApplied: statsUpdate.patchesApplied,
    incidentsResolved: statsUpdate.incidentsResolved,
    score: 0,
  };
  updatedStats.score = Math.floor(
    updatedStats.attacksBlocked * 100 +
    company.reputation * 50 +
    company.securityMaturity * 30 +
    updatedStats.incidentsResolved * 75 -
    updatedStats.attacksSucceeded * 200
  );

  const combinedLogs = state.logs.length + newLogs.length > LOG_BUFFER_SIZE
    ? [...state.logs, ...newLogs].slice(-(LOG_BUFFER_SIZE))
    : [...state.logs, ...newLogs];

  return {
    tick,
    gameSpeed: state.gameSpeed,
    paused: state.paused,
    gameOver,
    gameOverReason,
    difficulty: state.difficulty,
    day,
    hour,
    company,
    employees,
    network,
    events,
    logs: combinedLogs,
    research: researchChanged ? research : state.research.some(r => r.researching) ? research : state.research,
    stats: updatedStats,
  };
}

export function resolveEvent(
  state: GameState,
  eventId: string,
  choiceId: string
): Partial<GameState> {
  const event = state.events.find((e) => e.id === eventId);
  if (!event || event.resolved) return {};

  const choice = event.choices.find((c) => c.id === choiceId);
  if (!choice) return {};

  const success = Math.random() < choice.successRate;
  const newLogs = [...state.logs];

  const company = {
    ...state.company,
    securityBudget: Math.max(0, state.company.securityBudget - choice.moneyCost),
    reputation: Math.max(0, Math.min(100, state.company.reputation + choice.reputationImpact)),
  };

  let stats: GameState["stats"];
  if (success) {
    stats = {
      ...state.stats,
      attacksBlocked: state.stats.attacksBlocked + 1,
      moneySpent: state.stats.moneySpent + choice.moneyCost,
      incidentsResolved: state.stats.incidentsResolved + 1,
    };
    newLogs.push(createLog("success", `Incident resolved: ${event.title} via "${choice.label}"`, "Incident Response", state.tick));
  } else {
    const moneyLoss = SEVERITY_FAIL_LOSS[event.severity] ?? 3000;
    company.securityBudget = Math.max(0, company.securityBudget - moneyLoss);
    company.reputation = Math.max(0, company.reputation - 5);
    stats = {
      ...state.stats,
      attacksSucceeded: state.stats.attacksSucceeded + 1,
      moneySpent: state.stats.moneySpent + choice.moneyCost,
      moneyLost: state.stats.moneyLost + moneyLoss,
    };
    newLogs.push(createLog("danger", `Response failed: "${choice.label}" did not contain ${event.title}`, "Incident Response", state.tick));
  }

  const events = state.events.map((e) =>
    e.id === eventId
      ? { ...e, resolved: true, chosenAction: choice.label, outcome: success ? "success" : "failed" }
      : e
  );

  return { company, stats, events, logs: newLogs };
}
