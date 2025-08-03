import { authConfig, buildApiUrl } from '@/lib/auth/config'
import { ApiResponse, AuthError } from '@/lib/auth/types'

class ApiClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = authConfig.apiBaseUrl
  }

  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(authConfig.storage.tokenKey)
  }

  private getDefaultHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }

    const token = this.getAuthToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    return headers
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    let data: any
    
    try {
      const text = await response.text()
      data = text ? JSON.parse(text) : {}
    } catch (error) {
      data = {}
    }

    if (!response.ok) {
      const error: AuthError = {
        message: data.message || data.error || `HTTP ${response.status}: ${response.statusText}`,
        code: data.code || response.status.toString(),
        field: data.field,
      }
      
      throw error
    }

    return {
      data: data.data || data,
      message: data.message,
      success: true,
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    const url = buildApiUrl(endpoint)
    
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getDefaultHeaders(),
      credentials: 'include',
    })

    return this.handleResponse<T>(response)
  }

  async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    const url = buildApiUrl(endpoint)
    
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getDefaultHeaders(),
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include',
    })

    return this.handleResponse<T>(response)
  }

  async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    const url = buildApiUrl(endpoint)
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: this.getDefaultHeaders(),
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include',
    })

    return this.handleResponse<T>(response)
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const url = buildApiUrl(endpoint)
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.getDefaultHeaders(),
      credentials: 'include',
    })

    return this.handleResponse<T>(response)
  }

  // Special method for redirecting to Google OAuth
  redirectToGoogle(): void {
    const url = buildApiUrl(authConfig.endpoints.googleAuth)
    const redirectUrl = `${url}?redirect_uri=${encodeURIComponent(
      `${authConfig.appUrl}${authConfig.paths.callback}`
    )}`
    
    window.location.href = redirectUrl
  }
}

export const apiClient = new ApiClient()