import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { CalendarDays, Home, SlidersHorizontal, Trophy, User, Users } from "lucide-react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";

import { CalendarScreen } from "@/screens/CalendarScreen";
import { DevPlaygroundScreen } from "@/screens/DevPlaygroundScreen";
import { HomeScreen } from "@/screens/HomeScreen";
import { LeaderboardScreen } from "@/screens/LeaderboardScreen";
import { MyPageScreen } from "@/screens/MyPageScreen";
import { OnboardingScreen } from "@/screens/OnboardingScreen";
import { RelationshipsScreen } from "@/screens/RelationshipsScreen";
import { colors } from "@/constants/colors";
import { useAppStore } from "@/lib/store";

type TabKey = "home" | "calendar" | "relationships" | "leaderboard" | "my" | "playground";

type TabConfig = {
  key: TabKey;
  label: string;
  icon: typeof Home;
};

const baseTabs: TabConfig[] = [
  { key: "home", label: "\ud648", icon: Home },
  { key: "calendar", label: "\uce74\ub80c\ub354", icon: CalendarDays },
  { key: "relationships", label: "\uc778\ubb3c", icon: Users },
  { key: "leaderboard", label: "\ub9ac\ub354\ubcf4\ub4dc", icon: Trophy },
  { key: "my", label: "\ub9c8\uc774", icon: User }
];

const tabs: TabConfig[] = __DEV__
  ? [...baseTabs, { key: "playground", label: "Playground", icon: SlidersHorizontal }]
  : baseTabs;

function Root() {
  const { profile, ready, editingProfile, hydrate, setProfile, startProfileEdit } = useAppStore();
  const [tab, setTab] = useState<TabKey>("home");

  useEffect(() => {
    hydrate().catch(() => undefined);
  }, [hydrate]);

  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.accentYellow} size="large" />
      </View>
    );
  }

  if (!profile || editingProfile) {
    return (
      <>
        <StatusBar style="light" />
        <OnboardingScreen initialProfile={profile} onSubmit={(next) => void setProfile(next)} />
      </>
    );
  }

  return (
    <View style={styles.app}>
      <StatusBar style="light" />
      {tab === "home" ? <HomeScreen profile={profile} goCalendar={() => setTab("calendar")} /> : null}
      {tab === "calendar" ? <CalendarScreen profile={profile} /> : null}
      {tab === "relationships" ? <RelationshipsScreen profile={profile} /> : null}
      {tab === "leaderboard" ? <LeaderboardScreen profile={profile} /> : null}
      {tab === "my" ? <MyPageScreen profile={profile} onEdit={startProfileEdit} /> : null}
      {tab === "playground" ? <DevPlaygroundScreen profile={profile} onApply={setProfile} /> : null}
      <BottomTabs activeTab={tab} onChange={setTab} />
    </View>
  );
}

function BottomTabs({ activeTab, onChange }: { activeTab: TabKey; onChange: (tab: TabKey) => void }) {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={["rgba(24, 20, 49, 0.94)", "rgba(44, 31, 90, 0.94)"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 10) }]}
    >
      {tabs.map((tab) => {
        const active = activeTab === tab.key;
        const Icon = tab.icon;

        return (
          <Pressable key={tab.key} onPress={() => onChange(tab.key)} style={styles.tabButton}>
            <View style={[styles.tabIconWrap, active && styles.tabIconActive]}>
              <Icon size={22} color={active ? colors.primaryDeep : "#7D7893"} />
            </View>
            <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </LinearGradient>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <Root />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: colors.bg
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bg
  },
  tabBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 76,
    paddingTop: 8,
    paddingHorizontal: 8,
    flexDirection: "row",
    backgroundColor: "rgba(250, 247, 255, 0.96)",
    borderTopWidth: 1,
    borderTopColor: "rgba(229,221,247,0.5)",
    shadowColor: "#0F0C24",
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: -4 },
    elevation: 10
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3
  },
  tabIconWrap: {
    width: 36,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center"
  },
  tabIconActive: {
    backgroundColor: "rgba(223, 212, 255, 0.92)",
    borderWidth: 1,
    borderColor: "rgba(102, 80, 204, 0.18)"
  },
  tabLabel: {
    color: "#7D7893",
    fontSize: 11,
    fontWeight: "800"
  },
  tabLabelActive: {
    color: colors.primaryDeep
  }
});
