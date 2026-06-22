import { addMonths, format } from "date-fns";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react-native";

import { AppBackground } from "@/components/AppBackground";
import { Card } from "@/components/Card";
import { DateDetailCard } from "@/components/DateDetailCard";
import { MonthCalendar } from "@/components/MonthCalendar";
import { PurposeSelector } from "@/components/PurposeSelector";
import { ScreenHeader } from "@/components/ScreenHeader";
import { colors } from "@/constants/colors";
import { mockPeople } from "@/constants/mockPeople";
import { relationshipPurposes } from "@/constants/purposes";
import { getMonthGrid, toDateKey, todayKey } from "@/lib/date";
import { mockCompatibilityProvider } from "@/lib/compatibilityEngine";
import type { CompatibilityDay, FortunePurpose } from "@/types/fortune";
import type { UserProfile } from "@/types/profile";

type Props = {
  profile: UserProfile;
};

export function RelationshipsScreen({ profile }: Props) {
  const [selectedPersonId, setSelectedPersonId] = useState(mockPeople[0].id);
  const [purpose, setPurpose] = useState<FortunePurpose>("deepTalk");
  const [month, setMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(todayKey());
  const selectedPerson = mockPeople.find((person) => person.id === selectedPersonId) ?? mockPeople[0];

  const scores = useMemo(() => {
    return getMonthGrid(month).reduce<Record<string, CompatibilityDay>>((result, day) => {
      const key = toDateKey(day);
      result[key] = mockCompatibilityProvider.getCompatibilityDay(profile, selectedPerson, key, purpose);
      return result;
    }, {});
  }, [month, profile, purpose, selectedPerson]);

  const selected = scores[selectedDate] ?? mockCompatibilityProvider.getCompatibilityDay(profile, selectedPerson, selectedDate, purpose);
  const cautionDays = Object.values(scores)
    .filter((item) => item.level === "caution" || item.level === "avoid")
    .slice(0, 3);

  return (
    <AppBackground>
      <ScreenHeader title="인연 & 궁합" subtitle="사람별로 만나기 좋은 날과 조심할 날을 부드럽게 살펴보세요." />

      <View style={styles.peopleRow}>
        {mockPeople.map((person) => {
          const active = person.id === selectedPersonId;
          return (
            <Pressable
              key={person.id}
              onPress={() => setSelectedPersonId(person.id)}
              style={[styles.personChip, active && styles.personActive]}
            >
              <Text style={styles.avatar}>{person.avatar}</Text>
              <Text style={[styles.personName, active && styles.personNameActive]}>{person.name}</Text>
            </Pressable>
          );
        })}
      </View>

      <PurposeSelector purposes={relationshipPurposes} value={purpose} onChange={setPurpose} />

      <Card variant="light" style={styles.pairCard}>
        <View style={styles.pairTop}>
          <View style={styles.personBubble}>
            <Text style={styles.avatarLarge}>🙂</Text>
            <Text style={styles.bubbleName}>{profile.name}</Text>
          </View>
          <Heart size={28} color={colors.accentPink} fill={colors.accentPink} />
          <View style={styles.personBubble}>
            <Text style={styles.avatarLarge}>{selectedPerson.avatar}</Text>
            <Text style={styles.bubbleName}>{selectedPerson.name}</Text>
          </View>
        </View>
        <Text style={styles.pairSummary}>
          오늘은 {selected.score}점 흐름이에요. 중요한 대화는 짧게, 좋은 분위기는 길게 가져가보세요.
        </Text>
      </Card>

      <Card variant="light" style={styles.calendarCard}>
        <View style={styles.monthRow}>
          <ArrowButton icon="left" onPress={() => setMonth((value) => addMonths(value, -1))} />
          <Text style={styles.monthTitle}>{format(month, "yyyy년 M월")}</Text>
          <ArrowButton icon="right" onPress={() => setMonth((value) => addMonths(value, 1))} />
        </View>
        <MonthCalendar month={month} selectedDate={selectedDate} scores={scores} onSelectDate={setSelectedDate} />
      </Card>

      <DateDetailCard day={selected} />

      <Card variant="dark" style={styles.cautionCard}>
        <Text style={styles.cautionTitle}>피하면 편한 날</Text>
        <Text style={styles.cautionBody}>
          {cautionDays.map((item) => format(new Date(item.date), "M/d")).join(", ")}에는 감정 섞인 말보다 짧은 확인이 좋아요.
        </Text>
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
  peopleRow: {
    flexDirection: "row",
    gap: 8
  },
  personChip: {
    flex: 1,
    minHeight: 76,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.13)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)"
  },
  personActive: {
    backgroundColor: colors.card
  },
  avatar: {
    fontSize: 24
  },
  personName: {
    color: colors.textLight,
    fontSize: 12,
    fontWeight: "800"
  },
  personNameActive: {
    color: colors.primaryDeep
  },
  pairCard: {
    gap: 14
  },
  pairTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 18
  },
  personBubble: {
    alignItems: "center",
    gap: 6
  },
  avatarLarge: {
    fontSize: 44
  },
  bubbleName: {
    color: colors.text,
    fontWeight: "900"
  },
  pairSummary: {
    color: "#514A70",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center"
  },
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
  cautionCard: {
    gap: 8
  },
  cautionTitle: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: "900"
  },
  cautionBody: {
    color: colors.textSubtle,
    lineHeight: 21,
    fontWeight: "700"
  }
});
