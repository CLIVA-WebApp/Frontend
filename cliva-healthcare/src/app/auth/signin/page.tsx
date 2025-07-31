'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, Check } from 'lucide-react'
import Link from 'next/link'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({
    email: '',
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isAnimated, setIsAnimated] = useState(false)

  // Trigger animations on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimated(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

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

  const validatePassword = (password: string) => {
    return password.length >= 6
  }

  const validateConfirmPassword = (password: string, confirmPassword: string) => {
    return confirmPassword === password && confirmPassword.length > 0
  }

  // Check if individual fields are valid
  const isEmailValid = () => {
    return email !== '' && validateEmail(email)
  }

  const isFirstNameValid = () => {
    return firstName !== '' && validateName(firstName)
  }

  const isLastNameValid = () => {
    return lastName !== '' && validateName(lastName)
  }

  const isUsernameValid = () => {
    return username !== '' && validateUsername(username)
  }

  const isPasswordValid = () => {
    return password !== '' && validatePassword(password)
  }

  const isConfirmPasswordValid = () => {
    return confirmPassword !== '' && validateConfirmPassword(password, confirmPassword)
  }

  // Check if form is valid
  const isFormValid = () => {
    return isEmailValid() && isFirstNameValid() && isLastNameValid() && 
           isUsernameValid() && isPasswordValid() && isConfirmPasswordValid()
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

  // Handle first name change
  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFirstName(value)
    
    if (value && !validateName(value)) {
      setErrors(prev => ({ ...prev, firstName: 'First name must be at least 2 characters' }))
    } else {
      setErrors(prev => ({ ...prev, firstName: '' }))
    }
  }

  // Handle last name change
  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLastName(value)
    
    if (value && !validateName(value)) {
      setErrors(prev => ({ ...prev, lastName: 'Last name must be at least 2 characters' }))
    } else {
      setErrors(prev => ({ ...prev, lastName: '' }))
    }
  }

  // Handle username change
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setUsername(value)
    
    if (value && !validateUsername(value)) {
      setErrors(prev => ({ ...prev, username: 'Username must be at least 3 characters and contain only letters, numbers, and underscores' }))
    } else {
      setErrors(prev => ({ ...prev, username: '' }))
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

    // Revalidate confirm password when password changes
    if (confirmPassword && !validateConfirmPassword(value, confirmPassword)) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }))
    } else if (confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: '' }))
    }
  }

  // Handle confirm password change
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setConfirmPassword(value)
    
    if (value && !validateConfirmPassword(password, value)) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }))
    } else {
      setErrors(prev => ({ ...prev, confirmPassword: '' }))
    }
  }

  // Handle form submission
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isFormValid()) return
    
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Here you would typically make an API call to your backend
      console.log('Register with:', { email, firstName, lastName, username, password })
      
      // Reset form on success
      setEmail('')
      setFirstName('')
      setLastName('')
      setUsername('')
      setPassword('')
      setConfirmPassword('')
      setErrors({
        email: '',
        firstName: '',
        lastName: '',
        username: '',
        password: '',
        confirmPassword: ''
      })
      
      // You might want to redirect or show success message
      alert('Account created successfully!')
      
    } catch (error) {
      console.error('Registration failed:', error)
      // Handle error (show error message, etc.)
    } finally {
      setIsLoading(false)
    }
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
        <form onSubmit={handleRegister} className="space-y-6">
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
                    errors.email 
                      ? 'border-[#FF2C2C]' 
                      : isEmailValid() 
                      ? 'border-[#12A048]' 
                      : 'border-gray-300'
                  } rounded-none bg-transparent px-0 pr-8 focus:ring-0 focus:border-current focus:outline-none transition-all duration-300 hover:border-[#1D567C] focus:scale-105 focus:shadow-sm ${
                    email ? 'animate-pulse' : ''
                  }`}
                />
                {isEmailValid() && (
                  <Check className="absolute right-0 top-1/2 transform -translate-y-1/2 text-[#12A048] transition-all duration-500 animate-in fade-in scale-in zoom-in-50" size={18} />
                )}
              </div>
              {errors.email && (
                <p className="text-[#FF2C2C] text-sm animate-in fade-in slide-in-from-top-2 duration-400 bounce-in">{errors.email}</p>
              )}
              {isEmailValid() && !errors.email && (
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
                      errors.firstName 
                        ? 'border-[#FF2C2C]' 
                        : isFirstNameValid() 
                        ? 'border-[#12A048]' 
                        : 'border-gray-300'
                    } rounded-none bg-transparent px-0 pr-8 focus:ring-0 focus:border-current focus:outline-none transition-all duration-300 hover:border-[#1D567C] focus:scale-105 focus:shadow-sm ${
                      firstName ? 'animate-pulse' : ''
                    }`}
                  />
                  {isFirstNameValid() && (
                    <Check className="absolute right-0 top-1/2 transform -translate-y-1/2 text-[#12A048] transition-all duration-500 animate-in fade-in scale-in zoom-in-50" size={18} />
                  )}
                </div>
                {errors.firstName && (
                  <p className="text-[#FF2C2C] text-sm animate-in fade-in slide-in-from-top-2 duration-400 bounce-in">{errors.firstName}</p>
                )}
                {isFirstNameValid() && !errors.firstName && (
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
                      errors.lastName 
                        ? 'border-[#FF2C2C]' 
                        : isLastNameValid() 
                        ? 'border-[#12A048]' 
                        : 'border-gray-300'
                    } rounded-none bg-transparent px-0 pr-8 focus:ring-0 focus:border-current focus:outline-none transition-all duration-300 hover:border-[#1D567C] focus:scale-105 focus:shadow-sm ${
                      lastName ? 'animate-pulse' : ''
                    }`}
                  />
                  {isLastNameValid() && (
                    <Check className="absolute right-0 top-1/2 transform -translate-y-1/2 text-[#12A048] transition-all duration-500 animate-in fade-in scale-in zoom-in-50" size={18} />
                  )}
                </div>
                {errors.lastName && (
                  <p className="text-[#FF2C2C] text-sm animate-in fade-in slide-in-from-top-2 duration-400 bounce-in">{errors.lastName}</p>
                )}
                {isLastNameValid() && !errors.lastName && (
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
                    errors.username 
                      ? 'border-[#FF2C2C]' 
                      : isUsernameValid() 
                      ? 'border-[#12A048]' 
                      : 'border-gray-300'
                  } rounded-none bg-transparent px-0 pr-8 focus:ring-0 focus:border-current focus:outline-none transition-all duration-300 hover:border-[#1D567C] focus:scale-105 focus:shadow-sm ${
                    username ? 'animate-pulse' : ''
                  }`}
                />
                {isUsernameValid() && (
                  <Check className="absolute right-0 top-1/2 transform -translate-y-1/2 text-[#12A048] transition-all duration-500 animate-in fade-in scale-in zoom-in-50" size={18} />
                )}
              </div>
              {errors.username && (
                <p className="text-[#FF2C2C] text-sm animate-in fade-in slide-in-from-top-2 duration-400 bounce-in">{errors.username}</p>
              )}
              {isUsernameValid() && !errors.username && (
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
                    errors.password 
                      ? 'border-[#FF2C2C]' 
                      : isPasswordValid() 
                      ? 'border-[#12A048]' 
                      : 'border-gray-300'
                  } rounded-none bg-transparent px-0 pr-16 focus:ring-0 focus:border-current focus:outline-none transition-all duration-300 hover:border-[#1D567C] focus:scale-105 focus:shadow-sm ${
                    password ? 'animate-pulse' : ''
                  }`}
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
              {errors.password && (
                <p className="text-[#FF2C2C] text-sm animate-in fade-in slide-in-from-top-2 duration-400 bounce-in">{errors.password}</p>
              )}
              {isPasswordValid() && !errors.password && (
                <p className="text-[#12A048] text-sm animate-in fade-in slide-in-from-top-2 duration-400 bounce-in">Password is strong enough</p>
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
                    errors.confirmPassword 
                      ? 'border-[#FF2C2C]' 
                      : isConfirmPasswordValid() 
                      ? 'border-[#12A048]' 
                      : 'border-gray-300'
                  } rounded-none bg-transparent px-0 pr-16 focus:ring-0 focus:border-current focus:outline-none transition-all duration-300 hover:border-[#1D567C] focus:scale-105 focus:shadow-sm ${
                    confirmPassword ? 'animate-pulse' : ''
                  }`}
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
              {errors.confirmPassword && (
                <p className="text-[#FF2C2C] text-sm animate-in fade-in slide-in-from-top-2 duration-400 bounce-in">{errors.confirmPassword}</p>
              )}
              {isConfirmPasswordValid() && !errors.confirmPassword && (
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
              <Link href="/auth/signup" className="text-[#1D567C] font-bold hover:text-[#37B7BE] transition-colors duration-200">
                Login Here
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}