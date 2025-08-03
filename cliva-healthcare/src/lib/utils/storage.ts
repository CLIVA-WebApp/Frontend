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
   * Get cookie value by name
   */
  private static getCookie(name: string): string | null {
  if (!this.isBrowser()) return null
  
  // Debug: log what we're looking for and what we have
  console.log(`🔍 Looking for cookie: ${name}`)
  console.log(`🍪 All cookies: "${document.cookie}"`)
  
  if (!document.cookie) return null
  
  // More robust cookie parsing
  const cookies = document.cookie.split(';')
  
  for (let cookie of cookies) {
    const [cookieName, ...cookieValueParts] = cookie.trim().split('=')
    const cookieValue = cookieValueParts.join('=') // Handle values with = in them
    
    console.log(`🍪 Checking: "${cookieName}" = "${cookieValue}"`)
    
    if (cookieName === name) {
      return cookieValue || null
    }
  }
  
  return null
}

  /**
   * Store authentication data (cookies are likely set by your server)
   */
  static storeAuth(authData: AuthResponse): void {
    // Since cookies are set by server, we don't need to do anything here
    // or if you need to set them client-side:
    // document.cookie = `access_token=${authData.token}; path=/`
  }

  /**
   * Get stored token from cookies
   */
  static getToken(): string | null {
    // Can't access HttpOnly cookie from JavaScript
    return null
  }

  /**
   * Get stored user data from cookies
   */
  static getUser(): User | null {
    // Don't try to get user from localStorage anymore
    // Let the /me endpoint handle this
    return null
  }

  /**
   * Clear authentication (let server handle cookie clearing)
   */
  static clearAuth(): void {
    // Usually handled by server on logout, but you can also:
    if (this.isBrowser()) {
      document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
      document.cookie = 'user_data=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
    }
  }

  /**
   * Store redirect URL (keep this in localStorage since it's temporary)
   */
  static storeRedirectUrl(url: string): void {
    if (!this.isBrowser()) return
    localStorage.setItem('redirect_url', url)
  }

  /**
   * Get and clear stored redirect URL
   */
  static getAndClearRedirectUrl(): string | null {
    if (!this.isBrowser()) return null
    const url = localStorage.getItem('redirect_url')
    if (url) {
      localStorage.removeItem('redirect_url')
    }
    return url
  }

  /**
   * Check if user has valid session
   */
  static hasValidSession(): boolean {
    // Since we can't check HttpOnly cookies client-side,
    // and we're using the /me endpoint to validate,
    // always return true here
    return true
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