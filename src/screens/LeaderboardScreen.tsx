import { StyleSheet, Text, View } from "react-native";
import { Crown, Trophy, Zap } from "lucide-react-native";

import { AppBackground } from "@/components/AppBackground";
import { Card } from "@/components/Card";
import { GradientButton } from "@/components/GradientButton";
import { ScreenHeader } from "@/components/ScreenHeader";
import { colors } from "@/constants/colors";

const rankings = [
  { name: "나", points: "2,450P", avatar: "🙂" },
  { name: "지연이", points: "2,150P", avatar: "👩🏻" },
  { name: "민수", points: "1,980P", avatar: "👨🏻" },
  { name: "영희", points: "1,760P", avatar: "👩🏻‍🦰" },
  { name: "철수", points: "1,520P", avatar: "🧑🏻" }
];

export function LeaderboardScreen() {
  return (
    <AppBackground>
      <ScreenHeader title="리더보드" subtitle="친구들과 운세 점수를 비교하고 매일의 선택으로 포인트를 쌓아보세요." />

      <Card variant="light" style={styles.rankingCard}>
        <View style={styles.cardTitleRow}>
          <Trophy size={22} color={colors.primaryDeep} />
          <Text style={styles.cardTitle}>주간 행운 랭킹</Text>
        </View>
        {rankings.map((item, index) => (
          <View key={item.name} style={styles.rankRow}>
            <Text style={styles.rankNo}>{index + 1}</Text>
            <Text style={styles.rankAvatar}>{item.avatar}</Text>
            <Text style={styles.rankName}>{item.name}</Text>
            <Text style={styles.points}>{item.points}</Text>
          </View>
        ))}
        <GradientButton onPress={() => undefined}>운세 대결하기</GradientButton>
      </Card>

      <Card variant="light" style={styles.battleCard}>
        <Text style={styles.cardTitle}>운세 대결</Text>
        <View style={styles.battleFaces}>
          <View style={styles.face}>
            <Text style={styles.faceAvatar}>🙂</Text>
            <Text style={styles.faceName}>나</Text>
            <Text style={styles.percent}>85%</Text>
          </View>
          <Text style={styles.vs}>VS</Text>
          <View style={styles.face}>
            <Text style={styles.faceAvatar}>👩🏻</Text>
            <Text style={styles.faceName}>지연이</Text>
            <Text style={styles.percent}>65%</Text>
          </View>
        </View>
        <Text style={styles.topic}>오늘의 주제: 중요한 결정을 내리기 좋은 날은?</Text>
        <View style={styles.deadline}>
          <Zap size={16} color={colors.primaryDeep} />
          <Text style={styles.deadlineText}>결과 공개까지 08:15:32</Text>
        </View>
      </Card>

      <Card variant="dark" style={styles.badges}>
        <View style={styles.cardTitleRow}>
          <Crown size={22} color={colors.accentYellow} />
          <Text style={styles.darkTitle}>이번 주 배지</Text>
        </View>
        <View style={styles.badgeRow}>
          {["계획왕", "라벤더 운", "대화 고수"].map((badge) => (
            <View key={badge} style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          ))}
        </View>
      </Card>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  rankingCard: {
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
  rankRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 42,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 10
  },
  rankNo: {
    width: 22,
    color: colors.text,
    fontWeight: "900",
    fontSize: 16
  },
  rankAvatar: {
    width: 30,
    fontSize: 22
  },
  rankName: {
    flex: 1,
    color: colors.text,
    fontWeight: "800"
  },
  points: {
    color: colors.text,
    fontWeight: "900"
  },
  battleCard: {
    gap: 16
  },
  battleFaces: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around"
  },
  face: {
    alignItems: "center",
    gap: 4
  },
  faceAvatar: {
    fontSize: 48
  },
  faceName: {
    color: colors.text,
    fontWeight: "800"
  },
  percent: {
    color: colors.primaryDeep,
    fontSize: 24,
    fontWeight: "900"
  },
  vs: {
    color: colors.textMuted,
    fontWeight: "900"
  },
  topic: {
    color: "#514A70",
    textAlign: "center",
    fontWeight: "800",
    lineHeight: 20
  },
  deadline: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: colors.primarySoft
  },
  deadlineText: {
    color: colors.primaryDeep,
    fontWeight: "900",
    fontSize: 12
  },
  badges: {
    gap: 14
  },
  darkTitle: {
    color: colors.textLight,
    fontSize: 18,
    fontWeight: "900"
  },
  badgeRow: {
    flexDirection: "row",
    gap: 8
  },
  badge: {
    flex: 1,
    borderRadius: 16,
    minHeight: 56,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.14)"
  },
  badgeText: {
    color: colors.textLight,
    fontWeight: "900",
    fontSize: 12
  }
});
