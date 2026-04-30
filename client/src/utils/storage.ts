import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const DEVICE_ID_KEY = "device_id";
const USER_CACHE_KEY = "user_cache";

export const storage = {
  async setAccessToken(token: string) {
    if (!token) return;
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch (e) {
      console.error("Failed to save accessToken:", e);
    }
  },

  async getAccessToken() {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (e) {
      console.error("Failed to get accessToken:", e);
      return null;
    }
  },

  async setRefreshToken(token: string) {
    if (!token) return;
    try {
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
    } catch (e) {
      console.error("Failed to save refreshToken:", e);
    }
  },

  async getRefreshToken() {
    try {
      return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    } catch (e) {
      console.error("Failed to get refreshToken:", e);
      return null;
    }
  },

  async setDeviceId(id: string) {
    try {
      await SecureStore.setItemAsync(DEVICE_ID_KEY, id);
    } catch (e) {
      console.error("Failed to save deviceId:", e);
    }
  },

  async getDeviceId() {
    try {
      return await SecureStore.getItemAsync(DEVICE_ID_KEY);
    } catch (e) {
      console.error("Failed to get deviceId:", e);
      return null;
    }
  },

  async setUserCache(user: any) {
    try {
      await SecureStore.setItemAsync(USER_CACHE_KEY, JSON.stringify(user));
    } catch (e) {
      console.error("Failed to save user cache:", e);
    }
  },

  async getUserCache() {
    try {
      const data = await SecureStore.getItemAsync(USER_CACHE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error("Failed to get user cache:", e);
      return null;
    }
  },

  async clearAll() {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_CACHE_KEY);
    } catch (e) {
      console.error("Failed to clear storage:", e);
    }
  },
};
