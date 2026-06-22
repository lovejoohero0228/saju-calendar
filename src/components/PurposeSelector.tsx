import { ScrollView, Pressable, StyleSheet, Text } from "react-native";

import { colors } from "@/constants/colors";
import { purposeLabels } from "@/constants/purposes";
import type { FortunePurpose } from "@/types/fortune";

type Props = {
  purposes: FortunePurpose[];
  value: FortunePurpose;
  onChange: (purpose: FortunePurpose) => void;
};

export function PurposeSelector({ purposes, value, onChange }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {purposes.map((purpose) => {
        const active = purpose === value;
        return (
          <Pressable
            key={purpose}
            onPress={() => onChange(purpose)}
            style={[styles.chip, active && styles.activeChip]}
          >
            <Text style={[styles.label, active && styles.activeLabel]}>{purposeLabels[purpose]}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 8,
    paddingRight: 20
  },
  chip: {
    height: 38,
    borderRadius: 19,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)"
  },
  activeChip: {
    backgroundColor: colors.card,
    borderColor: colors.primarySoft
  },
  label: {
    color: colors.textLight,
    fontWeight: "700",
    fontSize: 13
  },
  activeLabel: {
    color: colors.primaryDeep
  }
});
