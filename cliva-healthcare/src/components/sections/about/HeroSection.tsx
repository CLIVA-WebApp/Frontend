"use client";

import React from "react";
import { motion } from "framer-motion";

interface HeroSectionProps {
  title: string;
  backgroundImage?: string;
}

export function HeroSection({ title, backgroundImage = "/placeholder.svg?height=400&width=800" }: HeroSectionProps) {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative h-64 md:h-80 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 overflow-hidden"
    >
      {/* Lazy-loaded background */}
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      ></motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-transparent"
      ></motion.div>

      {/* Animated text */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 container mx-auto px-4 h-full flex items-center"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-white">{title}</h1>
      </motion.div>

      {/* Decorative cross */}
      <motion.div
        initial={{ scale: 0, rotate: -30, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 0.2 }}
        transition={{ delay: 0.5, duration: 1, type: "spring" }}
        className="absolute top-1/2 right-1/4 transform -translate-y-1/2"
      >
        <div className="w-16 h-16 md:w-24 md:h-24 relative">
          <div className="absolute top-1/2 left-1/2 w-6 h-16 md:w-8 md:h-24 bg-cyan-400 transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute top-1/2 left-1/2 w-16 h-6 md:w-24 md:h-8 bg-cyan-400 transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </motion.div>
    </motion.section>
  );
}