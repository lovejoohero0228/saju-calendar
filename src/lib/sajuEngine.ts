import { calculateFourPillars } from "manseryeok";
import type { ElementPair, Pillar, YinYangPair } from "manseryeok";

import type { SajuProvider } from "@/types/fortune";
import type { SajuChart, SajuElement, SajuPillar, UserProfile } from "@/types/profile";

const elementMap: Record<string, SajuElement> = {
  목: "wood",
  화: "fire",
  토: "earth",
  금: "metal",
  수: "water"
};

export const elementLabels: Record<SajuElement, string> = {
  wood: "목",
  fire: "화",
  earth: "토",
  metal: "금",
  water: "수"
};

export const elementColors: Record<SajuElement, string> = {
  wood: "#5BCB89",
  fire: "#EF7E78",
  earth: "#F3BA58",
  metal: "#B6B9D6",
  water: "#70B8E8"
};

type BirthInput = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  isLunar: boolean;
  dayBoundary: "midnight" | "jasi" | "splitJasi";
};

function parseBirthDate(birthDate: string) {
  const [yearText, monthText, dayText] = birthDate.split("-");
  const year = Number.parseInt(yearText, 10);
  const month = Number.parseInt(monthText, 10);
  const day = Number.parseInt(dayText, 10);

  return {
    year: Number.isFinite(year) ? year : 1990,
    month: Number.isFinite(month) ? month : 1,
    day: Number.isFinite(day) ? day : 1
  };
}

function parseBirthTime(birthTime?: string) {
  if (!birthTime) {
    return { hour: 12, minute: 0 };
  }

  const [hourText, minuteText = "0"] = birthTime.split(":");
  const hour = Number.parseInt(hourText, 10);
  const minute = Number.parseInt(minuteText, 10);

  return {
    hour: Number.isFinite(hour) ? Math.max(0, Math.min(23, hour)) : 12,
    minute: Number.isFinite(minute) ? Math.max(0, Math.min(59, minute)) : 0
  };
}

function toBirthInput(profile: UserProfile): BirthInput {
  const date = parseBirthDate(profile.birthDate);
  const time = parseBirthTime(profile.birthTime);

  return {
    year: date.year,
    month: date.month,
    day: date.day,
    hour: time.hour,
    minute: time.minute,
    isLunar: profile.calendarType === "lunar",
    dayBoundary: "midnight"
  };
}

function mapElementName(name: string): SajuElement {
  return elementMap[name] ?? "earth";
}

function toPillar(pillar: Pillar, element: ElementPair, yinYang: YinYangPair): SajuPillar {
  return {
    heavenlyStem: pillar.heavenlyStem,
    earthlyBranch: pillar.earthlyBranch,
    element: mapElementName(element.stem),
    yinYang: yinYang.stem === "양" ? "yang" : "yin"
  };
}

function buildElementBalance(elementPairs: ElementPair[]) {
  const counts: Record<SajuElement, number> = {
    wood: 0,
    fire: 0,
    earth: 0,
    metal: 0,
    water: 0
  };

  elementPairs.forEach(({ stem, branch }) => {
    counts[mapElementName(stem)] += 1;
    counts[mapElementName(branch)] += 1;
  });

  const total = 8;
  return Object.fromEntries(
    (Object.entries(counts) as Array<[SajuElement, number]>).map(([key, value]) => [key, Math.round((value / total) * 100)])
  ) as Record<SajuElement, number>;
}

function summarizeChart(chart: { day: SajuPillar; elementBalance: Record<SajuElement, number> }) {
  const entries = Object.entries(chart.elementBalance).sort((left, right) => right[1] - left[1]);
  const dominant = entries[0][0] as SajuElement;
  const weakest = entries[entries.length - 1][0] as SajuElement;
  const dayMaster = elementLabels[chart.day.element];

  if (entries[0][1] - entries[entries.length - 1][1] <= 1) {
    return `오행이 비교적 고르게 분포된 편입니다. 일간은 ${dayMaster} 성향으로 읽힙니다.`;
  }

  return `${elementLabels[dominant]} 기운이 두드러지고 ${elementLabels[weakest]}은 약한 편입니다. 일간은 ${dayMaster} 성향입니다.`;
}

function computeChart(profile: UserProfile) {
  const input = toBirthInput(profile);
  const result = calculateFourPillars({
    year: input.year,
    month: input.month,
    day: input.day,
    hour: input.hour,
    minute: input.minute,
    isLunar: input.isLunar,
    dayBoundary: input.dayBoundary
  });

  const chart = {
    year: toPillar(result.year, result.yearElement, result.yearYinYang),
    month: toPillar(result.month, result.monthElement, result.monthYinYang),
    day: toPillar(result.day, result.dayElement, result.dayYinYang),
    hour: toPillar(result.hour, result.hourElement, result.hourYinYang)
  };

  return {
    ...chart,
    elementBalance: buildElementBalance([
      result.yearElement,
      result.monthElement,
      result.dayElement,
      result.hourElement
    ]),
    summary: ""
  };
}

export const realSajuProvider: SajuProvider = {
  getChart(profile: UserProfile): SajuChart {
    try {
      const chart = computeChart(profile);
      return {
        ...chart,
        summary: summarizeChart(chart)
      };
    } catch {
      const fallback: UserProfile = {
        ...profile,
        birthDate: "1990-01-01",
        birthTime: "12:00",
        calendarType: "solar"
      };
      const chart = computeChart(fallback);
      return {
        ...chart,
        summary: summarizeChart(chart)
      };
    }
  }
};

export const mockSajuProvider = realSajuProvider;
