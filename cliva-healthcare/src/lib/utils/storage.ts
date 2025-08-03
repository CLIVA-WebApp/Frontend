import { User, AuthResponse } from '@/lib/auth/types'
import { authConfig } from '@/lib/auth/config'

export class AuthStorage {
  /**
   * Check if we're in a browser environment
   */
  private static isBrowser(): boolean {
    return typeof window !== 'undefined'
  }

  /**
   * Store authentication data
   */
  static storeAuth(authData: AuthResponse): void {
    if (!this.isBrowser()) return

    localStorage.setItem(authConfig.storage.tokenKey, authData.token)
    localStorage.setItem(authConfig.storage.userKey, JSON.stringify(authData.user))
  }

  /**
   * Get stored token
   */
  static getToken(): string | null {
    if (!this.isBrowser()) return null
    return localStorage.getItem(authConfig.storage.tokenKey)
  }

  /**
   * Get stored user data
   */
  static getUser(): User | null {
    if (!this.isBrowser()) return null
    
    const userData = localStorage.getItem(authConfig.storage.userKey)
    if (!userData) return null

    try {
      return JSON.parse(userData)
    } catch (error) {
      console.error('Failed to parse stored user data:', error)
      return null
    }
  }

  /**
   * Clear all authentication data
   */
  static clearAuth(): void {
    if (!this.isBrowser()) return

    localStorage.removeItem(authConfig.storage.tokenKey)
    localStorage.removeItem(authConfig.storage.userKey)
    localStorage.removeItem(authConfig.storage.redirectKey)
  }

  /**
   * Store redirect URL for post-authentication
   */
  static storeRedirectUrl(url: string): void {
    if (!this.isBrowser()) return
    localStorage.setItem(authConfig.storage.redirectKey, url)
  }

  /**
   * Get and clear stored redirect URL
   */
  static getAndClearRedirectUrl(): string | null {
    if (!this.isBrowser()) return null
    
    const url = localStorage.getItem(authConfig.storage.redirectKey)
    if (url) {
      localStorage.removeItem(authConfig.storage.redirectKey)
    }
    return url
  }

  /**
   * Check if user is potentially authenticated (has token)
   */
  static hasValidSession(): boolean {
    return !!this.getToken()
  }

  /**
   * Get authentication headers for API requests
   */
  static getAuthHeaders(): Record<string, string> {
    const token = this.getToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  }
}

export default AuthStorage