import { useState } from "react";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { CalendarDays, Clock, MapPin, Sparkles } from "lucide-react-native";

import { AppBackground } from "@/components/AppBackground";
import { Card } from "@/components/Card";
import { GradientButton } from "@/components/GradientButton";
import { colors } from "@/constants/colors";
import type { UserProfile } from "@/types/profile";

type Props = {
  initialProfile?: UserProfile | null;
  onSubmit: (profile: UserProfile) => void;
};

export function OnboardingScreen({ initialProfile, onSubmit }: Props) {
  const [name, setName] = useState(initialProfile?.name ?? "나");
  const [birthDate, setBirthDate] = useState(initialProfile?.birthDate ?? "1995-08-15");
  const [birthTime, setBirthTime] = useState(initialProfile?.birthTime ?? "14:30");
  const [calendarType, setCalendarType] = useState<"solar" | "lunar">(
    initialProfile?.calendarType ?? "solar"
  );
  const [birthLocation, setBirthLocation] = useState(initialProfile?.birthLocation ?? "대한민국 서울");
  const [error, setError] = useState("");

  const submit = () => {
    if (!birthDate.trim()) {
      setError("생년월일은 꼭 입력해주세요.");
      return;
    }

    onSubmit({
      id: initialProfile?.id ?? "me",
      name: name.trim() || "나",
      birthDate: birthDate.trim(),
      birthTime: birthTime.trim() || "12:00",
      calendarType,
      birthLocation: birthLocation.trim(),
      gender: initialProfile?.gender ?? "none",
      createdAt: initialProfile?.createdAt ?? new Date().toISOString()
    });
  };

  return (
    <AppBackground>
      <View style={styles.hero}>
        <View style={styles.orbit}>
          <Sparkles size={30} color={colors.accentYellow} />
        </View>
        <Text style={styles.title}>매일의 선택을{"\n"}사주로 더 스마트하게.</Text>
        <Text style={styles.subtitle}>
          생년월일과 시간을 입력하면 오늘의 흐름, 좋은 날 캘린더, 관계 궁합을 바로 볼 수 있어요.
        </Text>
      </View>

      <Card variant="light" style={styles.form}>
        <Text style={styles.formTitle}>{initialProfile ? "내 사주 수정" : "내 사주 만들기"}</Text>
        <Field label="이름">
          <TextInput value={name} onChangeText={setName} style={styles.input} placeholder="나" />
        </Field>
        <Field label="생년월일">
          <View style={styles.inputWithIcon}>
            <CalendarDays size={18} color={colors.primaryDeep} />
            <TextInput
              value={birthDate}
              onChangeText={setBirthDate}
              style={styles.iconInput}
              placeholder="YYYY-MM-DD"
              keyboardType="numbers-and-punctuation"
            />
          </View>
        </Field>
        <Field label="태어난 시간">
          <View style={styles.inputWithIcon}>
            <Clock size={18} color={colors.primaryDeep} />
            <TextInput
              value={birthTime}
              onChangeText={setBirthTime}
              style={styles.iconInput}
              placeholder="모르면 비워두기"
              keyboardType="numbers-and-punctuation"
            />
          </View>
        </Field>
        <Field label="달력">
          <View style={styles.segment}>
            <SegmentButton label="양력" active={calendarType === "solar"} onPress={() => setCalendarType("solar")} />
            <SegmentButton label="음력" active={calendarType === "lunar"} onPress={() => setCalendarType("lunar")} />
          </View>
        </Field>
        <Field label="태어난 지역">
          <View style={styles.inputWithIcon}>
            <MapPin size={18} color={colors.primaryDeep} />
            <TextInput
              value={birthLocation}
              onChangeText={setBirthLocation}
              style={styles.iconInput}
              placeholder="선택 입력"
            />
          </View>
        </Field>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <GradientButton onPress={submit}>{initialProfile ? "저장하기" : "내 사주 만들기"}</GradientButton>
        <Text style={styles.disclaimer}>
          본 서비스는 오락 및 자기성찰을 위한 참고 콘텐츠입니다. 중요한 결정은 현실적인 정보와 전문가 판단을 함께 살펴보세요.
        </Text>
      </Card>
    </AppBackground>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

function SegmentButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.segmentButton, active && styles.segmentActive]}>
      <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: 12,
    paddingTop: 28,
    paddingBottom: 8
  },
  orbit: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)"
  },
  title: {
    color: colors.textLight,
    fontSize: 34,
    lineHeight: 42,
    fontWeight: "900"
  },
  subtitle: {
    color: colors.textSubtle,
    fontSize: 15,
    lineHeight: 23
  },
  form: {
    gap: 14
  },
  formTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900"
  },
  field: {
    gap: 8
  },
  label: {
    color: "#514A70",
    fontSize: 13,
    fontWeight: "800"
  },
  input: {
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    color: colors.text,
    fontWeight: "700"
  },
  inputWithIcon: {
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  iconInput: {
    flex: 1,
    color: colors.text,
    fontWeight: "700"
  },
  segment: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border
  },
  segmentButton: {
    flex: 1,
    minHeight: 40,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center"
  },
  segmentActive: {
    backgroundColor: colors.primarySoft
  },
  segmentText: {
    color: colors.textMuted,
    fontWeight: "800"
  },
  segmentTextActive: {
    color: colors.primaryDeep
  },
  error: {
    color: colors.danger,
    fontWeight: "800"
  },
  disclaimer: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18
  }
});
