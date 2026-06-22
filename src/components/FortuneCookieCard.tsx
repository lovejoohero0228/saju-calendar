import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Share2 } from "lucide-react-native";

import { colors } from "@/constants/colors";
import { cookieMessages } from "@/lib/fortuneEngine";
import { seededPick } from "@/lib/hash";
import { loadDailyCookie, saveDailyCookie } from "@/lib/storage";
import { todayKey } from "@/lib/date";
import { Card } from "./Card";
import { GradientButton } from "./GradientButton";

export function FortuneCookieCard() {
  const dateKey = todayKey();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    loadDailyCookie(dateKey).then(setMessage).catch(() => setMessage(null));
  }, [dateKey]);

  const draw = () => {
    const next = seededPick(dateKey, cookieMessages);
    setMessage(next);
    void saveDailyCookie(dateKey, next);
  };

  return (
    <Card variant="light" style={styles.card}>
      <View style={styles.top}>
        <Text style={styles.title}>포춘쿠키</Text>
        <Share2 size={18} color={colors.primaryDeep} />
      </View>
      <View style={styles.cookieWrap}>
        <Text style={styles.cookie}>🥠</Text>
      </View>
      <Text style={styles.message}>
        {message ?? "오늘의 작은 힌트를 포춘쿠키로 열어보세요."}
      </Text>
      <GradientButton onPress={draw}>{message ? "오늘의 쿠키 확인됨" : "뽑기"}</GradientButton>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 12
  },
  top: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  title: {
    color: colors.primaryDeep,
    fontSize: 17,
    fontWeight: "900"
  },
  cookieWrap: {
    alignItems: "center"
  },
  cookie: {
    fontSize: 58
  },
  message: {
    minHeight: 42,
    color: colors.text,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    fontWeight: "700"
  }
});
