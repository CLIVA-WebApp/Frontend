export const authConfig = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
  apiVersion: process.env.NEXT_PUBLIC_API_VERSION || 'v1',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  
  // API Endpoints
  endpoints: {
    googleAuth: '/auth/google',
    googleCallback: '/auth/google/callback',
    me: '/auth/me',
    logout: '/auth/logout',
  },
  
  // Storage keys
  storage: {
    tokenKey: 'auth_token',
    userKey: 'auth_user',
    redirectKey: 'auth_redirect',
  },
  
  // Redirect paths
  paths: {
    login: '/auth/signin',
    signup: '/auth/register',
    callback: '/auth/callback',
    dashboard: '/dashboard',
    home: '/',
  },
} as const

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  const baseUrl = authConfig.apiBaseUrl.replace(/\/$/, '')
  const version = authConfig.apiVersion
  const cleanEndpoint = endpoint.replace(/^\//, '')
  
  return `${baseUrl}/api/${version}/${cleanEndpoint}`
}