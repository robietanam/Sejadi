export interface User {
  _id?: string;
  id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
  isEmailVerified?: boolean;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
  devices?: string[];
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  session?: Session;
}

export interface Session {
  id: string;
  deviceId: string;
  deviceName?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  lastActivityAt?: string;
  expiresAt: string;
}

export interface AuthError {
  message: string;
  statusCode?: number;
  error?: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  statusCode?: number;
  error?: string;
}
