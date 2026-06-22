import { PropsWithChildren } from "react";
import { ScrollView, StyleSheet, View, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from "@/constants/colors";

const stars = [
  { top: 28, left: 26, size: 2 },
  { top: 72, right: 48, size: 3 },
  { top: 126, left: 310, size: 2 },
  { top: 196, left: 42, size: 2 },
  { top: 248, right: 76, size: 4 },
  { top: 334, left: 284, size: 2 },
  { top: 456, left: 56, size: 3 },
  { top: 604, right: 28, size: 2 }
];

type Props = PropsWithChildren<{
  scroll?: boolean;
  contentStyle?: ViewStyle;
}>;

export function AppBackground({ children, scroll = true, contentStyle }: Props) {
  const body = (
    <SafeAreaView style={styles.safe}>
      {stars.map((star, index) => (
        <View
          key={`${star.top}-${index}`}
          style={[
            styles.star,
            {
              top: star.top,
              left: star.left,
              right: star.right,
              width: star.size,
              height: star.size,
              borderRadius: star.size
            }
          ]}
        />
      ))}
      <View style={styles.moon} />
      {scroll ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, contentStyle]}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );

  return (
    <LinearGradient colors={[colors.bg, colors.bg2, colors.bg3]} style={styles.root}>
      {body}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1
  },
  safe: {
    flex: 1
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 112,
    gap: 16
  },
  content: {
    flex: 1,
    padding: 20
  },
  star: {
    position: "absolute",
    backgroundColor: colors.accentYellow,
    opacity: 0.9
  },
  moon: {
    position: "absolute",
    top: 30,
    right: 28,
    width: 36,
    height: 36,
    borderRadius: 18,
    borderLeftWidth: 8,
    borderLeftColor: colors.accentYellow,
    opacity: 0.9
  }
});
