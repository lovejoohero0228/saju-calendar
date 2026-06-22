import type { RelationshipProfile, UserProfile } from "./profile";

export type FortunePurpose =
  | "travel"
  | "lottery"
  | "confession"
  | "meeting"
  | "avoidBoss"
  | "spending"
  | "friendHangout"
  | "deepTalk"
  | "requestFavor"
  | "conflictCaution";

export type FortuneLevel = "excellent" | "good" | "neutral" | "caution" | "avoid";

export type FortuneDay = {
  date: string;
  purpose: FortunePurpose;
  score: number;
  level: FortuneLevel;
  title: string;
  summary: string;
  recommendedActions: string[];
  avoidActions: string[];
  luckyTime?: string;
  luckyColor?: string;
};

export type CompatibilityDay = {
  date: string;
  personAId: string;
  personBId: string;
  purpose: FortunePurpose;
  score: number;
  level: FortuneLevel;
  title: string;
  summary: string;
};

export interface SajuProvider {
  getChart(profile: UserProfile): import("./profile").SajuChart;
}

export interface FortuneProvider {
  getDayFortune(profile: UserProfile, date: string, purpose: FortunePurpose): FortuneDay;
}

export interface CompatibilityProvider {
  getCompatibilityDay(
    me: UserProfile,
    other: RelationshipProfile,
    date: string,
    purpose: FortunePurpose
  ): CompatibilityDay;
}
