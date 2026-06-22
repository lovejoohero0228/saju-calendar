import { StyleSheet, Text, View } from "react-native";
import type { ReactNode } from "react";

import { colors } from "@/constants/colors";

type Props = {
  title: string;
  subtitle?: string;
  right?: ReactNode;
};

export function ScreenHeader({ title, subtitle, right }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12
  },
  copy: {
    flex: 1
  },
  title: {
    color: colors.textLight,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "900"
  },
  subtitle: {
    marginTop: 6,
    color: colors.textSubtle,
    fontSize: 14,
    lineHeight: 20
  }
});
