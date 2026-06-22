import { PropsWithChildren } from "react";
import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { colors } from "@/constants/colors";

type Props = PropsWithChildren<{
  onPress: () => void;
  style?: ViewStyle;
}>;

export function GradientButton({ children, onPress, style }: Props) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [style, pressed && styles.pressed]}>
      <LinearGradient colors={[colors.primary, colors.primaryDeep]} style={styles.button}>
        <Text style={styles.label}>{children}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 50,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18
  },
  label: {
    color: colors.textLight,
    fontWeight: "800",
    fontSize: 15
  },
  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.99 }]
  }
});
