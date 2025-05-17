import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PlayStats {
  [beatId: string]: {
    plays: number;
    lastPlayed: string;
  };
}

interface StatsState {
  playStats: PlayStats;
  incrementPlays: (beatId: string) => void;
  getTopBeats: (limit?: number) => Array<{ id: string; plays: number }>;
}

export const useStatsStore = create<StatsState>()(
  persist(
    (set, get) => ({
      playStats: {},
      incrementPlays: (beatId: string) =>
        set((state) => ({
          playStats: {
            ...state.playStats,
            [beatId]: {
              plays: (state.playStats[beatId]?.plays || 0) + 1,
              lastPlayed: new Date().toISOString(),
            },
          },
        })),
      getTopBeats: (limit = 10) => {
        const stats = get().playStats;
        return Object.entries(stats)
          .map(([id, data]) => ({
            id,
            plays: data.plays,
          }))
          .sort((a, b) => b.plays - a.plays)
          .slice(0, limit);
      },
    }),
    {
      name: 'stats-storage',
    }
  )
);