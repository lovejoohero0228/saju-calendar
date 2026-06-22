import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

type Score = {
  label: string;
  value: number;
  color: string;
};

type Props = {
  scores: Score[];
  dark?: boolean;
};

export function CategoryScoreBars({ scores, dark = false }: Props) {
  return (
    <View style={styles.wrap}>
      {scores.map((score) => (
        <View key={score.label} style={styles.row}>
          <Text style={[styles.label, dark && styles.darkLabel]}>{score.label}</Text>
          <View style={[styles.track, dark && styles.darkTrack]}>
            <View style={[styles.fill, { width: `${score.value}%`, backgroundColor: score.color }]} />
          </View>
          <Text style={[styles.value, dark && styles.darkLabel]}>{score.value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 10
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  label: {
    width: 52,
    color: "#514A70",
    fontSize: 12,
    fontWeight: "800"
  },
  track: {
    flex: 1,
    height: 8,
    borderRadius: 8,
    backgroundColor: "#E3D9F4",
    overflow: "hidden"
  },
  darkTrack: {
    backgroundColor: "rgba(255,255,255,0.13)"
  },
  fill: {
    height: 8,
    borderRadius: 8
  },
  value: {
    width: 28,
    color: colors.text,
    fontSize: 12,
    fontWeight: "900",
    textAlign: "right"
  },
  darkLabel: {
    color: colors.textLight
  }
});
