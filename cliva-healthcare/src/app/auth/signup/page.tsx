'use client'

import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
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
        <div className="space-y-6">
          <div className="text-4xl font-bold leading-snug">Hello,<br/>Welcome Back</div>

          {/* Email */}
          <Input
            type="email"
            placeholder="13522083@gmail.com"
            className="border-0 border-b border-gray-300 rounded-none bg-transparent px-0 focus:ring-0 focus:border-[#37B7BE]"
          />

          {/* Password with Eye icon */}
          <div className="relative">
            <Input
              type="password"
              placeholder="password123"
              className="border-0 border-b border-gray-300 rounded-none bg-transparent px-0 pr-10 focus:ring-0 focus:border-[#37B7BE]"
            />
            <Eye className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
          </div>

          <div className="text-right text-sm">
            <Link href="#" className="text-[#1D567C] font-medium hover:text-[#37B7BE]">
              Forgot password?
            </Link>
          </div>

          <Button className="bg-[#1D567C] hover:bg-[#37B7BE] w-full text-lg py-6 rounded-md shadow-md">
            Sign Up
          </Button>

          <div className="text-center text-sm">
            Don’t have an account?
            <Link href="#" className="ml-1 text-[#1D567C] font-semibold hover:text-[#37B7BE]">
              Register Here
            </Link>
          </div>

          <div className="relative text-center mt-4">
            <div className="absolute left-0 right-0 top-2 border-t border-gray-300"></div>
            <span className="bg-white px-2 relative z-10 text-[#8A8A8A]">or</span>
          </div>

          <Button variant="outline" className="w-full flex items-center justify-center gap-2 mt-4 py-6 border-[#1D567C]">
            <Image src="/images/google-icon.png" alt="Google" width={20} height={20} />
            Continue with Google
          </Button>
        </div>
      </div>
    </div>
  )
}
