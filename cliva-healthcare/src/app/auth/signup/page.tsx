'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { GoogleAuthButton } from '@/components/sections/auth/GoogleAuthButton'
import { Eye, EyeOff, Check } from 'lucide-react'
import { useAuth } from '@/lib/auth/hooks/useAuth'

function getPasswordValidationMessage(password: string): string {
  if (password.length < 8) {
    return "Password must be at least 8 characters long"
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter"
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter"
  }
  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one digit"
  }
  if (!/[!@#$%^&*()_\+\-=\[\]{}|;:,.<>?]/.test(password)) {
    return "Password must contain at least one special character"
  }
  return ""
}

function validatePassword(password: string): boolean {
  return getPasswordValidationMessage(password) === ""
}

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isAnimated, setIsAnimated] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  })

  const { signUp, isLoading, error, clearError, isAuthenticated } = useAuth({
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
    setFieldErrors({
      email: '',
      username: '',
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
    })
  }, [email, username, firstName, lastName, password, confirmPassword, clearError])

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateName = (name: string) => {
    return name.trim().length >= 2
  }

  const validateUsername = (username: string) => {
    return username.trim().length >= 3 && /^[a-zA-Z0-9_]+$/.test(username)
  }

  const validateConfirmPassword = (password: string, confirmPassword: string) => {
    return confirmPassword === password && confirmPassword.length > 0
  }

  // Check if individual fields are valid
  const isEmailValid = () => email !== '' && validateEmail(email)
  const isUsernameValid = () => username !== '' && validateUsername(username)
  const isFirstNameValid = () => firstName !== '' && validateName(firstName)
  const isLastNameValid = () => lastName !== '' && validateName(lastName)
  const isPasswordValid = () => password !== '' && validatePassword(password)
  const isConfirmPasswordValid = () => confirmPassword !== '' && validateConfirmPassword(password, confirmPassword)

  // Check if form is valid
  const isFormValid = () => {
    return isEmailValid() && isUsernameValid() && isFirstNameValid() && isLastNameValid() && isPasswordValid() && isConfirmPasswordValid()
  }

  // Handle field changes with validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
  }

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFirstName(value)
  }

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLastName(value)
  }

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setUsername(value)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)

    const validationMessage = getPasswordValidationMessage(value)
    setFieldErrors(prev => ({ ...prev, password: validationMessage }))

    if (confirmPassword && !validateConfirmPassword(value, confirmPassword)) {
      setFieldErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }))
    } else if (confirmPassword) {
      setFieldErrors(prev => ({ ...prev, confirmPassword: '' }))
    }
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setConfirmPassword(value)
    
    if (value && !validateConfirmPassword(password, value)) {
      setFieldErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }))
    } else {
      setFieldErrors(prev => ({ ...prev, confirmPassword: '' }))
    }
  }

  // Handle form submission
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isFormValid()) return
    
    // Format data according to API specification
    const credentials = {
      email,
      username,
      first_name: firstName,
      last_name: lastName,
      password
    }
    
    try {
      await signUp(credentials)
      // Success handling is done by the auth hook redirect
    } catch (error: any) {
      // Handle validation errors from backend
      if (error?.details) {
        const newErrors = {
          email: '',
          username: '',
          firstName: '',
          lastName: '',
          password: '',
          confirmPassword: '',
        }
        
        error.details.forEach((detail: any) => {
          if (detail.loc?.includes('email')) {
            newErrors.email = detail.msg
          } else if (detail.loc?.includes('username')) {
            newErrors.username = detail.msg
          } else if (detail.loc?.includes('first_name')) {
            newErrors.firstName = detail.msg
          } else if (detail.loc?.includes('last_name')) {
            newErrors.lastName = detail.msg  
          } else if (detail.loc?.includes('password')) {
            newErrors.password = detail.msg
          }
        })
        
        setFieldErrors(newErrors)
      }
      console.error('Sign up failed:', error)
    }
  }

  // Redirect if already authenticated
  if (isAuthenticated) {
    return null // The useAuth hook will handle the redirect
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Image Section */}
      <div className={`w-3/5 relative transition-all duration-1000 ease-out ${
        isAnimated ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
      }`}>
        <Image
          src="/images/hospital-building.png"
          alt="Hospital Building"
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#fefefe] opacity-100" />
      </div>

      <div className={`w-2/5 px-24 py-10 bg-white flex flex-col justify-center relative transition-all duration-1000 ease-out delay-300 ${
        isAnimated ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}>   
        <form onSubmit={handleSignUp} className="space-y-6">
          {/* Form Title */}
          <div className={`text-4xl font-bold text-[#1D567C] mb-8 transition-all duration-800 ease-out delay-500 ${
            isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <div className="flex items-center gap-2">
              <span>Create Account</span>
            </div>
          </div>

          <div className="space-y-5 text-gray-700">
            {/* Email */}
            <div className={`space-y-2 transition-all duration-600 ease-out delay-700 ${
              isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            }`}>
              <div className="relative group">
                <Input
                  type="email"
                  placeholder="email address"
                  value={email}
                  onChange={handleEmailChange}
                  className={`border-0 border-b ${
                    fieldErrors.email 
                      ? 'border-red-500' 
                      : isEmailValid() 
                      ? 'border-[#12A048]' 
                      : 'border-gray-300'
                  } rounded-none bg-transparent px-0 pr-8 focus:ring-0 focus:border-current focus:outline-none transition-all duration-300 hover:border-[#1D567C] focus:scale-105 focus:shadow-sm`}
                />
                {isEmailValid() && !fieldErrors.email && (
                  <Check className="absolute right-0 top-1/2 transform -translate-y-1/2 text-[#12A048] transition-all duration-500 animate-in fade-in scale-in zoom-in-50" size={18} />
                )}
              </div>
              {fieldErrors.email && (
                <p className="text-red-500 text-sm animate-in fade-in slide-in-from-top-2 duration-400 bounce-in">{fieldErrors.email}</p>
              )}
              {isEmailValid() && !fieldErrors.email && (
                <p className="text-[#12A048] text-sm animate-in fade-in slide-in-from-top-2 duration-400 bounce-in">Valid email address</p>
              )}
            </div>

            {/* First Name and Last Name */}
            <div className={`flex gap-4 transition-all duration-600 ease-out delay-800 ${
              isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            }`}>
              <div className="space-y-2 flex-1">
                <div className="relative group">
                  <Input
                    type="text"
                    placeholder="first name"
                    value={firstName}
                    onChange={handleFirstNameChange}
                    className={`border-0 border-b ${
                      fieldErrors.firstName 
                        ? 'border-red-500' 
                        : isFirstNameValid() 
                        ? 'border-[#12A048]' 
                        : 'border-gray-300'
                    } rounded-none bg-transparent px-0 pr-8 focus:ring-0 focus:border-current focus:outline-none transition-all duration-300 hover:border-[#1D567C] focus:scale-105 focus:shadow-sm`}
                  />
                  {isFirstNameValid() && !fieldErrors.firstName && (
                    <Check className="absolute right-0 top-1/2 transform -translate-y-1/2 text-[#12A048] transition-all duration-500 animate-in fade-in scale-in zoom-in-50" size={18} />
                  )}
                </div>
                {fieldErrors.firstName && (
                  <p className="text-red-500 text-sm animate-in fade-in slide-in-from-top-2 duration-400 bounce-in">{fieldErrors.firstName}</p>
                )}
                {isFirstNameValid() && !fieldErrors.firstName && (
                  <p className="text-[#12A048] text-sm animate-in fade-in slide-in-from-top-2 duration-400 bounce-in">Valid first name</p>
                )}
              </div>

              <div className="space-y-2 flex-1">
                <div className="relative group">
                  <Input
                    type="text"
                    placeholder="last name"
                    value={lastName}
                    onChange={handleLastNameChange}
                    className={`border-0 border-b ${
                      fieldErrors.lastName 
                        ? 'border-red-500' 
                        : isLastNameValid() 
                        ? 'border-[#12A048]' 
                        : 'border-gray-300'
                    } rounded-none bg-transparent px-0 pr-8 focus:ring-0 focus:border-current focus:outline-none transition-all duration-300 hover:border-[#1D567C] focus:scale-105 focus:shadow-sm`}
                  />
                  {isLastNameValid() && !fieldErrors.lastName && (
                    <Check className="absolute right-0 top-1/2 transform -translate-y-1/2 text-[#12A048] transition-all duration-500 animate-in fade-in scale-in zoom-in-50" size={18} />
                  )}
                </div>
                {fieldErrors.lastName && (
                  <p className="text-red-500 text-sm animate-in fade-in slide-in-from-top-2 duration-400 bounce-in">{fieldErrors.lastName}</p>
                )}
                {isLastNameValid() && !fieldErrors.lastName && (
                  <p className="text-[#12A048] text-sm animate-in fade-in slide-in-from-top-2 duration-400 bounce-in">Valid last name</p>
                )}
              </div>
            </div>

            {/* Username */}
            <div className={`space-y-2 transition-all duration-600 ease-out delay-900 ${
              isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            }`}>
              <div className="relative group">
                <Input
                  type="text"
                  placeholder="username"
                  value={username}
                  onChange={handleUsernameChange}
                  className={`border-0 border-b ${
                    fieldErrors.username 
                      ? 'border-red-500' 
                      : isUsernameValid() 
                      ? 'border-[#12A048]' 
                      : 'border-gray-300'
                  } rounded-none bg-transparent px-0 pr-8 focus:ring-0 focus:border-current focus:outline-none transition-all duration-300 hover:border-[#1D567C] focus:scale-105 focus:shadow-sm`}
                />
                {isUsernameValid() && !fieldErrors.username && (
                  <Check className="absolute right-0 top-1/2 transform -translate-y-1/2 text-[#12A048] transition-all duration-500 animate-in fade-in scale-in zoom-in-50" size={18} />
                )}
              </div>
              {fieldErrors.username && (
                <p className="text-red-500 text-sm animate-in fade-in slide-in-from-top-2 duration-400 bounce-in">{fieldErrors.username}</p>
              )}
              {isUsernameValid() && !fieldErrors.username && (
                <p className="text-[#12A048] text-sm animate-in fade-in slide-in-from-top-2 duration-400 bounce-in">Username is available</p>
              )}
            </div>

            {/* Password */}
            <div className={`space-y-2 transition-all duration-600 ease-out delay-1000 ${
              isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            }`}>
              <div className="relative group">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="password"
                  value={password}
                  onChange={handlePasswordChange}
                  className={`border-0 border-b ${
                    fieldErrors.password 
                      ? 'border-red-500' 
                      : isPasswordValid()
                      ? 'border-[#12A048]'
                      : 'border-gray-300'
                  } rounded-none bg-transparent px-0 pr-16 focus:ring-0 focus:border-current focus:outline-none transition-all duration-300 hover:border-[#1D567C] focus:scale-105 focus:shadow-sm`}
                />
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                  {isPasswordValid() && (
                    <Check className="text-[#12A048] transition-all duration-500 animate-in fade-in scale-in zoom-in-50" size={18} />
                  )}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 transition-all duration-200 hover:scale-110"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              {fieldErrors.password && (
                <p className="text-red-500 text-sm animate-in fade-in slide-in-from-top-2 duration-400 bounce-in">{fieldErrors.password}</p>
              )}
              {isPasswordValid() && !fieldErrors.password && (
                <p className="text-[#12A048] text-sm animate-in fade-in slide-in-from-top-2 duration-400 bounce-in">Password meets all requirements</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className={`space-y-2 transition-all duration-600 ease-out delay-1100 ${
              isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            }`}>
              <div className="relative group">
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="confirm password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className={`border-0 border-b ${
                    fieldErrors.confirmPassword 
                      ? 'border-red-500' 
                      : isConfirmPasswordValid() 
                      ? 'border-[#12A048]' 
                      : 'border-gray-300'
                  } rounded-none bg-transparent px-0 pr-16 focus:ring-0 focus:border-current focus:outline-none transition-all duration-300 hover:border-[#1D567C] focus:scale-105 focus:shadow-sm`}
                />
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                  {isConfirmPasswordValid() && (
                    <Check className="text-[#12A048] transition-all duration-500 animate-in fade-in scale-in zoom-in-50" size={18} />
                  )}
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-400 hover:text-gray-600 transition-all duration-200 hover:scale-110"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              {fieldErrors.confirmPassword && (
                <p className="text-red-500 text-sm animate-in fade-in slide-in-from-top-2 duration-400 bounce-in">{fieldErrors.confirmPassword}</p>
              )}
              {isConfirmPasswordValid() && !fieldErrors.confirmPassword && (
                <p className="text-[#12A048] text-sm animate-in fade-in slide-in-from-top-2 duration-400 bounce-in">Passwords match</p>
              )}
            </div>

            <Button 
              type="submit"
              disabled={!isFormValid() || isLoading}
              className={`w-full mt-4 py-6 rounded-md text-lg shadow-md transition-all duration-500 ease-out delay-1200 ${
                isFormValid() && !isLoading
                  ? 'bg-[#1D567C] hover:bg-[#37B7BE] text-white hover:scale-105 hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300'
              } ${
                isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
              }`}
            >
              {isLoading ? 'Creating Account...' : 'Register'}
            </Button>

            <div className={`text-sm text-center mt-2 transition-all duration-500 ease-out delay-1300 ${
              isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-[#1D567C] font-bold hover:text-[#37B7BE] transition-colors duration-200">
                Login Here
              </Link>
            </div>

            <div className={`relative text-center mt-4 transition-all duration-500 ease-out delay-1400 ${
              isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              <div className="absolute left-0 right-0 top-2 border-t border-gray-300"></div>
              <span className="bg-white px-2 relative z-10 text-[#8A8A8A]">or</span>
            </div>

            <div className={`transition-all duration-500 ease-out delay-1500 ${
              isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            }`}>
              <GoogleAuthButton 
                text="Continue with Google"
                disabled={isLoading}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}