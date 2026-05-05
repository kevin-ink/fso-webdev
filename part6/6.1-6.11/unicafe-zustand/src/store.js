import { create } from "zustand";

export const useStatisticsStore = create((set) => ({
  good: 0,
  neutral: 0,
  bad: 0,
  actions: {
    incrementGood: () => set((state) => ({ good: state.good + 1 })),
    incrementNeutral: () => set((state) => ({ neutral: state.neutral + 1 })),
    incrementBad: () => set((state) => ({ bad: state.bad + 1 })),
  },
}));

export const useStatistics = () => {
  const good = useStatisticsStore((state) => state.good);
  const neutral = useStatisticsStore((state) => state.neutral);
  const bad = useStatisticsStore((state) => state.bad);
  return { good, neutral, bad };
};

export const useStatisticsControls = () =>
  useStatisticsStore((state) => state.actions);
