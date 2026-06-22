import { create } from "zustand";

import { loadProfile, saveProfile } from "./storage";
import type { UserProfile } from "@/types/profile";

type AppState = {
  profile: UserProfile | null;
  ready: boolean;
  editingProfile: boolean;
  hydrate: () => Promise<void>;
  setProfile: (profile: UserProfile) => Promise<void>;
  startProfileEdit: () => void;
  finishProfileEdit: () => void;
};

export const useAppStore = create<AppState>((set) => ({
  profile: null,
  ready: false,
  editingProfile: false,
  hydrate: async () => {
    const profile = await loadProfile();
    set({ profile, ready: true });
  },
  setProfile: async (profile) => {
    await saveProfile(profile);
    set({ profile, editingProfile: false });
  },
  startProfileEdit: () => set({ editingProfile: true }),
  finishProfileEdit: () => set({ editingProfile: false })
}));
