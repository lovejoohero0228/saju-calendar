import { StyleSheet, Text, View } from "react-native";
import type { ReactNode } from "react";
import { CalendarDays, Cookie, Sparkles, Star } from "lucide-react-native";

import { AppBackground } from "@/components/AppBackground";
import { Card } from "@/components/Card";
import { CategoryScoreBars } from "@/components/CategoryScoreBars";
import { FortuneCookieCard } from "@/components/FortuneCookieCard";
import { GradientButton } from "@/components/GradientButton";
import { ScreenHeader } from "@/components/ScreenHeader";
import { colors } from "@/constants/colors";
import { mockFortuneProvider } from "@/lib/fortuneEngine";
import { todayKey } from "@/lib/date";
import type { UserProfile } from "@/types/profile";

type Props = {
  profile: UserProfile;
  goCalendar: () => void;
};

const levelLabels: Record<"excellent" | "good" | "neutral" | "caution" | "avoid", string> = {
  excellent: "최상",
  good: "좋음",
  neutral: "보통",
  caution: "주의",
  avoid: "회피"
};

export function HomeScreen({ profile, goCalendar }: Props) {
  const today = todayKey();
  const fortune = mockFortuneProvider.getDayFortune(profile, today, "travel");
  const scores = [
    { label: "금전", value: mockFortuneProvider.getDayFortune(profile, today, "lottery").score, color: colors.accentYellow },
    { label: "연애", value: mockFortuneProvider.getDayFortune(profile, today, "confession").score, color: colors.accentPink },
    { label: "직장", value: mockFortuneProvider.getDayFortune(profile, today, "meeting").score, color: colors.accentBlue },
    { label: "건강", value: mockFortuneProvider.getDayFortune(profile, today, "travel").score, color: colors.accentGreen }
  ];

  return (
    <AppBackground>
      <ScreenHeader
        title={`${profile.name}님\n오늘은 움직임이 좋은 날`}
        subtitle="중요한 결정은 흐름을 보고, 일정은 좋은 시간대로 먼저 배치해보세요."
      />

      <Card variant="dark" style={styles.scoreCard}>
        <View style={styles.scoreTop}>
          <View style={styles.scoreCopy}>
            <Text style={styles.darkLabel}>오늘의 흐름 점수</Text>
            <Text style={styles.score}>
              {fortune.score}
              <Text style={styles.scoreUnit}>점</Text>
            </Text>
            <View style={styles.meterTrack}>
              <View style={[styles.meterFill, { width: `${fortune.score}%` }]} />
            </View>
            <View style={styles.chipRow}>
              <InfoChip label="흐름" value={levelLabels[fortune.level]} />
              <InfoChip label="행운 시간" value={fortune.luckyTime ?? "미정"} />
              <InfoChip label="행운 색" value={fortune.luckyColor ?? "미정"} />
            </View>
          </View>
          <View style={styles.crystal}>
            <Sparkles size={34} color={colors.accentYellow} />
          </View>
        </View>
        <Text style={styles.darkSummary}>{fortune.summary}</Text>
        <CategoryScoreBars scores={scores} dark />
      </Card>

      <View style={styles.quickGrid}>
        <QuickCard icon={<Star size={22} color={colors.primaryDeep} />} title="추천 행동" body={fortune.recommendedActions[0]} />
        <QuickCard icon={<CalendarDays size={22} color={colors.primaryDeep} />} title="좋은 시간" body={`${fortune.luckyTime ?? "오전"} 이후 일정 정리`} />
      </View>

      <Card variant="light" style={styles.actionCard}>
        <View style={styles.actionIcon}>
          <CalendarDays size={26} color={colors.primaryDeep} />
        </View>
        <View style={styles.actionCopy}>
          <Text style={styles.actionTitle}>이번 주 중 가장 좋은 날짜 찾기</Text>
          <Text style={styles.actionBody}>여행, 약속, 회의처럼 목적별로 날짜를 비교해보면 선택이 훨씬 쉬워집니다.</Text>
        </View>
        <GradientButton onPress={goCalendar}>캘린더 보기</GradientButton>
      </Card>

      <View style={styles.cookieTitleRow}>
        <Cookie size={20} color={colors.accentYellow} />
        <Text style={styles.sectionTitle}>매일의 짧은 메시지</Text>
      </View>
      <FortuneCookieCard />
    </AppBackground>
  );
}

function QuickCard({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return (
    <Card variant="light" style={styles.quickCard}>
      {icon}
      <Text style={styles.quickTitle}>{title}</Text>
      <Text style={styles.quickBody}>{body}</Text>
    </Card>
  );
}

function InfoChip({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoChip}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scoreCard: {
    gap: 16
  },
  scoreTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  scoreCopy: {
    flex: 1,
    gap: 10,
    paddingRight: 12
  },
  darkLabel: {
    color: colors.textSubtle,
    fontSize: 13,
    fontWeight: "800"
  },
  score: {
    color: colors.accentYellow,
    fontSize: 48,
    lineHeight: 54,
    fontWeight: "900"
  },
  scoreUnit: {
    color: colors.textLight,
    fontSize: 18
  },
  crystal: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(139,111,239,0.24)"
  },
  darkSummary: {
    color: colors.textLight,
    fontSize: 15,
    lineHeight: 23,
    fontWeight: "700"
  },
  meterTrack: {
    height: 10,
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.12)"
  },
  meterFill: {
    height: 10,
    borderRadius: 999,
    backgroundColor: colors.accentYellow
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  infoChip: {
    minWidth: 88,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)"
  },
  infoLabel: {
    color: colors.textSubtle,
    fontSize: 10,
    fontWeight: "800"
  },
  infoValue: {
    color: colors.textLight,
    marginTop: 2,
    fontSize: 12,
    fontWeight: "900"
  },
  quickGrid: {
    flexDirection: "row",
    gap: 12
  },
  quickCard: {
    flex: 1,
    minHeight: 140,
    gap: 10
  },
  quickTitle: {
    color: colors.primaryDeep,
    fontSize: 15,
    fontWeight: "900"
  },
  quickBody: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700"
  },
  actionCard: {
    gap: 12
  },
  actionIcon: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center"
  },
  actionCopy: {
    gap: 5
  },
  actionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900"
  },
  actionBody: {
    color: "#514A70",
    fontSize: 14,
    lineHeight: 20
  },
  cookieTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  sectionTitle: {
    color: colors.textLight,
    fontSize: 18,
    fontWeight: "900"
  }
});
