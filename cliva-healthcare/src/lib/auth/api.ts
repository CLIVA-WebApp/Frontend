// lib/auth/api.ts
import { apiClient } from '@/lib/utils/api-client'
import { authConfig } from './config'
import { 
  User, 
  AuthResponse, 
  LoginCredentials, 
  SignUpCredentials,
  ApiResponse 
} from './types'

export class AuthApi {
  /**
   * Get current authenticated user
   */
  static async getCurrentUser(): Promise<User> {
  const response = await apiClient.get<User>(authConfig.endpoints.me) // Change back to <User>
  
  // Since your User interface now matches the backend response, just return it directly
  return response.data!
}

  /**
   * Login with email and password
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials)
    return response.data!
  }

  /**
   * Sign up with user details
   */
  static async signup(credentials: SignUpCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', credentials)
    return response.data!
  }

  /**
   * Logout user
   */
  static async logout(): Promise<void> {
    await apiClient.post(authConfig.endpoints.logout)
  }

  /**
   * Redirect to Google OAuth
   */
  static redirectToGoogle(): void {
    apiClient.redirectToGoogle()
  }

  /**
   * Handle OAuth callback
   */
  static async handleCallback(searchParams: URLSearchParams): Promise<AuthResponse> {
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    if (error) {
      throw new Error(`OAuth error: ${error}`)
    }

    if (!code) {
      throw new Error('No authorization code received')
    }

    const response = await apiClient.post<AuthResponse>(
      authConfig.endpoints.googleCallback,
      { code, state }
    )

    return response.data!
  }

  /**
   * Refresh authentication status
   */
  static async refreshAuth(): Promise<User | null> {
    try {
      return await this.getCurrentUser()
    } catch (error) {
      // If we can't get the user, they're likely not authenticated
      return null
    }
  }
}

export default AuthApi