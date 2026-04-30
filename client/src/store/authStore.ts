import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { User, Session } from "../types";
import { api } from "../api/client";
import * as Device from "expo-device";
import { storage } from "../utils/storage";

interface AuthState {
  user: User | null;
  sessions: Session[];
  accessToken: string | null;
  refreshToken: string | null;
  deviceId: string | null;
  isLoading: boolean;
  error: string | null;

  setUser: (user: User | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setDeviceId: (deviceId: string) => void;
  setError: (error: string | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setSessions: (sessions: Session[]) => void;

  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string, deviceId: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  updateProfile: (firstName?: string, lastName?: string) => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<void>;
  loadSessions: () => Promise<void>;
  revokeSession: (sessionId: string) => Promise<void>;
  revokeAllSessions: () => Promise<void>;
  clearAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  immer((set, get) => ({
    user: null,
    sessions: [],
    accessToken: null,
    refreshToken: null,
    deviceId: null,
    isLoading: false,
    error: null,

    setUser: (user) => {
      set({ user });
    },

    setTokens: (accessToken, refreshToken) => {
      set({ accessToken, refreshToken });
    },

    setDeviceId: (deviceId) => {
      set({ deviceId });
    },

    setError: (error) => {
      set({ error });
    },

    setIsLoading: (isLoading) => {
      set({ isLoading });
    },

    setSessions: (sessions) => {
      set({ sessions });
    },

    register: async (email, password) => {
      set({ isLoading: true, error: null });
      try {
        await api.auth.register(email, password);
        set({ isLoading: false });
      } catch (error: any) {
        set({
          isLoading: false,
          error: error.response?.data?.message || "Registration failed",
        });
        throw error;
      }
    },

    login: async (email, password, deviceId) => {
      set({ isLoading: true, error: null });
      try {
        const deviceName =
          Device.modelName || `${Device.manufacturer ?? "Device"}`;
        const response = await api.auth.login(
          email,
          password,
          deviceId,
          deviceName,
        );
        console.log(response);
        const { user, accessToken, refreshToken } = response.data.data;

        await storage.setAccessToken(accessToken);
        await storage.setRefreshToken(refreshToken);
        await storage.setDeviceId(deviceId);
        await storage.setUserCache(user);

        set({
          user,
          accessToken,
          refreshToken,
          deviceId,
          isLoading: false,
        });
      } catch (error: any) {
        set({
          isLoading: false,
          error: error.response?.data?.message || "Login failed",
        });
        throw error;
      }
    },

    logout: async () => {
      set({ isLoading: true, error: null });
      try {
        const deviceId = get().deviceId;
        if (deviceId) {
          await api.auth.logout(deviceId);
        }
        await storage.clearAll();
        set({
          user: null,
          sessions: [],
          accessToken: null,
          refreshToken: null,
          deviceId: null,
          isLoading: false,
        });
      } catch (error: any) {
        set({
          isLoading: false,
          error: error.response?.data?.message || "Logout failed",
        });
        throw error;
      }
    },

    loadUser: async () => {
      set({ isLoading: true, error: null });
      try {
        const user = await api.user.getProfile();
        await storage.setUserCache(user);
        set({ user, isLoading: false });
      } catch (error: any) {
        set({
          isLoading: false,
          error: error.response?.data?.message || "Failed to load user",
        });
        throw error;
      }
    },

    updateProfile: async (firstName, lastName) => {
      set({ isLoading: true, error: null });
      try {
        const user = await api.user.updateProfile(firstName, lastName);
        await storage.setUserCache(user);
        set({ user, isLoading: false });
      } catch (error: any) {
        set({
          isLoading: false,
          error: error.response?.data?.message || "Failed to update profile",
        });
        throw error;
      }
    },

    changePassword: async (currentPassword, newPassword) => {
      set({ isLoading: true, error: null });
      try {
        await api.user.changePassword(currentPassword, newPassword);
        set({ isLoading: false });
      } catch (error: any) {
        set({
          isLoading: false,
          error: error.response?.data?.message || "Failed to change password",
        });
        throw error;
      }
    },

    loadSessions: async () => {
      set({ isLoading: true, error: null });
      try {
        const sessions = await api.sessions.list();
        set({ sessions, isLoading: false });
      } catch (error: any) {
        set({
          isLoading: false,
          error: error.response?.data?.message || "Failed to load sessions",
        });
        throw error;
      }
    },

    revokeSession: async (sessionId) => {
      set({ isLoading: true, error: null });
      try {
        await api.sessions.revoke(sessionId);
        const sessions = get().sessions.filter((s) => s.id !== sessionId);
        set({ sessions, isLoading: false });
      } catch (error: any) {
        set({
          isLoading: false,
          error: error.response?.data?.message || "Failed to revoke session",
        });
        throw error;
      }
    },

    revokeAllSessions: async () => {
      set({ isLoading: true, error: null });
      try {
        await api.sessions.revokeAll();
        set({ sessions: [], isLoading: false });
      } catch (error: any) {
        set({
          isLoading: false,
          error: error.response?.data?.message || "Failed to revoke sessions",
        });
        throw error;
      }
    },

    clearAuth: async () => {
      await storage.clearAll();
      set({
        user: null,
        sessions: [],
        accessToken: null,
        refreshToken: null,
        deviceId: null,
        error: null,
      });
    },
  })),
);
