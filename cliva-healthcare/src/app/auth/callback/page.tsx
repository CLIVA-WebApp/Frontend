'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AuthApi } from '@/lib/auth/api'
import { AuthStorage } from '@/lib/utils/storage'
import { useAuthContext } from '@/providers/AuthProvider'
import { authConfig } from '@/lib/auth/config'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { refreshAuth } = useAuthContext()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setStatus('loading')
        
        // Handle OAuth callback
        const authResponse = await AuthApi.handleCallback(searchParams)
        
        // Store auth data
        AuthStorage.storeAuth(authResponse)
        
        // Refresh auth context
        await refreshAuth()
        
        setStatus('success')
        
        // Get redirect URL or default to dashboard
        const redirectUrl = AuthStorage.getAndClearRedirectUrl() || authConfig.paths.dashboard
        
        // Small delay to show success state
        setTimeout(() => {
          router.push(redirectUrl)
        }, 1000)
        
      } catch (error) {
        console.error('OAuth callback error:', error)
        setError(error instanceof Error ? error.message : 'Authentication failed')
        setStatus('error')
        
        // Redirect to login after error
        setTimeout(() => {
          router.push(authConfig.paths.login)
        }, 3000)
      }
    }

    handleCallback()
  }, [searchParams, router, refreshAuth])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1D567C] mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Completing Authentication
            </h2>
            <p className="text-gray-600">
              Please wait while we sign you in...
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-4">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Authentication Successful!
            </h2>
            <p className="text-gray-600">
              Redirecting you to your dashboard...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Authentication Failed
            </h2>
            <p className="text-gray-600 mb-4">
              {error || 'Something went wrong during authentication.'}
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to login page...
            </p>
          </>
        )}
      </div>
    </div>
  )
}