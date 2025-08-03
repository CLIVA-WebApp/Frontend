'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth/hooks/useAuth'

interface GoogleAuthButtonProps {
  text?: string
  variant?: 'outline' | 'default'
  size?: 'sm' | 'default' | 'lg'
  disabled?: boolean
  className?: string
}

export function GoogleAuthButton({ 
  text = 'Continue with Google',
  variant = 'outline',
  size = 'default',
  disabled = false,
  className = ''
}: GoogleAuthButtonProps) {
  const { signInWithGoogle } = useAuth()

  const handleGoogleAuth = () => {
    if (!disabled) {
      signInWithGoogle()
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleGoogleAuth}
      disabled={disabled}
      className={`w-full flex items-center justify-center gap-3 transition-all duration-300 hover:scale-105 hover:shadow-md group ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 533.5 544.3"
        width={20}
        height={20}
        className="transition-transform duration-200 group-hover:scale-110"
      >
        <path
          fill="#4285F4"
          d="M533.5 278.4c0-17.4-1.6-34.1-4.6-50.4H272v95.3h147.2c-6.3 33.7-25.1 62.3-53.4 81.4v67h86.4c50.6-46.6 81.3-115.4 81.3-193.3z"
        />
        <path
          fill="#34A853"
          d="M272 544.3c72.7 0 133.7-24.1 178.2-65.6l-86.4-67c-23.9 16-54.4 25.3-91.8 25.3-70.7 0-130.6-47.7-152-111.5h-89v69.9c44.9 89.5 137.4 148.9 241 148.9z"
        />
        <path
          fill="#FBBC05"
          d="M120 325.5c-10.3-30.1-10.3-62.7 0-92.9v-69.9h-89c-39.4 77.7-39.4 168.8 0 246.5l89-69.9z"
        />
        <path
          fill="#EA4335"
          d="M272 107.7c39.5 0 75 13.6 103 40.5l77.1-77.1C405.6 25.3 344.6 0 272 0 168.4 0 75.9 59.4 31 148.9l89 69.9c21.4-63.8 81.3-111.5 152-111.5z"
        />
      </svg>
      <span className="font-medium">
        {text}
      </span>
    </Button>
  )
}

export default GoogleAuthButton