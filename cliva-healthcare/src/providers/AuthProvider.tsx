'use client'

import React, { createContext, useContext, useEffect, useReducer, useCallback } from 'react'
import { AuthApi } from '@/lib/auth/api'
import { AuthStorage } from '@/lib/utils/storage'
import { 
  AuthContextType, 
  AuthState, 
  LoginCredentials, 
  SignUpCredentials, 
  User,
  AuthError 
} from '@/lib/auth/types'

// Auth reducer actions
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User } }
  | { type: 'AUTH_ERROR'; payload: { error: string } }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' }

// Initial auth state
const initialState: AuthState = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
}

// Auth reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }
    
    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload.error,
      }
    
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      }
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      }
    
    default:
      return state
  }
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// AuthProvider component
interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Initialize auth state from storage
  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = AuthStorage.getUser()
      
      if (storedUser && AuthStorage.hasValidSession()) {
        dispatch({ type: 'AUTH_START' })
        
        try {
          // Verify the token is still valid by fetching current user
          const currentUser = await AuthApi.getCurrentUser()
          dispatch({ type: 'AUTH_SUCCESS', payload: { user: currentUser } })
        } catch (error) {
          // Token is invalid, clear storage
          AuthStorage.clearAuth()
          dispatch({ type: 'AUTH_LOGOUT' })
        }
      }
    }

    initializeAuth()
  }, [])

  // Login function
  const login = useCallback(async (credentials: LoginCredentials) => {
    dispatch({ type: 'AUTH_START' })
    
    try {
      const authResponse = await AuthApi.login(credentials)
      AuthStorage.storeAuth(authResponse)
      dispatch({ type: 'AUTH_SUCCESS', payload: { user: authResponse.user } })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      dispatch({ type: 'AUTH_ERROR', payload: { error: errorMessage } })
      throw error
    }
  }, [])

  // Signup function
  const signup = useCallback(async (credentials: SignUpCredentials) => {
    dispatch({ type: 'AUTH_START' })
    
    try {
      const authResponse = await AuthApi.signup(credentials)
      AuthStorage.storeAuth(authResponse)
      dispatch({ type: 'AUTH_SUCCESS', payload: { user: authResponse.user } })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed'
      dispatch({ type: 'AUTH_ERROR', payload: { error: errorMessage } })
      throw error
    }
  }, [])

  // Google login function
  const loginWithGoogle = useCallback(() => {
    // Store current URL for redirect after auth
    AuthStorage.storeRedirectUrl(window.location.pathname)
    AuthApi.redirectToGoogle()
  }, [])

  // Logout function
  const logout = useCallback(async () => {
    try {
      await AuthApi.logout()
    } catch (error) {
      // Even if the API call fails, we should clear local storage
      console.error('Logout API call failed:', error)
    } finally {
      AuthStorage.clearAuth()
      dispatch({ type: 'AUTH_LOGOUT' })
    }
  }, [])

  // Refresh auth function
  const refreshAuth = useCallback(async () => {
    if (!AuthStorage.hasValidSession()) {
      dispatch({ type: 'AUTH_LOGOUT' })
      return
    }

    dispatch({ type: 'AUTH_START' })
    
    try {
      const user = await AuthApi.refreshAuth()
      if (user) {
        dispatch({ type: 'AUTH_SUCCESS', payload: { user } })
      } else {
        AuthStorage.clearAuth()
        dispatch({ type: 'AUTH_LOGOUT' })
      }
    } catch (error) {
      AuthStorage.clearAuth()
      dispatch({ type: 'AUTH_LOGOUT' })
    }
  }, [])

  // Clear error function
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' })
  }, [])

  const contextValue: AuthContextType = {
    ...state,
    login,
    signup,
    loginWithGoogle,
    logout,
    refreshAuth,
    clearError,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}

export default AuthProvider