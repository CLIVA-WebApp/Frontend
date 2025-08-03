import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/providers/AuthProvider'
import { AuthHookOptions } from '@/lib/auth/types'
import { authConfig } from '@/lib/auth/config'

export function useAuth(options: AuthHookOptions = {}) {
  const {
    redirectOnAuth = authConfig.paths.dashboard,
    redirectOnUnauth = authConfig.paths.login,
    requireAuth = false,
  } = options

  const router = useRouter()
  const auth = useAuthContext()

  // Handle redirects based on auth state
  useEffect(() => {
    if (auth.isLoading) return

    if (requireAuth && !auth.isAuthenticated) {
      router.push(redirectOnUnauth)
      return
    }

    if (auth.isAuthenticated && redirectOnAuth && 
        (window.location.pathname === authConfig.paths.login || 
         window.location.pathname === authConfig.paths.signup)) {
      router.push(redirectOnAuth)
    }
  }, [auth.isAuthenticated, auth.isLoading, requireAuth, redirectOnAuth, redirectOnUnauth, router])

  return {
    ...auth,
    // Utility functions
    isLoggedIn: auth.isAuthenticated,
    isLoggedOut: !auth.isAuthenticated && !auth.isLoading,
    
    // User info shortcuts
    user: auth.user,
    userId: auth.user?.id,
    userEmail: auth.user?.email,
    userName: auth.user?.full_name || null, 
    
    // Auth actions
    signIn: auth.login,
    signUp: auth.signup,
    signOut: auth.logout,
    signInWithGoogle: auth.loginWithGoogle,
  }
}

export default useAuth