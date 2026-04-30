import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const DEVICE_ID_KEY = "device_id";
const USER_CACHE_KEY = "user_cache";

export const storage = {
  async setAccessToken(token: string) {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  },

  async getAccessToken() {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  },

  async setRefreshToken(token: string) {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
  },

  async getRefreshToken() {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  },

  async setDeviceId(id: string) {
    await SecureStore.setItemAsync(DEVICE_ID_KEY, id);
  },

  async getDeviceId() {
    return await SecureStore.getItemAsync(DEVICE_ID_KEY);
  },

  async setUserCache(user: any) {
    await SecureStore.setItemAsync(USER_CACHE_KEY, JSON.stringify(user));
  },

  async getUserCache() {
    const data = await SecureStore.getItemAsync(USER_CACHE_KEY);
    return data ? JSON.parse(data) : null;
  },

  async clearAll() {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_CACHE_KEY);
  },
};
