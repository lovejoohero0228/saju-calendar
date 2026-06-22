import { getBranchTenGod, getTenGod } from "manseryeok";
import type { EarthlyBranch, HeavenlyStem } from "manseryeok";

import { realSajuProvider } from "@/lib/sajuEngine";
import type { SajuChart, SajuPillar, UserProfile } from "@/types/profile";

const hiddenStemMap: Record<string, string[]> = {
  자: ["계"],
  축: ["신", "계", "기"],
  인: ["무", "병", "갑"],
  묘: ["을"],
  진: ["계", "을", "무"],
  사: ["경", "무", "병"],
  오: ["기", "정"],
  미: ["을", "정", "기"],
  신: ["무", "임", "경"],
  유: ["신"],
  술: ["정", "신", "무"],
  해: ["갑", "임"]
};

const twelveLifeOrder: Record<string, string[]> = {
  갑: ["해", "자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술"],
  을: ["오", "사", "진", "묘", "인", "축", "자", "해", "술", "유", "신", "미"],
  병: ["인", "묘", "진", "사", "오", "미", "신", "유", "술", "해", "자", "축"],
  정: ["유", "신", "미", "오", "사", "진", "묘", "인", "축", "자", "해", "술"],
  무: ["인", "묘", "진", "사", "오", "미", "신", "유", "술", "해", "자", "축"],
  기: ["유", "신", "미", "오", "사", "진", "묘", "인", "축", "자", "해", "술"],
  경: ["사", "오", "미", "신", "유", "술", "해", "자", "축", "인", "묘", "진"],
  신: ["자", "해", "술", "유", "신", "미", "오", "사", "진", "묘", "인", "축"],
  임: ["신", "유", "술", "해", "자", "축", "인", "묘", "진", "사", "오", "미"],
  계: ["묘", "인", "축", "자", "해", "술", "유", "신", "미", "오", "사", "진"]
};

const twelveLifeLabels = ["장생", "목욕", "관대", "임관", "제왕", "쇠", "병", "사", "묘", "절", "태", "양"];

const twelveSpiritTables: Record<string, Record<string, string>> = {
  신자진: {
    자: "겁살",
    축: "육해살",
    인: "역마살",
    묘: "재살",
    진: "화개살",
    사: "지살",
    오: "천살",
    미: "년살",
    신: "월살",
    유: "망신살",
    술: "장성살",
    해: "반안살"
  },
  인오술: {
    자: "천살",
    축: "년살",
    인: "월살",
    묘: "망신살",
    진: "장성살",
    사: "반안살",
    오: "겁살",
    미: "육해살",
    신: "역마살",
    유: "재살",
    술: "화개살",
    해: "지살"
  },
  사유축: {
    자: "재살",
    축: "화개살",
    인: "지살",
    묘: "천살",
    진: "년살",
    사: "월살",
    오: "망신살",
    미: "장성살",
    신: "반안살",
    유: "겁살",
    술: "육해살",
    해: "역마살"
  },
  해묘미: {
    자: "망신살",
    축: "장성살",
    인: "반안살",
    묘: "겁살",
    진: "육해살",
    사: "역마살",
    오: "재살",
    미: "화개살",
    신: "지살",
    유: "천살",
    술: "년살",
    해: "월살"
  }
};

const detailColumns: Array<{ key: keyof Pick<SajuChart, "year" | "month" | "day" | "hour">; label: string }> = [
  { key: "hour", label: "생시" },
  { key: "day", label: "생일" },
  { key: "month", label: "생월" },
  { key: "year", label: "생년" }
];

type SajuDetailColumn = {
  key: keyof Pick<SajuChart, "year" | "month" | "day" | "hour">;
  label: string;
  pillar: SajuPillar;
  stemGod: string;
  branchGod: string;
  hiddenStems: string;
  twelveLife: string;
  twelveSpirit: string;
};

export type SajuDetail = {
  chart: SajuChart;
  birthLine: string;
  locationLine: string;
  columns: SajuDetailColumn[];
};

function getSpiritGroup(yearBranch: string) {
  if (["신", "자", "진"].includes(yearBranch)) return "신자진";
  if (["인", "오", "술"].includes(yearBranch)) return "인오술";
  if (["사", "유", "축"].includes(yearBranch)) return "사유축";
  return "해묘미";
}

function getTwelveLife(dayStem: string, branch: string) {
  const order = twelveLifeOrder[dayStem];
  const index = order?.indexOf(branch) ?? -1;
  return index >= 0 ? twelveLifeLabels[index] : "";
}

function getTwelveSpirit(yearBranch: string, branch: string) {
  const group = getSpiritGroup(yearBranch);
  return twelveSpiritTables[group]?.[branch] ?? "";
}

function getHiddenStems(branch: string) {
  return hiddenStemMap[branch]?.join("") ?? "";
}

export function getSajuDetail(profile: UserProfile): SajuDetail {
  const chart = realSajuProvider.getChart(profile);
  const dayStem = chart.day.heavenlyStem;
  const yearBranch = chart.year.earthlyBranch;
  const birthLine = `${profile.calendarType === "solar" ? "양" : "음"} ${profile.birthDate} ${profile.birthTime ?? "12:00"} ${profile.birthLocation ?? "지역 미입력"}`;
  const locationLine = profile.birthLocation || "지역 미입력";

  const columns = detailColumns.map((column) => {
    const pillar = chart[column.key];

    return {
      ...column,
      pillar,
      stemGod: getTenGod(dayStem as HeavenlyStem, pillar.heavenlyStem as HeavenlyStem),
      branchGod: getBranchTenGod(dayStem as HeavenlyStem, pillar.earthlyBranch as EarthlyBranch),
      hiddenStems: getHiddenStems(pillar.earthlyBranch),
      twelveLife: getTwelveLife(dayStem, pillar.earthlyBranch),
      twelveSpirit: getTwelveSpirit(yearBranch, pillar.earthlyBranch)
    };
  });

  return {
    chart,
    birthLine,
    locationLine,
    columns
  };
}
