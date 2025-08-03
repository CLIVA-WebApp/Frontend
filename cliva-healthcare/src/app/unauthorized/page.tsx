"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { motion } from "framer-motion";

export default function UnauthorizedPage() {
  // Enhanced animation variants for ultra-smooth effect
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94], // Custom cubic-bezier for smoothness
        staggerChildren: 0.3, // Increased delay between children for better flow
        delayChildren: 0.2, // Initial delay before children start
      },
    },
  };

  const childVariants = {
    hidden: { 
      opacity: 0, 
      y: 40, 
      scale: 0.9,
      filter: "blur(4px)"
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { 
        duration: 1.2,
        ease: [0.25, 0.46, 0.45, 0.94], // Smooth cubic-bezier
        type: "tween" // Use tween instead of spring for smoother motion
      },
    },
  };

  // Background animation variants
  const backgroundVariants = {
    hidden: { 
      opacity: 0,
      scale: 1.1,
      filter: "blur(8px)"
    },
    visible: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 1.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  // Overlay animation
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
        ease: "easeOut",
        delay: 0.3,
      },
    },
  };

  return (
    <div className="relative w-full h-screen bg-[#1D567C] overflow-hidden flex items-center justify-center">
      {/* Animated Hospital Image with Blue Gradient Overlay */}
      <motion.div 
        variants={backgroundVariants}
        initial="hidden"
        animate="visible"
        className="absolute bottom-0 right-0 w-full h-full max-w-[1000px] max-h-[700px] z-0"
      >
        {/* Image */}
        <Image
          src="/images/hospital-building.png"
          alt="Hospital"
          fill
          className="object-cover object-bottom-right"
          priority
        />
        {/* Blue Gradient Overlay (Left transparent → Right solid) */}
        <motion.div 
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          className="absolute inset-0 bg-gradient-to-l from-transparent to-[#1D567C] opacity-100" 
        />
      </motion.div>

      {/* Blue Transparency Overlay for entire screen (70%) */}
      <motion.div 
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        className="absolute inset-0 bg-[#1D567C]/70 z-10" 
      />

      <Header variant="white" />

      {/* Content with ultra-smooth animation */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-30 flex flex-col md:flex-row items-center justify-center gap-16 max-w-6xl px-8"
      >
        {/* New Icon for Unauthorized with enhanced animation */}
        <motion.div 
          variants={childVariants}
          className="text-white"
          whileHover={{ 
            scale: 1.05, 
            rotate: 5,
            transition: { duration: 0.3, ease: "easeOut" }
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-64 h-64 md:w-[500px] md:h-[500px] drop-shadow-2xl"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V7.5A4.5 4.5 0 007.5 7.5v3M5.25 10.5h13.5a.75.75 0 01.75.75v8.25a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75v-8.25a.75.75 0 01.75-.75z"
            />
          </svg>
        </motion.div>

        {/* Text with staggered children */}
        <motion.div
          variants={childVariants}
          className="text-white text-center md:text-left"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 1,
              delay: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className="text-6xl md:text-7xl font-bold leading-none drop-shadow-lg"
          >
            401
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8,
              delay: 1.1,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className="text-3xl md:text-4xl font-semibold mt-4"
          >
            Unauthorized
          </motion.p>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8,
              delay: 1.3,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className="mt-6 text-lg text-white/80 max-w-md"
          >
            Access is denied due to invalid credentials
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.8,
              delay: 1.5,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className="inline-block mt-8"
          >
            <Link href="/auth/signin" className="inline-block">
              <Button className="bg-white font-bold text-[#1D567C] hover:bg-gray-100 hover:scale-105 text-lg px-8 py-6 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl">
                Sign In →
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}