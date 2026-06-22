import { purposeLabels } from "@/constants/purposes";
import type { FortuneDay, FortuneLevel, FortuneProvider, FortunePurpose } from "@/types/fortune";
import type { UserProfile } from "@/types/profile";
import { seededPick, seededScore } from "./hash";

export function scoreToLevel(score: number): FortuneLevel {
  if (score >= 85) return "excellent";
  if (score >= 70) return "good";
  if (score >= 45) return "neutral";
  if (score >= 30) return "caution";
  return "avoid";
}

const levelTitles: Record<FortuneLevel, string[]> = {
  excellent: ["흐름이 아주 좋은 날", "기회가 열리는 날", "가볍게 움직여도 좋은 날"],
  good: ["시작하기 좋은 날", "대화가 부드러운 날", "계획을 정리하기 좋은 날"],
  neutral: ["무리 없이 지나가는 날", "천천히 살피기 좋은 날", "평소 루틴이 잘 맞는 날"],
  caution: ["속도를 낮추면 좋은 날", "말을 고르면 좋은 날", "지출과 약속을 점검할 날"],
  avoid: ["중요한 결정은 미루기", "오해를 조심할 날", "무리한 일정은 피하기"]
};

const purposeTone: Record<FortunePurpose, { good: string; action: string; avoid: string }> = {
  travel: {
    good: "이동운이 가볍고 새로운 경험을 받아들이기 좋아요.",
    action: "짧은 외출이나 일정 확정",
    avoid: "무리한 동선"
  },
  lottery: {
    good: "작은 재미를 즐기기 좋은 흐름이에요. 가벼운 시도에만 머물러보세요.",
    action: "소액으로 재미만 보기",
    avoid: "큰 기대나 과한 지출"
  },
  confession: {
    good: "감정 표현이 부드럽게 전달될 수 있어요.",
    action: "짧고 솔직한 마음 전하기",
    avoid: "상대의 답을 재촉하기"
  },
  meeting: {
    good: "정리된 말과 자료가 잘 통하는 날이에요.",
    action: "오전 회의와 안건 정리",
    avoid: "즉흥적인 방향 변경"
  },
  avoidBoss: {
    good: "긴장되는 보고는 핵심만 짧게 가져가면 좋아요.",
    action: "짧은 확인과 서면 정리",
    avoid: "감정 섞인 설명"
  },
  spending: {
    good: "필요한 소비와 충동구매를 구분하기 좋은 날이에요.",
    action: "장바구니 재검토",
    avoid: "즉시 결제"
  },
  friendHangout: {
    good: "가벼운 만남에서 기분 전환이 생기는 흐름이에요.",
    action: "편한 사람과 짧은 약속",
    avoid: "무거운 주제부터 꺼내기"
  },
  deepTalk: {
    good: "진심을 나누되 속도를 맞추는 것이 좋아요.",
    action: "상대 이야기를 먼저 듣기",
    avoid: "단정적인 표현"
  },
  requestFavor: {
    good: "부탁은 작고 구체적으로 말할수록 잘 전달돼요.",
    action: "요청 범위 명확히 하기",
    avoid: "한 번에 큰 부탁하기"
  },
  conflictCaution: {
    good: "감정의 온도를 낮추면 큰 충돌을 피할 수 있어요.",
    action: "대답 전 한 번 쉬기",
    avoid: "바로 반박하기"
  }
};

const luckyColors = ["라벤더", "스카이블루", "민트", "크림 옐로", "로즈 핑크", "실버"];

export const mockFortuneProvider: FortuneProvider = {
  getDayFortune(profile: UserProfile, date: string, purpose: FortunePurpose): FortuneDay {
    const base = seededScore(`${profile.id}:${profile.birthDate}:${date}:${purpose}`);
    const score = Math.max(12, Math.min(96, base));
    const level = scoreToLevel(score);
    const tone = purposeTone[purpose];

    return {
      date,
      purpose,
      score,
      level,
      title: `${purposeLabels[purpose]} ${seededPick(`${date}:title:${purpose}`, levelTitles[level])}`,
      summary: `${tone.good} 오늘은 ${score}점 흐름이라 ${score >= 70 ? "작게 실행해보기 좋아요." : "조금 여유를 두고 살펴보는 편이 좋아요."}`,
      recommendedActions: [tone.action, "오후 일정은 여유 있게 잡기", "결정 전 한 번 더 확인하기"],
      avoidActions: [tone.avoid, "과한 확신", "긴 메시지로 설명하기"],
      luckyTime: `${8 + (seededScore(`${date}:hour`) % 10)}:00`,
      luckyColor: seededPick(`${profile.id}:${date}:color`, luckyColors)
    };
  }
};

export const cookieMessages = [
  "새로운 기회가 다가오고 있어요. 열린 마음으로 받아들여보세요.",
  "오늘은 크게 바꾸기보다 작은 루틴을 지키는 쪽이 좋아요.",
  "말을 조금 부드럽게 고르면 관계 운이 편안해져요.",
  "오후에는 집중력이 살아나요. 미뤄둔 일을 하나만 정리해보세요.",
  "운은 준비된 쪽으로 기울어요. 오늘의 준비가 다음 선택을 가볍게 합니다."
];
