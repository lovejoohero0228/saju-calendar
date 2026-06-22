import type { FortunePurpose } from "@/types/fortune";

export const purposeLabels: Record<FortunePurpose, string> = {
  travel: "여행 가기",
  lottery: "복권 사기",
  confession: "고백하기",
  meeting: "회의 잡기",
  avoidBoss: "상사 피하기",
  spending: "지출 관리",
  friendHangout: "친구 만나기",
  deepTalk: "깊은 대화",
  requestFavor: "부탁하기",
  conflictCaution: "갈등 주의"
};

export const purposeShortLabels: Record<FortunePurpose, string> = {
  travel: "여행",
  lottery: "복권",
  confession: "고백",
  meeting: "회의",
  avoidBoss: "상사",
  spending: "지출",
  friendHangout: "친구",
  deepTalk: "대화",
  requestFavor: "부탁",
  conflictCaution: "주의"
};

export const personalPurposes: FortunePurpose[] = [
  "travel",
  "lottery",
  "confession",
  "meeting",
  "spending",
  "friendHangout"
];

export const relationshipPurposes: FortunePurpose[] = [
  "deepTalk",
  "requestFavor",
  "conflictCaution",
  "avoidBoss",
  "meeting"
];
