import { create } from "zustand";

import { loadProfile, loadRelationships, saveProfile, saveRelationships } from "./storage";
import type { RelationshipProfile, UserProfile } from "@/types/profile";

type AppState = {
  profile: UserProfile | null;
  ready: boolean;
  editingProfile: boolean;
  relationships: RelationshipProfile[];
  hydrate: () => Promise<void>;
  setProfile: (profile: UserProfile) => Promise<void>;
  startProfileEdit: () => void;
  finishProfileEdit: () => void;
  loadRelationships: () => Promise<void>;
  addRelationship: (person: RelationshipProfile) => Promise<void>;
  removeRelationship: (id: string) => Promise<void>;
};

export const useAppStore = create<AppState>((set, get) => ({
  profile: null,
  ready: false,
  editingProfile: false,
  relationships: [],
  hydrate: async () => {
    const [profile, relationships] = await Promise.all([loadProfile(), loadRelationships()]);
    set({ profile, relationships, ready: true });
  },
  setProfile: async (profile) => {
    await saveProfile(profile);
    set({ profile, editingProfile: false });
  },
  startProfileEdit: () => set({ editingProfile: true }),
  finishProfileEdit: () => set({ editingProfile: false }),
  loadRelationships: async () => {
    const relationships = await loadRelationships();
    set({ relationships });
  },
  addRelationship: async (person) => {
    const current = get().relationships;
    if (current.some((item) => item.id === person.id)) {
      return;
    }
    const next = [...current, person];
    await saveRelationships(next);
    set({ relationships: next });
  },
  removeRelationship: async (id) => {
    const next = get().relationships.filter((item) => item.id !== id);
    await saveRelationships(next);
    set({ relationships: next });
  }
}));
