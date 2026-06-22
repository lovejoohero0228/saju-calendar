import { addMonths, format } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { ChevronLeft, ChevronRight, Heart, Plus, Trash2, UserPlus } from "lucide-react-native";

import { AppBackground } from "@/components/AppBackground";
import { Card } from "@/components/Card";
import { DateDetailCard } from "@/components/DateDetailCard";
import { GradientButton } from "@/components/GradientButton";
import { MonthCalendar } from "@/components/MonthCalendar";
import { PurposeSelector } from "@/components/PurposeSelector";
import { ScreenHeader } from "@/components/ScreenHeader";
import { colors } from "@/constants/colors";
import { relationshipPurposes } from "@/constants/purposes";
import { getMonthGrid, toDateKey, todayKey } from "@/lib/date";
import { mockCompatibilityProvider } from "@/lib/compatibilityEngine";
import { useAppStore } from "@/lib/store";
import type { CompatibilityDay, FortunePurpose } from "@/types/fortune";
import type { RelationshipProfile, UserProfile } from "@/types/profile";

type Props = {
  profile: UserProfile;
};

const relationTypeOptions: Array<{ key: RelationshipProfile["relationshipType"]; label: string; avatar: string }> = [
  { key: "friend", label: "친구", avatar: "🙂" },
  { key: "lover", label: "연인", avatar: "💞" },
  { key: "coworker", label: "직장동료", avatar: "🧑🏻‍💻" },
  { key: "boss", label: "상사", avatar: "🧑🏻‍💼" },
  { key: "family", label: "가족", avatar: "👨‍👩‍👧" }
];

export function RelationshipsScreen({ profile }: Props) {
  const { relationships, addRelationship, removeRelationship } = useAppStore();

  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [purpose, setPurpose] = useState<FortunePurpose>("deepTalk");
  const [month, setMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(todayKey());

  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState("");
  const [formBirthDate, setFormBirthDate] = useState("");
  const [formBirthTime, setFormBirthTime] = useState("");
  const [formType, setFormType] = useState<RelationshipProfile["relationshipType"]>("friend");

  useEffect(() => {
    if (relationships.length === 0) {
      if (selectedPersonId !== null) setSelectedPersonId(null);
      return;
    }
    if (!selectedPersonId || !relationships.some((person) => person.id === selectedPersonId)) {
      setSelectedPersonId(relationships[0].id);
    }
  }, [relationships, selectedPersonId]);

  const selectedPerson =
    relationships.find((person) => person.id === selectedPersonId) ?? null;

  const scores = useMemo(() => {
    if (!selectedPerson) return {} as Record<string, CompatibilityDay>;
    return getMonthGrid(month).reduce<Record<string, CompatibilityDay>>((result, day) => {
      const key = toDateKey(day);
      result[key] = mockCompatibilityProvider.getCompatibilityDay(profile, selectedPerson, key, purpose);
      return result;
    }, {});
  }, [month, profile, purpose, selectedPerson]);

  const selected = selectedPerson
    ? scores[selectedDate] ??
      mockCompatibilityProvider.getCompatibilityDay(profile, selectedPerson, selectedDate, purpose)
    : null;

  const cautionDays = Object.values(scores)
    .filter((item) => item.level === "caution" || item.level === "avoid")
    .slice(0, 3);

  const resetForm = () => {
    setFormName("");
    setFormBirthDate("");
    setFormBirthTime("");
    setFormType("friend");
  };

  const handleAdd = () => {
    const name = formName.trim();
    const birthDate = formBirthDate.trim();
    if (!name || !birthDate) return;

    const avatar = relationTypeOptions.find((option) => option.key === formType)?.avatar ?? "🙂";
    void addRelationship({
      id: Date.now().toString(),
      name,
      relationshipType: formType,
      birthDate,
      birthTime: formBirthTime.trim() || undefined,
      avatar,
      permissionStatus: "accepted"
    });
    resetForm();
    setShowForm(false);
  };

  return (
    <AppBackground>
      <ScreenHeader title="인연 & 궁합" subtitle="사람별로 만나기 좋은 날과 조심할 날을 부드럽게 살펴보세요." />

      <View style={styles.addRow}>
        <Pressable
          onPress={() => setShowForm((value) => !value)}
          style={styles.addButton}
        >
          <Plus size={18} color={colors.primaryDeep} />
          <Text style={styles.addButtonText}>인연 추가</Text>
        </Pressable>
      </View>

      {showForm ? (
        <Card variant="light" style={styles.formCard}>
          <Text style={styles.formTitle}>새로운 인연</Text>
          <TextInput
            value={formName}
            onChangeText={setFormName}
            placeholder="이름"
            placeholderTextColor="#9A93B5"
            style={styles.input}
          />
          <TextInput
            value={formBirthDate}
            onChangeText={setFormBirthDate}
            placeholder="생년월일 (YYYY-MM-DD)"
            placeholderTextColor="#9A93B5"
            style={styles.input}
          />
          <TextInput
            value={formBirthTime}
            onChangeText={setFormBirthTime}
            placeholder="태어난 시간 (HH:MM, 선택)"
            placeholderTextColor="#9A93B5"
            style={styles.input}
          />
          <View style={styles.typeRow}>
            {relationTypeOptions.map((option) => {
              const active = option.key === formType;
              return (
                <Pressable
                  key={option.key}
                  onPress={() => setFormType(option.key)}
                  style={[styles.typeChip, active && styles.typeChipActive]}
                >
                  <Text style={[styles.typeChipText, active && styles.typeChipTextActive]}>{option.label}</Text>
                </Pressable>
              );
            })}
          </View>
          <GradientButton onPress={handleAdd}>추가</GradientButton>
        </Card>
      ) : null}

      {relationships.length === 0 ? (
        <Card variant="light" style={styles.emptyCard}>
          <UserPlus size={28} color={colors.primaryDeep} />
          <Text style={styles.emptyText}>아직 등록된 인연이 없어요. 먼저 추가해보세요.</Text>
        </Card>
      ) : (
        <View style={styles.peopleRow}>
          {relationships.map((person) => {
            const active = person.id === selectedPersonId;
            return (
              <Pressable
                key={person.id}
                onPress={() => setSelectedPersonId(person.id)}
                style={[styles.personChip, active && styles.personActive]}
              >
                <Pressable
                  onPress={() => void removeRelationship(person.id)}
                  style={styles.deleteButton}
                  hitSlop={8}
                >
                  <Trash2 size={14} color={active ? colors.primaryDeep : colors.textSubtle} />
                </Pressable>
                <Text style={styles.avatar}>{person.avatar}</Text>
                <Text style={[styles.personName, active && styles.personNameActive]}>{person.name}</Text>
              </Pressable>
            );
          })}
        </View>
      )}

      {selectedPerson && selected ? (
        <>
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

          {cautionDays.length > 0 ? (
            <Card variant="dark" style={styles.cautionCard}>
              <Text style={styles.cautionTitle}>피하면 편한 날</Text>
              <Text style={styles.cautionBody}>
                {cautionDays.map((item) => format(new Date(item.date), "M/d")).join(", ")}에는 감정 섞인 말보다 짧은 확인이 좋아요.
              </Text>
            </Card>
          ) : null}
        </>
      ) : null}
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
  addRow: {
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 16,
    backgroundColor: colors.primarySoft
  },
  addButtonText: {
    color: colors.primaryDeep,
    fontWeight: "900",
    fontSize: 13
  },
  formCard: {
    gap: 12
  },
  formTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900"
  },
  input: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: colors.primarySoft,
    color: colors.text,
    fontSize: 14,
    fontWeight: "700"
  },
  typeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  typeChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: "rgba(102,80,204,0.08)",
    borderWidth: 1,
    borderColor: "rgba(102,80,204,0.12)"
  },
  typeChipActive: {
    backgroundColor: colors.primaryDeep,
    borderColor: colors.primaryDeep
  },
  typeChipText: {
    color: colors.primaryDeep,
    fontWeight: "800",
    fontSize: 13
  },
  typeChipTextActive: {
    color: colors.textLight
  },
  emptyCard: {
    alignItems: "center",
    gap: 10,
    paddingVertical: 28
  },
  emptyText: {
    color: "#514A70",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center"
  },
  peopleRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  personChip: {
    minWidth: 76,
    flexGrow: 1,
    flexBasis: "22%",
    minHeight: 84,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingTop: 10,
    backgroundColor: "rgba(255,255,255,0.13)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)"
  },
  personActive: {
    backgroundColor: colors.card
  },
  deleteButton: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.18)"
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
