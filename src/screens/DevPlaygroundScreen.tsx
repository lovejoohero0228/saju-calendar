import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { CalendarDays, Clock, MapPin, RotateCcw, SlidersHorizontal, Sparkles } from "lucide-react-native";

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
  onApply: (profile: UserProfile) => Promise<void>;
};

const DEFAULT_DRAFT: UserProfile = {
  id: "preview",
  name: "Preview",
  birthDate: "2000-02-28",
  birthTime: "04:30",
  calendarType: "solar",
  birthLocation: "Seoul",
  gender: "none",
  createdAt: new Date().toISOString()
};

export function DevPlaygroundScreen({ profile, onApply }: Props) {
  const [draft, setDraft] = useState<UserProfile>(profile ?? DEFAULT_DRAFT);
  const [applyState, setApplyState] = useState<"idle" | "saving" | "done">("idle");

  useEffect(() => {
    setDraft(profile ?? DEFAULT_DRAFT);
    setApplyState("idle");
  }, [profile]);

  const detail = useMemo(() => getSajuDetail(draft), [draft]);
  const balance = useMemo(
    () =>
      Object.entries(detail.chart.elementBalance).map(([key, value]) => ({
        label: elementLabels[key as keyof typeof elementLabels],
        value,
        color: elementColors[key as keyof typeof elementColors]
      })),
    [detail.chart.elementBalance]
  );

  const updateField = <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const resetDraft = () => {
    setDraft(profile ?? DEFAULT_DRAFT);
    setApplyState("idle");
  };

  const applyDraft = async () => {
    try {
      setApplyState("saving");
      await onApply({
        ...draft,
        id: profile.id,
        createdAt: profile.createdAt
      });
      setApplyState("done");
    } catch {
      setApplyState("idle");
    }
  };

  return (
    <AppBackground>
      <ScreenHeader
        title="Dev Preview"
        subtitle="Change the inputs and the saju table updates immediately."
        right={<Sparkles size={18} color={colors.accentYellow} />}
      />

      <Card variant="light" style={styles.panel}>
        <View style={styles.panelHeader}>
          <SlidersHorizontal size={18} color={colors.primaryDeep} />
          <Text style={styles.panelTitle}>Inputs</Text>
          <View style={styles.headerSpacer} />
          <Pressable onPress={resetDraft} style={styles.iconButton}>
            <RotateCcw size={16} color={colors.primaryDeep} />
          </Pressable>
        </View>

        <Field label="Name" icon={<Sparkles size={16} color={colors.primaryDeep} />}>
          <TextInput
            value={draft.name}
            onChangeText={(value) => updateField("name", value)}
            style={styles.input}
            placeholder="Name"
          />
        </Field>

        <Field label="Birth date" icon={<CalendarDays size={16} color={colors.primaryDeep} />}>
          <TextInput
            value={draft.birthDate}
            onChangeText={(value) => updateField("birthDate", value)}
            style={styles.input}
            placeholder="YYYY-MM-DD"
            keyboardType="numbers-and-punctuation"
          />
        </Field>

        <Field label="Birth time" icon={<Clock size={16} color={colors.primaryDeep} />}>
          <TextInput
            value={draft.birthTime ?? ""}
            onChangeText={(value) => updateField("birthTime", value)}
            style={styles.input}
            placeholder="HH:MM"
            keyboardType="numbers-and-punctuation"
          />
        </Field>

        <Field label="Solar / Lunar">
          <View style={styles.segment}>
            <SegmentButton label="Solar" active={draft.calendarType === "solar"} onPress={() => updateField("calendarType", "solar")} />
            <SegmentButton label="Lunar" active={draft.calendarType === "lunar"} onPress={() => updateField("calendarType", "lunar")} />
          </View>
        </Field>

        <Field label="Birth place" icon={<MapPin size={16} color={colors.primaryDeep} />}>
          <TextInput
            value={draft.birthLocation ?? ""}
            onChangeText={(value) => updateField("birthLocation", value)}
            style={styles.input}
            placeholder="Birth place"
          />
        </Field>

        <GradientButton onPress={applyDraft} style={styles.applyButton}>
          {applyState === "saving" ? "Applying..." : applyState === "done" ? "Applied" : "Apply to app"}
        </GradientButton>
      </Card>

      <Card variant="light" style={styles.panel}>
        <View style={styles.panelHeader}>
          <Text style={styles.panelTitle}>Live result</Text>
        </View>

        <View style={styles.previewMeta}>
          <Text style={styles.previewLine}>{detail.birthLine}</Text>
          <Text style={styles.previewLine}>{detail.locationLine}</Text>
        </View>

        <SajuPillarTable detail={detail} />

        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>Summary</Text>
          <Text style={styles.summary}>{detail.chart.summary}</Text>
        </View>
      </Card>

      <Card variant="light" style={styles.panel}>
        <View style={styles.panelHeader}>
          <Text style={styles.panelTitle}>Element balance</Text>
        </View>
        <CategoryScoreBars scores={balance} />
      </Card>
    </AppBackground>
  );
}

function Field({ label, icon, children }: { label: string; icon?: ReactNode; children: ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.fieldRow}>
        {icon ? <View style={styles.fieldIcon}>{icon}</View> : null}
        <View style={styles.fieldBody}>{children}</View>
      </View>
    </View>
  );
}

function SegmentButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.segmentButton, active && styles.segmentButtonActive]}>
      <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  panel: {
    gap: 14
  },
  panelHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  panelTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900"
  },
  headerSpacer: {
    flex: 1
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(102,80,204,0.08)",
    borderWidth: 1,
    borderColor: "rgba(102,80,204,0.12)"
  },
  field: {
    gap: 8
  },
  fieldLabel: {
    color: "#514A70",
    fontSize: 13,
    fontWeight: "800"
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  fieldIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(102,80,204,0.08)",
    borderWidth: 1,
    borderColor: "rgba(102,80,204,0.12)"
  },
  fieldBody: {
    flex: 1
  },
  input: {
    minHeight: 44,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    color: colors.text,
    fontWeight: "700"
  },
  segment: {
    flexDirection: "row",
    gap: 8
  },
  segmentButton: {
    flex: 1,
    minHeight: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: colors.border
  },
  segmentButtonActive: {
    backgroundColor: colors.primarySoft,
    borderColor: "rgba(102,80,204,0.2)"
  },
  segmentText: {
    color: colors.textMuted,
    fontWeight: "800"
  },
  segmentTextActive: {
    color: colors.primaryDeep
  },
  applyButton: {
    marginTop: 2
  },
  previewMeta: {
    gap: 4
  },
  previewLine: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "700"
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
  }
});
