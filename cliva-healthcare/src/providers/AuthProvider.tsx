'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { AuthApi } from '@/lib/auth/api'
import { AuthStorage } from '@/lib/utils/storage'
import { 
  AuthContextType, 
  LoginCredentials, 
  SignUpCredentials, 
  User 
} from '@/lib/auth/types'

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// AuthProvider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Derived state
  const isAuthenticated = !!user

  // Initialize auth on mount
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🔍 Initializing auth...')
      
      try {
        const currentUser = await AuthApi.getCurrentUser()
        console.log('✅ Got user:', currentUser)
        setUser(currentUser)
      } catch (error) {
        console.log('❌ No valid session')
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  // Login function
  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const authResponse = await AuthApi.login(credentials)
      AuthStorage.storeAuth(authResponse)
      setUser(authResponse.user)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      setError(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Signup function
  const signup = useCallback(async (credentials: SignUpCredentials) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const authResponse = await AuthApi.signup(credentials)
      AuthStorage.storeAuth(authResponse)
      setUser(authResponse.user)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed'
      setError(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Google login function
  const loginWithGoogle = useCallback(() => {
    AuthStorage.storeRedirectUrl(window.location.pathname)
    AuthApi.redirectToGoogle()
  }, [])

  // Logout function
  const logout = useCallback(async () => {
    try {
      await AuthApi.logout()
    } catch (error) {
      console.error('Logout API call failed:', error)
    } finally {
      AuthStorage.clearAuth()
      setUser(null)
    }
  }, [])

  // Refresh auth function
  const refreshAuth = useCallback(async () => {
    try {
      const user = await AuthApi.getCurrentUser()
      setUser(user)
    } catch (error) {
      setUser(null)
      AuthStorage.clearAuth()
    }
  }, [])

  // Clear error function
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const contextValue: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    error,
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
  
  console.log('🎯 Auth context:', {
    isAuthenticated: context?.isAuthenticated,
    user: context?.user ? 'EXISTS' : 'NULL',
    isLoading: context?.isLoading
  })
  
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}

export default AuthProvider