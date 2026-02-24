import { create } from "zustand";
import { GameState, Difficulty } from "@/engine/types";
import { createInitialState } from "@/engine/init";
import { gameTick, resolveEvent } from "@/engine/simulation";

type GameStore = GameState & {
  init: (difficulty?: Difficulty) => void;
  tick: number;
  doTick: () => void;
  togglePause: () => void;
  setSpeed: (speed: number) => void;
  handleEvent: (eventId: string, choiceId: string) => void;
  startResearch: (researchId: string) => void;
  trainEmployee: (employeeId: string) => void;
  patchNode: (nodeId: string) => void;
  hireEmployee: () => void;
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...createInitialState(),

  init: (difficulty?: Difficulty) => {
    const diff = difficulty ?? get().difficulty ?? "medium";
    set(createInitialState(diff));
  },

  doTick: () => {
    const state = get();
    const next = gameTick(state);
    set(next);
  },

  togglePause: () => set((s) => ({ paused: !s.paused })),

  setSpeed: (speed: number) => set({ gameSpeed: speed }),

  handleEvent: (eventId: string, choiceId: string) => {
    const state = get();
    const next = resolveEvent(state, eventId, choiceId);
    set(next);
  },

  startResearch: (researchId: string) => {
    const state = get();
    const research = state.research.find((r) => r.id === researchId);
    if (!research || research.unlocked || research.researching) return;
    if (state.company.securityBudget < research.cost) return;

    const prereqsMet = research.prerequisites.every(
      (p) => state.research.find((r) => r.id === p)?.unlocked
    );
    if (!prereqsMet) return;

    set({
      company: {
        ...state.company,
        securityBudget: state.company.securityBudget - research.cost,
      },
      research: state.research.map((r) =>
        r.id === researchId ? { ...r, researching: true, progress: 0 } : r
      ),
      stats: {
        ...state.stats,
        moneySpent: state.stats.moneySpent + research.cost,
      },
    });
  },

  trainEmployee: (employeeId: string) => {
    const state = get();
    const cost = 1000;
    if (state.company.securityBudget < cost) return;
    set({
      company: {
        ...state.company,
        securityBudget: state.company.securityBudget - cost,
        employeeAwareness: Math.min(100, state.company.employeeAwareness + 1),
      },
      employees: state.employees.map((e) =>
        e.id === employeeId
          ? {
              ...e,
              trained: true,
              awarenessScore: Math.min(100, e.awarenessScore + 15),
              riskScore: Math.max(0, e.riskScore - 10),
            }
          : e
      ),
      stats: {
        ...state.stats,
        moneySpent: state.stats.moneySpent + cost,
        employeesTrained: state.stats.employeesTrained + 1,
      },
    });
  },

  patchNode: (nodeId: string) => {
    const state = get();
    const cost = 2000;
    if (state.company.securityBudget < cost) return;
    set({
      company: {
        ...state.company,
        securityBudget: state.company.securityBudget - cost,
        patchLevel: Math.min(100, state.company.patchLevel + 2),
      },
      network: state.network.map((n) =>
        n.id === nodeId ? { ...n, status: "patching" as const } : n
      ),
      stats: {
        ...state.stats,
        moneySpent: state.stats.moneySpent + cost,
        patchesApplied: state.stats.patchesApplied + 1,
      },
    });
  },

  hireEmployee: () => {
    const state = get();
    const cost = 3000;
    if (state.company.securityBudget < cost) return;
    const { generateEmployeeName, generateDepartmentAndRole } = require("@/engine/names");
    const { v4: uuid } = require("uuid");
    const { first, last } = generateEmployeeName();
    const { department, role } = generateDepartmentAndRole();
    set({
      company: {
        ...state.company,
        securityBudget: state.company.securityBudget - cost,
      },
      employees: [
        ...state.employees,
        {
          id: uuid(),
          name: `${first} ${last}`,
          role,
          department,
          awarenessScore: 40 + Math.random() * 30,
          riskScore: Math.random() * 20,
          trained: false,
          compromised: false,
          productivity: 75 + Math.random() * 25,
        },
      ],
      stats: { ...state.stats, moneySpent: state.stats.moneySpent + cost },
    });
  },
}));
