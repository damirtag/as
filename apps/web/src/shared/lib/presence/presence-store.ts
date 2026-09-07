import { create } from "zustand";

export interface PresenceStatus {
  isOnline: boolean;
  lastSeenAt: string | null;
}

interface PresenceState {
  statuses: Record<string, PresenceStatus>;
  setStatus: (userId: string, status: PresenceStatus) => void;
  clearStatuses: () => void;
}

export const usePresenceStore = create<PresenceState>((set) => ({
  statuses: {},
  setStatus: (userId, status) =>
    set((state) => ({
      statuses: { ...state.statuses, [userId]: status },
    })),
  clearStatuses: () => set({ statuses: {} }),
}));

export function usePresenceStatus(userId: string): PresenceStatus | undefined {
  return usePresenceStore((state) => state.statuses[userId]);
}
