'use client'

// components/auth/ProtectedRoute.tsx
import React from 'react'
import { useAuth } from '@/lib/auth/hooks/useAuth'
import { authConfig } from '@/lib/auth/config'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  redirectTo?: string
  requireAuth?: boolean
  roles?: string[]
}

export function ProtectedRoute({
  children,
  fallback,
  redirectTo = authConfig.paths.login,
  requireAuth = true,
  roles = []
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth({
    requireAuth,
    redirectOnUnauth: redirectTo
  })

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1D567C] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Check authentication
  if (requireAuth && !isAuthenticated) {
    return fallback || (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600">
            You need to be logged in to access this page.
          </p>
        </div>
      </div>
    )
  }

  // Check role-based access (if roles are specified)
  if (roles.length > 0 && user && isAuthenticated) {
    // Handle both single role and multiple roles
    const userRoles: string[] = []
    
    if (user.role) {
      userRoles.push(user.role)
    }
    
    if (user.roles && Array.isArray(user.roles)) {
      userRoles.push(...user.roles)
    }
    
    const hasRequiredRole = roles.some(role => userRoles.includes(role))
    
    if (!hasRequiredRole) {
      return fallback || (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Insufficient Permissions
            </h2>
            <p className="text-gray-600">
              You don't have the required permissions to access this page.
            </p>
          </div>
        </div>
      )
    }
  }

  return <>{children}</>
}

// Higher-order component version
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<ProtectedRouteProps, 'children'> = {}
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    )
  }
}

export default ProtectedRoute