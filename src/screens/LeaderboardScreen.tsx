import { addDays } from "date-fns";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Crown, Trophy, Zap } from "lucide-react-native";

import { AppBackground } from "@/components/AppBackground";
import { Card } from "@/components/Card";
import { ScreenHeader } from "@/components/ScreenHeader";
import { colors, levelColors } from "@/constants/colors";
import { toDateKey, todayKey } from "@/lib/date";
import { mockFortuneProvider, scoreToLevel } from "@/lib/fortuneEngine";
import { useAppStore } from "@/lib/store";
import type { RelationshipProfile, UserProfile } from "@/types/profile";

type Props = {
  profile: UserProfile;
};

const relationTypeLabels: Record<RelationshipProfile["relationshipType"], string> = {
  friend: "친구",
  lover: "연인",
  family: "가족",
  boss: "상사",
  coworker: "직장동료"
};

type RankEntry = {
  id: string;
  name: string;
  avatar: string;
  badge: string;
  score: number;
  isMe: boolean;
};

function relationshipToProfile(person: RelationshipProfile): UserProfile {
  return {
    id: person.id,
    name: person.name,
    birthDate: person.birthDate,
    birthTime: person.birthTime,
    calendarType: "solar",
    createdAt: ""
  };
}

export function LeaderboardScreen({ profile }: Props) {
  const { relationships } = useAppStore();
  const today = todayKey();

  const ranking = useMemo<RankEntry[]>(() => {
    const myScore = mockFortuneProvider.getDayFortune(profile, today, "travel").score;
    const entries: RankEntry[] = [
      {
        id: profile.id,
        name: `${profile.name} (나)`,
        avatar: "🙂",
        badge: "나",
        score: myScore,
        isMe: true
      },
      ...relationships.map((person) => ({
        id: person.id,
        name: person.name,
        avatar: person.avatar ?? "🙂",
        badge: relationTypeLabels[person.relationshipType],
        score: mockFortuneProvider.getDayFortune(relationshipToProfile(person), today, "travel").score,
        isMe: false
      }))
    ];
    return entries.sort((left, right) => right.score - left.score);
  }, [profile, relationships, today]);

  const opponent = useMemo(() => {
    const others = ranking.filter((entry) => !entry.isMe);
    return others.length > 0 ? others[0] : null;
  }, [ranking]);

  const me = ranking.find((entry) => entry.isMe)!;

  const weeklyAverage = useMemo(() => {
    const base = new Date();
    let total = 0;
    for (let offset = 0; offset < 7; offset += 1) {
      total += mockFortuneProvider.getDayFortune(profile, toDateKey(addDays(base, offset)), "travel").score;
    }
    return Math.round(total / 7);
  }, [profile]);

  const weeklyBadge =
    weeklyAverage >= 80
      ? "이번 주의 흐름왕 👑"
      : weeklyAverage >= 65
        ? "꾸준한 흐름 ⭐"
        : "회복 중 🌱";

  const battleDiff = opponent ? Math.abs(me.score - opponent.score) : 0;
  const battleComment = opponent
    ? me.score >= opponent.score
      ? `오늘은 내가 ${battleDiff}점 앞서고 있어요 ✨`
      : `오늘은 ${opponent.name}이 ${battleDiff}점 앞서고 있어요 🔥`
    : "";

  return (
    <AppBackground>
      <ScreenHeader title="리더보드" subtitle="나와 인연들의 오늘 운세 점수를 비교하고 흐름을 확인해보세요." />

      <Card variant="light" style={styles.rankingCard}>
        <View style={styles.cardTitleRow}>
          <Trophy size={22} color={colors.primaryDeep} />
          <Text style={styles.cardTitle}>오늘의 행운 랭킹</Text>
        </View>
        {ranking.map((item, index) => (
          <View key={item.id} style={styles.rankRow}>
            <Text style={styles.rankNo}>{index === 0 ? "👑" : index + 1}</Text>
            <Text style={styles.rankAvatar}>{item.avatar}</Text>
            <View style={styles.rankNameWrap}>
              <Text style={styles.rankName} numberOfLines={1}>
                {item.name}
              </Text>
              <View style={styles.relBadge}>
                <Text style={styles.relBadgeText}>{item.badge}</Text>
              </View>
            </View>
            <View style={[styles.scoreDot, { backgroundColor: levelColors[scoreToLevel(item.score)] }]} />
            <Text style={styles.points}>{item.score}점</Text>
          </View>
        ))}
        {relationships.length === 0 ? (
          <Text style={styles.emptyHint}>인연을 추가하면 함께 순위를 비교할 수 있어요.</Text>
        ) : null}
      </Card>

      {opponent ? (
        <Card variant="light" style={styles.battleCard}>
          <Text style={styles.cardTitle}>오늘의 대결 상대</Text>
          <View style={styles.battleFaces}>
            <View style={styles.face}>
              <Text style={styles.faceAvatar}>{me.avatar}</Text>
              <Text style={styles.faceName}>나</Text>
              <Text style={styles.percent}>{me.score}점</Text>
            </View>
            <Text style={styles.vs}>VS</Text>
            <View style={styles.face}>
              <Text style={styles.faceAvatar}>{opponent.avatar}</Text>
              <Text style={styles.faceName} numberOfLines={1}>
                {opponent.name}
              </Text>
              <Text style={styles.percent}>{opponent.score}점</Text>
            </View>
          </View>
          <View style={styles.deadline}>
            <Zap size={16} color={colors.primaryDeep} />
            <Text style={styles.deadlineText}>{battleComment}</Text>
          </View>
        </Card>
      ) : null}

      <Card variant="dark" style={styles.badges}>
        <View style={styles.cardTitleRow}>
          <Crown size={22} color={colors.accentYellow} />
          <Text style={styles.darkTitle}>이번 주 배지</Text>
        </View>
        <View style={styles.weeklyRow}>
          <View style={styles.weeklyBadge}>
            <Text style={styles.weeklyBadgeText}>{weeklyBadge}</Text>
          </View>
          <Text style={styles.weeklyAvg}>주간 평균 {weeklyAverage}점</Text>
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
    minHeight: 46,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 10
  },
  rankNo: {
    width: 26,
    color: colors.text,
    fontWeight: "900",
    fontSize: 16,
    textAlign: "center"
  },
  rankAvatar: {
    width: 30,
    fontSize: 22
  },
  rankNameWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  rankName: {
    color: colors.text,
    fontWeight: "800",
    flexShrink: 1
  },
  relBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: colors.primarySoft
  },
  relBadgeText: {
    color: colors.primaryDeep,
    fontSize: 11,
    fontWeight: "800"
  },
  scoreDot: {
    width: 10,
    height: 10,
    borderRadius: 5
  },
  points: {
    color: colors.text,
    fontWeight: "900"
  },
  emptyHint: {
    color: "#514A70",
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
    paddingTop: 4
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
    gap: 4,
    maxWidth: "40%"
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
  weeklyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12
  },
  weeklyBadge: {
    flex: 1,
    borderRadius: 16,
    minHeight: 56,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.14)"
  },
  weeklyBadgeText: {
    color: colors.textLight,
    fontWeight: "900",
    fontSize: 14
  },
  weeklyAvg: {
    color: colors.textSubtle,
    fontWeight: "800",
    fontSize: 13
  }
});
