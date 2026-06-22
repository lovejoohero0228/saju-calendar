import { PropsWithChildren } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { colors } from "@/constants/colors";

type Props = PropsWithChildren<{
  variant?: "light" | "dark" | "soft";
  style?: ViewStyle;
}>;

export function Card({ children, variant = "light", style }: Props) {
  return (
    <View style={[styles.base, styles[variant], style]}>
      <LinearGradient
        pointerEvents="none"
        colors={variant === "dark" ? ["rgba(255,255,255,0.18)", "rgba(255,255,255,0)"] : ["rgba(255,255,255,0.6)", "rgba(255,255,255,0)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.accentBar}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 24,
    padding: 18,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5
  },
  light: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.8)"
  },
  soft: {
    backgroundColor: colors.cardAlt,
    borderWidth: 1,
    borderColor: colors.border
  },
  dark: {
    backgroundColor: "rgba(32, 26, 74, 0.82)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)"
  },
  accentBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24
  }
});
