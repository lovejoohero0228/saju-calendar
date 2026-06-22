import AsyncStorage from "@react-native-async-storage/async-storage";

import type { UserProfile } from "@/types/profile";

const PROFILE_KEY = "saju.profile.v1";
const COOKIE_PREFIX = "saju.cookie.";

export async function loadProfile(): Promise<UserProfile | null> {
  const raw = await AsyncStorage.getItem(PROFILE_KEY);
  return raw ? (JSON.parse(raw) as UserProfile) : null;
}

export async function saveProfile(profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export async function loadDailyCookie(dateKey: string): Promise<string | null> {
  return AsyncStorage.getItem(`${COOKIE_PREFIX}${dateKey}`);
}

export async function saveDailyCookie(dateKey: string, message: string): Promise<void> {
  await AsyncStorage.setItem(`${COOKIE_PREFIX}${dateKey}`, message);
}
