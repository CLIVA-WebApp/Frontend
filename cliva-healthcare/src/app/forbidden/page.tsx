"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";

export default function ForbiddenPage() {
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
        {/* Icon (Lock for Forbidden) */}
        <div className="text-white">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-64 h-64 md:w-[400px] md:h-[500px]"
        >
            {/* Shield outline */}
            <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 2.25l9 4.5v6.75c0 5.25-3.75 10.5-9 12-5.25-1.5-9-6.75-9-12V6.75l9-4.5z"
            />
            {/* X inside shield */}
            <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 9l6 6m0-6l-6 6"
            />
        </svg>
        </div>


        {/* Text */}
        <div className="text-white text-center md:text-left">
          <h1 className="text-7xl md:text-8xl font-bold leading-none">403</h1>
          <p className="text-3xl md:text-4xl font-semibold mt-4">Forbidden</p>
          <p className="mt-6 text-lg text-white/80 max-w-md">
            You don’t have permission to access this resource.
          </p>
          <Link href="/" className="inline-block mt-8">
            <Button className="bg-white font-bold text-[#1D567C] hover:bg-gray-100 text-lg px-8 py-6 rounded-full">
              Go Back →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
