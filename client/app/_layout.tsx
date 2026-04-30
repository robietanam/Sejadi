import React, { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "../src/store/authStore";
import { storage } from "../src/utils/storage";

function RootLayoutNav() {
  const segments = useSegments();
  const router = useRouter();
  const { accessToken, setTokens, setDeviceId } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await storage.getAccessToken();
        const refreshToken = await storage.getRefreshToken();
        const deviceId = await storage.getDeviceId();

        if (token && refreshToken) {
          setTokens(token, refreshToken);
        }
        if (deviceId) {
          setDeviceId(deviceId);
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
      } finally {
        setIsReady(true);
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (accessToken && inAuthGroup) {
      router.replace("/(app)/home");
    } else if (!accessToken && !inAuthGroup) {
      router.replace("/(auth)/login");
    }
  }, [accessToken, isReady, segments]);

  return (
    <>
      <Stack initialRouteName="(auth)">
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}

export default RootLayoutNav;
