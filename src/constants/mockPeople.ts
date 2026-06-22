import type { RelationshipProfile } from "@/types/profile";

export const mockPeople: RelationshipProfile[] = [
  {
    id: "jiyeon",
    name: "지연이",
    relationshipType: "friend",
    birthDate: "1996-02-12",
    birthTime: "09:10",
    avatar: "👩🏻",
    permissionStatus: "mock"
  },
  {
    id: "minsu",
    name: "민수",
    relationshipType: "coworker",
    birthDate: "1992-11-03",
    birthTime: "18:20",
    avatar: "👨🏻",
    permissionStatus: "mock"
  },
  {
    id: "younghee",
    name: "영희",
    relationshipType: "lover",
    birthDate: "1994-04-29",
    birthTime: "21:00",
    avatar: "👩🏻‍🦰",
    permissionStatus: "mock"
  },
  {
    id: "boss",
    name: "김팀장님",
    relationshipType: "boss",
    birthDate: "1984-06-22",
    birthTime: "08:40",
    avatar: "🧑🏻‍💼",
    permissionStatus: "mock"
  }
];
