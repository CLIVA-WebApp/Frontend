'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, Check } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({ email: '', password: '' })
  const [isLoading, setIsLoading] = useState(false)

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Password validation (at least 6 characters)
  const validatePassword = (password: string) => {
    return password.length >= 6
  }

  // Check if form is valid
  const isFormValid = () => {
    return validateEmail(email) && validatePassword(password) && email !== '' && password !== ''
  }

  // Check if individual fields are valid
  const isEmailValid = () => {
    return email !== '' && validateEmail(email)
  }

  const isPasswordValid = () => {
    return password !== '' && validatePassword(password)
  }

  // Handle email change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    
    if (value && !validateEmail(value)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }))
    } else {
      setErrors(prev => ({ ...prev, email: '' }))
    }
  }

  // Handle password change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)
    
    if (value && !validatePassword(value)) {
      setErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters long' }))
    } else {
      setErrors(prev => ({ ...prev, password: '' }))
    }
  }

  // Handle form submission
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isFormValid()) return
    
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Here you would typically make an API call to your backend
      console.log('Sign up with:', { email, password })
      
      // Reset form on success
      setEmail('')
      setPassword('')
      setErrors({ email: '', password: '' })
      
      // TODO: LOGIN HERE 
      
    } catch (error) {
      console.error('Sign up failed:', error)
      // Handle error (show error message, etc.)
    } finally {
      setIsLoading(false)
    }
  }

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="flex h-screen bg-[#E9E9E9]">
      <div className="w-3/5 relative">
        <Image
          src="/images/hospital-building.png"
          alt="Hospital Building"
          layout="fill"
          objectFit="cover"
          className="brightness-100"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#fefefe] opacity-100" />
      </div>
      
      <div className="w-2/5 flex flex-col justify-center px-24 bg-[#FEFEFE] text-[#1D567C]">
        <form onSubmit={handleSignUp} className="space-y-6">
          <div className="text-4xl font-bold leading-snug">Hello,<br/>Welcome Back</div>

          {/* Email */}
          <div className="space-y-2">
            <div className="relative">
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={handleEmailChange}
                className={`border-0 border-b ${
                  errors.email 
                    ? 'border-[#FF2C2C]' 
                    : isEmailValid() 
                    ? 'border-[#12A048]' 
                    : 'border-gray-300'
                } rounded-none bg-transparent px-0 pr-8 focus:ring-0 focus:border-current focus:outline-none`}
              />
              {isEmailValid() && (
                <Check className="absolute right-0 top-1/2 transform -translate-y-1/2 text-[#12A048]" size={20} />
              )}
            </div>
            {errors.email && (
              <p className="text-[#FF2C2C] text-sm">{errors.email}</p>
            )}
            {isEmailValid() && !errors.email && (
              <p className="text-[#12A048] text-sm">Valid email address</p>
            )}
          </div>

          {/* Password with Eye icon */}
          <div className="space-y-2">
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Your password"
                value={password}
                onChange={handlePasswordChange}
                className={`border-0 border-b ${
                  errors.password 
                    ? 'border-[#FF2C2C]' 
                    : isPasswordValid() 
                    ? 'border-[#12A048]' 
                    : 'border-gray-300'
                } rounded-none bg-transparent px-0 pr-16 focus:ring-0 focus:border-current focus:outline-none`}
              />
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                {isPasswordValid() && (
                  <Check className="text-[#12A048]" size={20} />
                )}
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
            </div>
            {errors.password && (
              <p className="text-[#FF2C2C] text-sm">{errors.password}</p>
            )}
            {isPasswordValid() && !errors.password && (
              <p className="text-[#12A048] text-sm">Password is strong enough</p>
            )}
          </div>

          <div className="text-right text-sm">
            <Link href="#" className="text-[#1D567C] font-medium hover:text-[#37B7BE]">
              Forgot password?
            </Link>
          </div>

          <Button 
            type="submit"
            disabled={!isFormValid() || isLoading}
            className={`w-full text-lg py-6 rounded-md shadow-md transition-all duration-200 ${
              isFormValid() && !isLoading
                ? 'bg-[#1D567C] hover:bg-[#37B7BE] text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300'
            }`}
          >
            {isLoading ? 'Signing up...' : 'Sign Up'}
          </Button>

          <div className="text-center text-sm">
            Don't have an account?
            <Link href="#" className="ml-1 text-[#1D567C] font-semibold hover:text-[#37B7BE]">
              Register Here
            </Link>
          </div>

          <div className="relative text-center mt-4">
            <div className="absolute left-0 right-0 top-2 border-t border-gray-300"></div>
            <span className="bg-white px-2 relative z-10 text-[#8A8A8A]">or</span>
          </div>

          <Button 
            type="button"
            variant="outline" 
            className="w-full flex items-center justify-center gap-2 mt-4 py-6 border-[#1D567C] hover:bg-gray-50"
          >
            <Image src="/images/google-icon.png" alt="Google" width={20} height={20} />
            Continue with Google
          </Button>
        </form>
      </div>
    </div>
  )
}