'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '13522083@gmail.com',
    password: 'password123'
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex min-h-[calc(100vh-80px)]">
        {/* Left Side - Hospital Image */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <Image
            src="/hospital.png"
            alt="Modern Healthcare Building"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent z-10"></div>
        </div>

        {/* Right Side - Sign In Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-md"
          >
            <Card className="shadow-xl border-0">
              <CardHeader className="text-center pb-8">
                <div className="flex items-center justify-center mb-6">
                  <Image
                    src="/cliva.png"
                    alt="CLIVA Logo"
                    width={48}
                    height={48}
                    className="rounded-lg"
                  />
                </div>
                <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                  Hello,
                </CardTitle>
                <CardTitle className="text-3xl font-bold text-healthcare-blue">
                  Welcome Back
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Email */}
                <div className="space-y-2">
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="h-12 text-lg border-gray-300 focus:border-healthcare-blue"
                    placeholder="Enter your email"
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="h-12 text-lg border-gray-300 focus:border-healthcare-blue pr-12"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  {/* Forgot Password Link */}
                  <div className="text-right">
                    <Link 
                      href="/auth/forgot-password" 
                      className="text-sm text-healthcare-blue hover:text-blue-700 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                {/* Sign In Button */}
                <Button 
                  className="w-full h-12 text-lg bg-healthcare-blue hover:bg-blue-700 font-semibold"
                  size="lg"
                >
                  Sign Up
                </Button>

                {/* Sign Up Link */}
                <div className="text-center">
                  <p className="text-gray-600">
                    Don't have an account?{' '}
                    <Link 
                      href="/auth/signup" 
                      className="text-healthcare-blue hover:text-blue-700 font-semibold hover:underline"
                    >
                      Register Here
                    </Link>
                  </p>
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">or</span>
                  </div>
                </div>

                {/* Google Sign In */}
                <Button 
                  variant="outline"
                  className="w-full h-12 text-lg border-2 border-gray-300 hover:border-healthcare-blue hover:bg-gray-50"
                  size="lg"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Continue with Google</span>
                  </div>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}