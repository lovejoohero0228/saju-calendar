export type Gender = "female" | "male" | "other" | "none";

export type UserProfile = {
  id: string;
  name: string;
  birthDate: string;
  birthTime?: string;
  calendarType: "solar" | "lunar";
  birthLocation?: string;
  gender?: Gender;
  createdAt: string;
};

export type SajuElement = "wood" | "fire" | "earth" | "metal" | "water";

export type SajuPillar = {
  heavenlyStem: string;
  earthlyBranch: string;
  element: SajuElement;
  yinYang: "yin" | "yang";
};

export type SajuChart = {
  year: SajuPillar;
  month: SajuPillar;
  day: SajuPillar;
  hour: SajuPillar;
  elementBalance: Record<SajuElement, number>;
  summary: string;
};

export type RelationshipProfile = {
  id: string;
  name: string;
  relationshipType: "friend" | "lover" | "family" | "boss" | "coworker";
  birthDate: string;
  birthTime?: string;
  avatar?: string;
  permissionStatus: "pending" | "accepted" | "mock";
};
