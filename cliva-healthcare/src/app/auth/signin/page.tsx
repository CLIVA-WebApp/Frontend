'use client'

// app/auth/signin/page.tsx
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { GoogleAuthButton } from '@/components/sections/auth/GoogleAuthButton'
import { Eye, EyeOff, Check } from 'lucide-react'
import { useAuth } from '@/lib/auth/hooks/useAuth'
import { LoginCredentials } from '@/lib/auth/types'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isAnimated, setIsAnimated] = useState(false)
  const [credentialsError, setCredentialsError] = useState('')

  const { signIn, isLoading, error, clearError, isAuthenticated } = useAuth({
    redirectOnAuth: '/'
  })

  // Trigger animations on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimated(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  // Clear errors when user starts typing
  useEffect(() => {
    if (error) {
      clearError()
    }
    if (credentialsError) {
      setCredentialsError('')
    }
  }, [email, password, clearError])

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Check if form is valid
  const isFormValid = () => {
    return validateEmail(email) && email !== '' && password !== ''
  }

  // Check if email is valid
  const isEmailValid = () => {
    return email !== '' && validateEmail(email)
  }

  // Handle form submission
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isFormValid()) return
    
    const credentials: LoginCredentials = { email, password }
    
    try {
      await signIn(credentials)
      // Success handling is done by the auth hook redirect
    } catch (error: any) {
      // Check if it's a 401 error (unauthorized)
      if (error?.code === '401' || error?.message?.includes('401') || 
          error?.message?.toLowerCase().includes('unauthorized') ||
          error?.message?.toLowerCase().includes('invalid credentials')) {
        setCredentialsError("Email and password doesn't match")
      }
      console.error('Sign in failed:', error)
    }
  }

  // Redirect if already authenticated
  if (isAuthenticated) {
    return null // The useAuth hook will handle the redirect
  }

  return (
    <div className="flex h-screen bg-[#FEFEFE] overflow-hidden">
      <div className={`w-3/5 relative transition-all duration-1000 ease-out ${
        isAnimated ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
      }`}>
        <Image
          src="/images/hospital-building.png"
          alt="Hospital Building"
          layout="fill"
          objectFit="cover"
          className="brightness-100"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#fefefe] opacity-100" />
      </div>
      
      <div className={`w-2/5 flex flex-col justify-center px-24 bg-[#FEFEFE] text-[#1D567C] transition-all duration-1000 ease-out delay-300 ${
        isAnimated ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}>
        <form onSubmit={handleSignIn} className="space-y-6">
          <div className={`text-4xl font-bold leading-snug transition-all duration-800 ease-out delay-500 ${
            isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            Hello,<br/>Welcome Back
          </div>

          {/* Email */}
          <div className={`space-y-2 transition-all duration-600 ease-out delay-700 ${
            isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}>
            <div className="relative group">
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`border-0 border-b ${
                  credentialsError
                    ? 'border-red-500'
                    : isEmailValid() 
                    ? 'border-[#12A048]' 
                    : 'border-gray-300'
                } rounded-none bg-transparent px-0 pr-8 focus:ring-0 focus:border-current focus:outline-none transition-all duration-300 hover:border-[#1D567C] focus:scale-105 focus:shadow-sm`}
              />
              {isEmailValid() && !credentialsError && (
                <Check className="absolute right-0 top-1/2 transform -translate-y-1/2 text-[#12A048] transition-all duration-500 animate-in fade-in scale-in zoom-in-50" size={20} />
              )}
            </div>
            {isEmailValid() && !credentialsError && (
              <p className="text-[#12A048] text-sm animate-in fade-in slide-in-from-top-2 duration-400 bounce-in">Valid email address</p>
            )}
            {credentialsError && (
              <p className="text-red-500 text-sm animate-in fade-in slide-in-from-top-2 duration-400 bounce-in">{credentialsError}</p>
            )}
          </div>

          {/* Password */}
          <div className={`space-y-2 transition-all duration-600 ease-out delay-800 ${
            isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}>
            <div className="relative group">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`border-0 border-b ${
                  credentialsError
                    ? 'border-red-500'
                    : 'border-gray-300'
                } rounded-none bg-transparent px-0 pr-16 focus:ring-0 focus:border-current focus:outline-none transition-all duration-300 hover:border-[#1D567C] focus:scale-105 focus:shadow-sm`}
              />
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 hover:text-gray-700 transition-all duration-200 hover:scale-110"
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
            </div>
            {credentialsError && (
              <p className="text-red-500 text-sm animate-in fade-in slide-in-from-top-2 duration-400 bounce-in">{credentialsError}</p>
            )}
          </div>

          <div className={`text-right text-sm transition-all duration-500 ease-out delay-900 ${
            isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <Link href="#" className="text-[#1D567C] font-medium hover:text-[#37B7BE] transition-colors duration-200">
              Forgot password?
            </Link>
          </div>

          <Button 
            type="submit"
            disabled={!isFormValid() || isLoading}
            className={`w-full text-lg py-6 rounded-md shadow-md transition-all duration-500 ease-out delay-1000 ${
              isFormValid() && !isLoading
                ? 'bg-[#1D567C] hover:bg-[#37B7BE] text-white hover:scale-105 hover:shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300'
            } ${
              isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            }`}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>

          <div className={`text-center text-sm transition-all duration-500 ease-out delay-1100 ${
            isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            Don't have an account?
            <Link href="/auth/signup" className="ml-1 text-[#1D567C] font-bold hover:text-[#37B7BE] transition-colors duration-200">
              Register Here
            </Link>
          </div>

          <div className={`relative text-center mt-4 transition-all duration-500 ease-out delay-1200 ${
            isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <div className="absolute left-0 right-0 top-2 border-t border-gray-300"></div>
            <span className="bg-[#FEFEFE] px-2 relative z-10 text-[#8A8A8A]">or</span>
          </div>

          <div className={`transition-all duration-500 ease-out delay-1300 ${
            isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}>
            <GoogleAuthButton 
              text="Continue with Google"
              disabled={isLoading}
            />
          </div>
        </form>
      </div>
    </div>
  )
}