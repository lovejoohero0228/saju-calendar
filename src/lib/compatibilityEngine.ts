import { purposeLabels } from "@/constants/purposes";
import type {
  CompatibilityDay,
  CompatibilityProvider,
  FortuneLevel,
  FortunePurpose
} from "@/types/fortune";
import type { RelationshipProfile, UserProfile } from "@/types/profile";
import { seededScore } from "./hash";
import { scoreToLevel } from "./fortuneEngine";

const relationCopy: Record<FortuneLevel, string> = {
  excellent: "서로의 리듬이 잘 맞는 날이에요. 중요한 이야기도 부드럽게 꺼내볼 수 있어요.",
  good: "가벼운 대화와 약속에 좋은 흐름이에요. 먼저 분위기를 편하게 만들어보세요.",
  neutral: "무난한 흐름이에요. 기대치를 낮추고 짧게 소통하면 좋아요.",
  caution: "작은 오해가 커질 수 있어요. 핵심만 차분하게 말해보세요.",
  avoid: "감정 충돌이 생기기 쉬운 흐름이에요. 중요한 부탁이나 보고는 다른 날을 추천해요."
};

export const mockCompatibilityProvider: CompatibilityProvider = {
  getCompatibilityDay(
    me: UserProfile,
    other: RelationshipProfile,
    date: string,
    purpose: FortunePurpose
  ): CompatibilityDay {
    const raw = seededScore(`${me.id}:${other.id}:${me.birthDate}:${other.birthDate}:${date}:${purpose}`);
    const bossPenalty = other.relationshipType === "boss" && purpose === "avoidBoss" ? -8 : 0;
    const score = Math.max(10, Math.min(97, raw + bossPenalty));
    const level = scoreToLevel(score);

    return {
      date,
      personAId: me.id,
      personBId: other.id,
      purpose,
      score,
      level,
      title: `${other.name}와 ${purposeLabels[purpose]} ${score}점`,
      summary: relationCopy[level]
    };
  }
};
