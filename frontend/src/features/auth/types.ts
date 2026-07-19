export interface AuthResponse {
  tokenType: string;
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
}

export interface User {
  email: string;
  isAuthenticated: boolean;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface RefreshResponse {
  tokenType: string;
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
}
