import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/providers/AuthProvider'
import { AuthStorage } from '@/lib/utils/storage'
import { authConfig } from '@/lib/auth/config'

interface UseAuthRedirectOptions {
  enabled?: boolean
  fallbackPath?: string
  onRedirect?: (path: string) => void
}

export function useAuthRedirect(options: UseAuthRedirectOptions = {}) {
  const {
    enabled = true,
    fallbackPath = authConfig.paths.dashboard,
    onRedirect
  } = options

  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuthContext()

  useEffect(() => {
    if (!enabled || isLoading || !isAuthenticated) return

    // Get stored redirect URL
    const redirectUrl = AuthStorage.getAndClearRedirectUrl()
    const targetPath = redirectUrl || fallbackPath

    // Execute callback if provided
    if (onRedirect) {
      onRedirect(targetPath)
    }

    // Perform redirect
    router.push(targetPath)
  }, [isAuthenticated, isLoading, enabled, fallbackPath, onRedirect, router])

  return {
    isRedirecting: enabled && isAuthenticated && !isLoading,
  }
}

export default useAuthRedirect