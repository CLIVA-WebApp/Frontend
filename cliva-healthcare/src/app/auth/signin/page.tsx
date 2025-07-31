'use client'

import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'
import Link from 'next/link'

export default function SignUpPage() {
  const inputClass =
    'w-full border-b border-gray-300 focus:border-[#1D567C] bg-transparent px-0 py-2 focus:ring-0 focus:outline-none text-sm text-gray-700 placeholder-gray-400'

  return (
    <div className="flex h-screen">
      {/* Left Image Section */}
      <div className="w-3/5 relative">
        <Image
          src="/images/hospital-building.png"
          alt="Hospital Building"
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#fefefe] opacity-100" />
      </div>


      <div className="w-2/5 px-24 py-10 bg-white flex flex-col justify-center relative">   

        {/* Form Title */}
        <div className="text-4xl font-bold text-[#1D567C] mb-8">
          <div className="flex items-center gap-2">
            <span>Create Account</span>
          </div>
        </div>

        <div className="space-y-5 text-gray-700">
          <input type="email" placeholder="email address" className={inputClass} />

          <div className="flex gap-4">
            <input type="text" placeholder="first name" className={inputClass} />
            <input type="text" placeholder="last name" className={inputClass} />
          </div>

          <input type="text" placeholder="username" className={inputClass} />

          <div className="relative">
            <input type="password" placeholder="password" className={inputClass + ' pr-10'} />
            <Eye className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>

          <div className="relative">
            <input type="password" placeholder="confirm password" className={inputClass + ' pr-10'} />
            <Eye className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>

          <Button className="w-full mt-4 bg-gray-500 text-white py-6 rounded-md text-lg shadow-md hover:bg-gray-600">
            Register
          </Button>

          <div className="text-sm text-center mt-2">
            Already have an account?{' '}
            <Link href="#" className="text-blue-800 font-medium">
              Login Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
