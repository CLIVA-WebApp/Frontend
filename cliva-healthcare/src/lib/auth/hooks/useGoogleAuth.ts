// lib/auth/hooks/useGoogleAuth.ts
import { useCallback } from 'react'
import { AuthStorage } from '@/lib/utils/storage'
import { useAuthContext } from '@/providers/AuthProvider'

export function useGoogleAuth() {
  const { loginWithGoogle, isLoading, error } = useAuthContext()

  const initiateGoogleAuth = useCallback((redirectUrl?: string) => {
    if (redirectUrl) {
      AuthStorage.storeRedirectUrl(redirectUrl)
    }
    loginWithGoogle()
  }, [loginWithGoogle])

  return {
    initiateGoogleAuth,
    isLoading,
    error,
  }
}
