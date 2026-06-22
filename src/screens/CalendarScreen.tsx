import { addMonths, format } from "date-fns";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";

import { AppBackground } from "@/components/AppBackground";
import { Card } from "@/components/Card";
import { DateDetailCard } from "@/components/DateDetailCard";
import { MonthCalendar } from "@/components/MonthCalendar";
import { PurposeSelector } from "@/components/PurposeSelector";
import { ScreenHeader } from "@/components/ScreenHeader";
import { colors, levelColors } from "@/constants/colors";
import { personalPurposes } from "@/constants/purposes";
import { getMonthGrid, toDateKey, todayKey } from "@/lib/date";
import { mockFortuneProvider } from "@/lib/fortuneEngine";
import type { FortuneDay, FortunePurpose } from "@/types/fortune";
import type { UserProfile } from "@/types/profile";

type Props = {
  profile: UserProfile;
};

export function CalendarScreen({ profile }: Props) {
  const [purpose, setPurpose] = useState<FortunePurpose>("travel");
  const [month, setMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(todayKey());

  const scores = useMemo(() => {
    return getMonthGrid(month).reduce<Record<string, FortuneDay>>((result, day) => {
      const key = toDateKey(day);
      result[key] = mockFortuneProvider.getDayFortune(profile, key, purpose);
      return result;
    }, {});
  }, [month, profile, purpose]);

  const selected = scores[selectedDate] ?? mockFortuneProvider.getDayFortune(profile, selectedDate, purpose);
  const betterDates = Object.values(scores)
    .filter((item) => item.score >= 75 && item.date !== selectedDate)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return (
    <AppBackground>
      <ScreenHeader title="좋은 날 캘린더" subtitle="목적을 고르면 날짜별 흐름을 한눈에 볼 수 있어요." />
      <PurposeSelector purposes={personalPurposes} value={purpose} onChange={setPurpose} />

      <Card variant="light" style={styles.calendarCard}>
        <View style={styles.monthRow}>
          <ArrowButton icon="left" onPress={() => setMonth((value) => addMonths(value, -1))} />
          <Text style={styles.monthTitle}>{format(month, "yyyy년 M월")}</Text>
          <ArrowButton icon="right" onPress={() => setMonth((value) => addMonths(value, 1))} />
        </View>
        <MonthCalendar month={month} selectedDate={selectedDate} scores={scores} onSelectDate={setSelectedDate} />
        <View style={styles.legend}>
          {[
            ["최고", "excellent"],
            ["좋음", "good"],
            ["보통", "neutral"],
            ["주의", "caution"],
            ["피해야", "avoid"]
          ].map(([label, level]) => (
            <View key={level} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: levelColors[level as keyof typeof levelColors] }]} />
              <Text style={styles.legendLabel}>{label}</Text>
            </View>
          ))}
        </View>
      </Card>

      <DateDetailCard day={selected} />

      <Card variant="dark" style={styles.betterCard}>
        <Text style={styles.betterTitle}>비슷하게 좋은 날</Text>
        <View style={styles.betterRow}>
          {betterDates.map((item) => (
            <Pressable key={item.date} onPress={() => setSelectedDate(item.date)} style={styles.betterChip}>
              <Text style={styles.betterDate}>{format(new Date(item.date), "M/d")}</Text>
              <Text style={styles.betterScore}>{item.score}점</Text>
            </Pressable>
          ))}
        </View>
      </Card>
    </AppBackground>
  );
}

function ArrowButton({ icon, onPress }: { icon: "left" | "right"; onPress: () => void }) {
  const Icon = icon === "left" ? ChevronLeft : ChevronRight;
  return (
    <Pressable onPress={onPress} style={styles.arrow}>
      <Icon size={20} color={colors.primaryDeep} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  calendarCard: {
    gap: 16
  },
  monthRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  arrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center"
  },
  monthTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900"
  },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5
  },
  legendDot: {
    width: 9,
    height: 9,
    borderRadius: 5
  },
  legendLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "800"
  },
  betterCard: {
    gap: 12
  },
  betterTitle: {
    color: colors.textLight,
    fontWeight: "900",
    fontSize: 16
  },
  betterRow: {
    flexDirection: "row",
    gap: 10
  },
  betterChip: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    gap: 4
  },
  betterDate: {
    color: colors.textLight,
    fontWeight: "900"
  },
  betterScore: {
    color: colors.accentYellow,
    fontWeight: "900",
    fontSize: 12
  }
});
