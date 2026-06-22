import { format, isSameMonth } from "date-fns";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { levelColors } from "@/constants/colors";
import { getMonthGrid, toDateKey } from "@/lib/date";
import type { CompatibilityDay, FortuneDay } from "@/types/fortune";

type Props = {
  month: Date;
  selectedDate: string;
  scores: Record<string, FortuneDay | CompatibilityDay>;
  onSelectDate: (date: string) => void;
};

const weekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export function MonthCalendar({ month, selectedDate, scores, onSelectDate }: Props) {
  const days = getMonthGrid(month);

  return (
    <View style={styles.wrap}>
      <View style={styles.weekRow}>
        {weekdays.map((day) => (
          <Text key={day} style={styles.weekday}>
            {day}
          </Text>
        ))}
      </View>
      <View style={styles.grid}>
        {days.map((day) => {
          const key = toDateKey(day);
          const item = scores[key];
          const selected = key === selectedDate;
          const inMonth = isSameMonth(day, month);

          return (
            <Pressable
              key={key}
              onPress={() => onSelectDate(key)}
              style={[
                styles.cell,
                selected && styles.selectedCell,
                item && { backgroundColor: levelColors[item.level] },
                !inMonth && styles.outMonth
              ]}
            >
              <Text style={[styles.dayText, selected && styles.selectedText, !inMonth && styles.outText]}>
                {format(day, "d")}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 10
  },
  weekRow: {
    flexDirection: "row"
  },
  weekday: {
    flex: 1,
    textAlign: "center",
    color: "#8E88A6",
    fontSize: 10,
    fontWeight: "800"
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 8
  },
  cell: {
    width: "14.285%",
    aspectRatio: 1,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent"
  },
  selectedCell: {
    borderColor: "#5B4EBA"
  },
  outMonth: {
    opacity: 0.28
  },
  dayText: {
    color: "#322B54",
    fontSize: 13,
    fontWeight: "800"
  },
  selectedText: {
    color: "#13102D"
  },
  outText: {
    color: "#8E88A6"
  }
});
