import { StyleSheet, Text, View } from "react-native";
import { format, parseISO } from "date-fns";

import { colors, levelColors } from "@/constants/colors";
import type { CompatibilityDay, FortuneDay } from "@/types/fortune";
import { Card } from "./Card";

type Props = {
  day: FortuneDay | CompatibilityDay;
};

export function DateDetailCard({ day }: Props) {
  const fortune = "recommendedActions" in day ? day : null;

  return (
    <Card variant="soft" style={styles.card}>
      <View style={styles.top}>
        <Text style={styles.date}>{format(parseISO(day.date), "M월 d일")}</Text>
        <View style={[styles.badge, { backgroundColor: levelColors[day.level] }]}>
          <Text style={styles.badgeText}>{day.score}점</Text>
        </View>
      </View>
      <Text style={styles.title}>{day.title}</Text>
      <Text style={styles.summary}>{day.summary}</Text>
      {fortune ? (
        <View style={styles.columns}>
          <View style={styles.column}>
            <Text style={styles.smallTitle}>추천</Text>
            {fortune.recommendedActions.slice(0, 2).map((item) => (
              <Text key={item} style={styles.item}>
                • {item}
              </Text>
            ))}
          </View>
          <View style={styles.column}>
            <Text style={styles.smallTitle}>주의</Text>
            {fortune.avoidActions.slice(0, 2).map((item) => (
              <Text key={item} style={styles.item}>
                • {item}
              </Text>
            ))}
          </View>
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 10
  },
  top: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  date: {
    color: colors.primaryDeep,
    fontWeight: "900",
    fontSize: 15
  },
  badge: {
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  badgeText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "900"
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 23
  },
  summary: {
    color: "#3E3863",
    fontSize: 14,
    lineHeight: 21
  },
  columns: {
    flexDirection: "row",
    gap: 12
  },
  column: {
    flex: 1,
    gap: 4
  },
  smallTitle: {
    color: colors.primaryDeep,
    fontSize: 12,
    fontWeight: "900"
  },
  item: {
    color: "#514A70",
    fontSize: 12,
    lineHeight: 17
  }
});
