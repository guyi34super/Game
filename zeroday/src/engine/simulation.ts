import { v4 as uuid } from "uuid";
import { GameState, GameLog, SecurityEvent } from "./types";
import { generateAttack } from "./attacks";

export function createLog(
  type: GameLog["type"],
  message: string,
  source: string,
  tick: number
): GameLog {
  return { id: uuid(), timestamp: tick, type, message, source };
}

export function gameTick(state: GameState): GameState {
  if (state.paused || state.gameOver) return state;

  const next = { ...state };
  next.tick = state.tick + 1;

  next.hour = 8 + (next.tick % 24);
  if (next.tick % 24 === 0 && next.tick > 0) {
    next.day = state.day + 1;
  }

  const newLogs: GameLog[] = [...state.logs];
  const newEvents: SecurityEvent[] = [...state.events];

  if (next.tick % 24 === 0) {
    next.company = {
      ...state.company,
      securityBudget: Math.min(
        state.company.securityBudget + state.company.income,
        state.company.maxBudget
      ),
    };
    newLogs.push(createLog("info", `Daily revenue: +$${state.company.income.toLocaleString()}`, "Finance", next.tick));
  }

  const attack = generateAttack(state.company, next.tick);
  if (attack) {
    newEvents.push(attack);
    next.stats = {
      ...state.stats,
      totalAttacks: state.stats.totalAttacks + 1,
    };
    newLogs.push(
      createLog(
        attack.severity === "critical" ? "critical" : attack.severity === "high" ? "danger" : "warning",
        `[${attack.severity.toUpperCase()}] ${attack.title}`,
        attack.source,
        next.tick
      )
    );
  }

  const expiredEvents: SecurityEvent[] = [];
  const activeEvents: SecurityEvent[] = [];
  for (const ev of newEvents) {
    if (!ev.resolved && next.tick > ev.expiresAt) {
      expiredEvents.push(ev);
    } else {
      activeEvents.push(ev);
    }
  }

  for (const ev of expiredEvents) {
    next.company = {
      ...next.company,
      reputation: Math.max(0, next.company.reputation - (ev.severity === "critical" ? 15 : ev.severity === "high" ? 8 : 3)),
    };
    const moneyLoss = ev.severity === "critical" ? 20000 : ev.severity === "high" ? 10000 : 3000;
    next.company.securityBudget = Math.max(0, next.company.securityBudget - moneyLoss);
    next.stats = {
      ...next.stats,
      attacksSucceeded: next.stats.attacksSucceeded + 1,
      moneyLost: next.stats.moneyLost + moneyLoss,
    };
    newLogs.push(
      createLog("danger", `ATTACK SUCCEEDED: ${ev.title} - Lost $${moneyLoss.toLocaleString()} and reputation`, "Incident Response", next.tick)
    );
    activeEvents.push({ ...ev, resolved: true, outcome: "expired" });
  }

  next.research = state.research.map((r) => {
    if (!r.researching) return r;
    const newProgress = r.progress + 1;
    if (newProgress >= r.duration) {
      newLogs.push(createLog("success", `Research complete: ${r.name}`, "R&D Lab", next.tick));
      const effect = r.effect;
      for (const [key, val] of Object.entries(effect)) {
        const k = key as keyof typeof next.company;
        if (k in next.company && typeof val === "number") {
          (next.company as Record<string, number>)[k] =
            Math.min(100, Math.max(0, (next.company[k] as number) + val));
        }
      }
      return { ...r, researching: false, progress: newProgress, unlocked: true };
    }
    return { ...r, progress: newProgress };
  });

  next.network = state.network.map((node) => {
    const newTraffic = Math.max(0, Math.min(100, node.traffic + (Math.random() - 0.5) * 20));
    if (node.status === "patching") {
      return { ...node, traffic: newTraffic, status: "online" as const, vulnerabilities: 0, patchLevel: 100 };
    }
    return { ...node, traffic: newTraffic };
  });

  next.employees = state.employees.map((emp) => {
    const riskDelta = (Math.random() - 0.5) * 5;
    return {
      ...emp,
      riskScore: Math.max(0, Math.min(100, emp.riskScore + riskDelta)),
      productivity: Math.max(40, Math.min(100, emp.productivity + (Math.random() - 0.5) * 3)),
    };
  });

  if (next.company.reputation <= 0) {
    next.gameOver = true;
    next.gameOverReason = "Your company's reputation has been destroyed. Clients have lost all trust.";
  }
  if (next.company.securityBudget <= 0 && next.company.income <= 0) {
    next.gameOver = true;
    next.gameOverReason = "Your company has gone bankrupt. No funds remaining.";
  }

  next.stats = {
    ...next.stats,
    score: Math.floor(
      next.stats.attacksBlocked * 100 +
      next.company.reputation * 50 +
      next.company.securityMaturity * 30 +
      next.stats.incidentsResolved * 75 -
      next.stats.attacksSucceeded * 200
    ),
  };

  next.events = activeEvents;
  next.logs = newLogs.slice(-200);

  return next;
}

export function resolveEvent(
  state: GameState,
  eventId: string,
  choiceId: string
): GameState {
  const event = state.events.find((e) => e.id === eventId);
  if (!event || event.resolved) return state;

  const choice = event.choices.find((c) => c.id === choiceId);
  if (!choice) return state;

  const success = Math.random() < choice.successRate;
  const next = { ...state };
  const newLogs = [...state.logs];

  next.company = {
    ...state.company,
    securityBudget: Math.max(0, state.company.securityBudget - choice.moneyCost),
    reputation: Math.max(0, Math.min(100, state.company.reputation + choice.reputationImpact)),
  };

  if (success) {
    next.stats = {
      ...state.stats,
      attacksBlocked: state.stats.attacksBlocked + 1,
      moneySpent: state.stats.moneySpent + choice.moneyCost,
      incidentsResolved: state.stats.incidentsResolved + 1,
    };
    newLogs.push(
      createLog("success", `Incident resolved: ${event.title} via "${choice.label}"`, "Incident Response", state.tick)
    );
  } else {
    const moneyLoss = event.severity === "critical" ? 15000 : event.severity === "high" ? 8000 : 3000;
    next.company.securityBudget = Math.max(0, next.company.securityBudget - moneyLoss);
    next.company.reputation = Math.max(0, next.company.reputation - 5);
    next.stats = {
      ...state.stats,
      attacksSucceeded: state.stats.attacksSucceeded + 1,
      moneySpent: state.stats.moneySpent + choice.moneyCost,
      moneyLost: state.stats.moneyLost + moneyLoss,
    };
    newLogs.push(
      createLog("danger", `Response failed: "${choice.label}" did not contain ${event.title}`, "Incident Response", state.tick)
    );
  }

  next.events = state.events.map((e) =>
    e.id === eventId
      ? { ...e, resolved: true, chosenAction: choice.label, outcome: success ? "success" : "failed" }
      : e
  );
  next.logs = newLogs;

  return next;
}
