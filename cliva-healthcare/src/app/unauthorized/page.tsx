"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";

export default function UnauthorizedPage() {
  return (
    <div className="relative w-full h-screen bg-[#1D567C] overflow-hidden flex items-center justify-center">
      {/* Hospital Image with Blue Gradient Overlay */}
      <div className="absolute bottom-0 right-0 w-full h-full max-w-[1000px] max-h-[700px] z-0">
        {/* Image */}
        <Image
          src="/images/hospital-building.png"
          alt="Hospital"
          fill
          className="object-cover object-bottom-right"
          priority
        />
        {/* Blue Gradient Overlay (Left transparent → Right solid) */}
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#1D567C] opacity-100" />
      </div>

      {/* Blue Transparency Overlay for entire screen (20%) */}
      <div className="absolute inset-0 bg-[#1D567C]/70 z-10" />

      <Header variant="white" />

      {/* Content */}
      <div className="relative z-30 flex flex-col md:flex-row items-center justify-center gap-16 max-w-6xl px-8">
        {/* New Icon for Unauthorized */}
        <div className="text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-64 h-64 md:w-[500px] md:h-[500px]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V7.5A4.5 4.5 0 007.5 7.5v3M5.25 10.5h13.5a.75.75 0 01.75.75v8.25a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75v-8.25a.75.75 0 01.75-.75z"
            />
          </svg>
        </div>

        {/* Text */}
        <div className="text-white text-center md:text-left">
          <h1 className="text-6xl md:text-7xl font-bold leading-none">401</h1>
          <p className="text-3xl md:text-4xl font-semibold mt-4">Unauthorized</p>
          <p className="mt-6 text-lg text-white/80 max-w-md">
            Access is denied due to invalid credentials
          </p>
          <Link href="/login" className="inline-block mt-8">
            <Button className="bg-white font-bold text-[#1D567C] hover:bg-gray-100 text-lg px-8 py-6 rounded-full">
              Sign In →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
