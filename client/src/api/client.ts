import axios, { AxiosInstance, AxiosError } from "axios";
import { storage } from "../utils/storage";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

const client: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use(
  async (config) => {
    const token = await storage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      const refreshToken = await storage.getRefreshToken();
      const deviceId = await storage.getDeviceId();

      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
            deviceId,
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data;
          await storage.setAccessToken(accessToken);
          await storage.setRefreshToken(newRefreshToken);

          if (error.config) {
            error.config.headers.Authorization = `Bearer ${accessToken}`;
            return client(error.config);
          }
        } catch (refreshError: any) {
          await storage.clearAll();

          return Promise.reject(
            refreshError.response?.data ?? {
              message: refreshError.message,
              data: null,
              status: refreshError.response?.status ?? 500,
            },
          );
        }
      }
    }

    // propagate structured server response when available; otherwise pass a normalized object
    return Promise.reject(
      error.response?.data ?? {
        data: null,
        message: (error.response?.data as any)?.message || "Unknown Error",
        status: error.response?.status ?? 500,
      },
    );
  },
);

export const api = {
  auth: {
    register: async (email: string, password: string) => {
      const response = await client.post("/auth/register", {
        email,
        password,
      });
      return response.data;
    },

    login: async (
      email: string,
      password: string,
      deviceId: string,
      deviceName: string = "Mobile Device",
    ) => {
      const response = await client.post("/auth/login", {
        email,
        password,
        deviceId,
        deviceName,
      });

      return response.data;
    },

    refresh: async (refreshToken: string, deviceId: string) => {
      const response = await client.post("/auth/refresh", {
        refreshToken,
        deviceId,
      });
      return response.data;
    },

    verify: async () => {
      const response = await client.get("/auth/verify");
      return response.data;
    },

    logout: async (deviceId?: string) => {
      const response = await client.post("/auth/logout", { deviceId });
      return response.data;
    },

    logoutAllDevices: async () => {
      const response = await client.post("/auth/logout-all-devices");
      return response.data;
    },
  },

  user: {
    getProfile: async () => {
      const response = await client.get("/users");
      return response.data;
    },

    updateProfile: async (firstName?: string, lastName?: string) => {
      const response = await client.patch("/users", {
        firstName,
        lastName,
      });
      return response.data;
    },

    changePassword: async (currentPassword: string, newPassword: string) => {
      const response = await client.post("/profile/change-password", {
        currentPassword,
        newPassword,
      });
      return response.data;
    },

    deactivateAccount: async () => {
      const response = await client.delete("/profile/deactivate");
      return response.data;
    },

    activateAccount: async () => {
      const response = await client.post("/profile/activate");
      return response.data;
    },

    deleteAccount: async () => {
      const response = await client.delete("/profile");
      return response.data;
    },
  },

  sessions: {
    list: async () => {
      const response = await client.get("/sessions");
      return response.data;
    },

    get: async (sessionId: string) => {
      const response = await client.get(`/sessions/${sessionId}`);
      return response.data;
    },

    revoke: async (sessionId: string) => {
      const response = await client.delete(`/sessions/${sessionId}`);
      return response.data;
    },

    revokeAll: async () => {
      const response = await client.post("/sessions/revoke-all");
      return response.data;
    },

    revokeByDevice: async (deviceId: string) => {
      const response = await client.delete(`/sessions/device/${deviceId}`);
      return response.data;
    },
  },
};

export default client;
