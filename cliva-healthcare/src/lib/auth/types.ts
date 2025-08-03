// lib/auth/types.ts

export interface User {
  id: string
  email: string
  full_name: string  // Changed from firstName/lastName
  avatar_url?: string  // Changed from avatar
  provider: string  // This maps to role concept
  is_active: boolean
  // Remove fields that your backend doesn't provide:
  // username, roles, createdAt, updatedAt
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignUpCredentials {
  email: string
  firstName: string
  lastName: string
  username: string
  password: string
  confirmPassword: string
}

export interface AuthResponse {
  user: User
  token: string
  expiresAt: string
}

export interface AuthError {
  message: string
  code?: string
  field?: string
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  signup: (credentials: SignUpCredentials) => Promise<void>
  loginWithGoogle: () => void
  logout: () => Promise<void>
  refreshAuth: () => Promise<void>
  clearError: () => void
}

export interface ApiResponse<T = any> {
  data?: T
  message?: string
  error?: string
  success: boolean
}

export interface AuthHookOptions {
  redirectOnAuth?: string
  redirectOnUnauth?: string
  requireAuth?: boolean
}