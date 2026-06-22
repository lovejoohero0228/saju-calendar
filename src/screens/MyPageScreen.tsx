import { StyleSheet, Text, View } from "react-native";
import { CalendarDays, Edit3, MapPin, Settings, Sparkles } from "lucide-react-native";

import { AppBackground } from "@/components/AppBackground";
import { Card } from "@/components/Card";
import { CategoryScoreBars } from "@/components/CategoryScoreBars";
import { GradientButton } from "@/components/GradientButton";
import { SajuPillarTable } from "@/components/SajuPillarTable";
import { ScreenHeader } from "@/components/ScreenHeader";
import { colors } from "@/constants/colors";
import { elementColors, elementLabels } from "@/lib/sajuEngine";
import { getSajuDetail } from "@/lib/sajuDetail";
import type { UserProfile } from "@/types/profile";

type Props = {
  profile: UserProfile;
  onEdit: () => void;
};

export function MyPageScreen({ profile, onEdit }: Props) {
  const detail = getSajuDetail(profile);
  const chart = detail.chart;
  const balance = Object.entries(chart.elementBalance).map(([key, value]) => ({
    label: elementLabels[key as keyof typeof elementLabels],
    value,
    color: elementColors[key as keyof typeof elementColors]
  }));

  return (
    <AppBackground>
      <ScreenHeader title="내 만세력" subtitle="생년월일시로 계산한 사주팔자를 이미지 순서와 비슷하게 정리했어요." />

      <Card variant="light" style={styles.profileCard}>
        <View style={styles.profileTop}>
          <View style={styles.avatar}>
            <Sparkles size={28} color={colors.accentYellow} />
          </View>
          <View style={styles.profileCopy}>
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.titleLine}>{detail.birthLine}</Text>
            <Text style={styles.titleLine}>{detail.locationLine}</Text>
          </View>
        </View>

        <View style={styles.profileActions}>
          <View style={styles.infoChip}>
            <CalendarDays size={14} color={colors.primaryDeep} />
            <Text style={styles.infoChipText}>{profile.calendarType === "solar" ? "양력" : "음력"}</Text>
          </View>
          <View style={styles.infoChip}>
            <MapPin size={14} color={colors.primaryDeep} />
            <Text style={styles.infoChipText}>{profile.birthLocation || "지역 미입력"}</Text>
          </View>
        </View>

        <GradientButton onPress={onEdit}>프로필 수정</GradientButton>
      </Card>

      <Card variant="light" style={styles.chartCard}>
        <View style={styles.cardTitleRow}>
          <Edit3 size={20} color={colors.primaryDeep} />
          <Text style={styles.cardTitle}>만세력 결과</Text>
        </View>
        <SajuPillarTable detail={detail} />
        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>요약</Text>
          <Text style={styles.summary}>{chart.summary}</Text>
        </View>
      </Card>

      <Card variant="light" style={styles.balanceCard}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardTitle}>오행 분포</Text>
        </View>
        <CategoryScoreBars scores={balance} />
      </Card>

      <Card variant="dark" style={styles.settingsCard}>
        <View style={styles.cardTitleRow}>
          <Settings size={20} color={colors.textLight} />
          <Text style={styles.darkTitle}>안내</Text>
        </View>
        <Text style={styles.disclaimer}>
          현재 앱은 실제 만세력 계산 엔진을 사용하지만, 12신살 같은 일부 보조 항목은 화면 표시용 기준으로 함께 보여줍니다.
        </Text>
      </Card>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    gap: 14
  },
  profileTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center"
  },
  profileCopy: {
    flex: 1,
    gap: 4
  },
  name: {
    color: colors.text,
    fontSize: 24,
    lineHeight: 28,
    fontWeight: "900"
  },
  titleLine: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700"
  },
  profileActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  infoChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "rgba(102,80,204,0.08)",
    borderWidth: 1,
    borderColor: "rgba(102,80,204,0.12)"
  },
  infoChipText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "800"
  },
  chartCard: {
    gap: 14
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  cardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900"
  },
  summaryBox: {
    gap: 4,
    padding: 14,
    borderRadius: 16,
    backgroundColor: "rgba(102,80,204,0.08)",
    borderWidth: 1,
    borderColor: "rgba(102,80,204,0.12)"
  },
  summaryLabel: {
    color: colors.primaryDeep,
    fontSize: 11,
    fontWeight: "900"
  },
  summary: {
    color: "#514A70",
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "700"
  },
  balanceCard: {
    gap: 14
  },
  settingsCard: {
    gap: 10
  },
  darkTitle: {
    color: colors.textLight,
    fontSize: 18,
    fontWeight: "900"
  },
  disclaimer: {
    color: colors.textSubtle,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "700"
  }
});
