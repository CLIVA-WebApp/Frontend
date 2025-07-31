"use client";

import React from "react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Find public health center",
    description: "Explore healthcare facilities closest to underserved populations.",
  },
  {
    title: "Simulate Clinic Impact",
    description: "Test how adding new clinics affects local coverage instantly.",
  },
  {
    title: "Prioritize by Equity",
    description: "Rank regions using need, vulnerability, and service gaps.",
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="relative w-full py-20 bg-[#1D567C]">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid md:grid-cols-3 gap-10 relative">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-start p-8 rounded-2xl transition-transform duration-500 ease-out hover:scale-110 min-h-[320px]" // ensures equal height
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              {/* Title */}
              <h3 className="text-3xl font-bold text-[#FEFEFE] leading-snug mb-4">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-lg text-[#E9E9E9] mb-8">
                {feature.description}
              </p>

              {/* Push button to bottom */}
              <div className="mt-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center whitespace-nowrap px-6 py-3 rounded-full bg-[#FBB917] text-black font-medium transition duration-300"
                >
                  Quick Start →
                </motion.button>
              </div>
            </motion.div>
          ))}

          {/* Vertical dividing lines */}
          <div className="hidden md:block absolute top-6 bottom-6 left-1/3 w-px bg-[#FEFEFE]/30"></div>
          <div className="hidden md:block absolute top-6 bottom-6 left-2/3 w-px bg-[#FEFEFE]/30"></div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
