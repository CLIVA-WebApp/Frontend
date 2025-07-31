"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "What is CLIVA?",
    answer:
      "Cliva is a web-based platform that helps public health planners, local governments, and NGOs identify underserved areas and simulate the impact of opening new health clinics. It's built for those who want to make data-driven decisions in healthcare infrastructure planning.",
  },
  {
    question: "How does the simulation feature work?",
    answer:
      "Our simulation feature uses demographic and health data to model the impact of opening clinics in specific areas, predicting improvements in accessibility and coverage.",
  },
  {
    question: "What data does Cliva use?",
    answer:
      "Cliva integrates public health data, population density, and geographic data from reliable government and NGO sources to provide accurate simulations.",
  },
  {
    question: "Is Cliva free to use?",
    answer:
      "Cliva offers a free plan with limited simulations and a premium plan for advanced features and unlimited usage.",
  },
];

const FAQSection: React.FC = () => {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const toggleFAQ = (index: number) => {
    if (openIndexes.includes(index)) {
      setOpenIndexes(openIndexes.filter((i) => i !== index));
    } else {
      setOpenIndexes([...openIndexes, index]);
    }
  };

  return (
    <section className="w-full bg-gradient-to-b from-[#1D567C] via-white to-white py-20 px-6 md:px-20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left: Fixed Title */}
        <div className="md:sticky md:top-28 self-start">
          <h2 className="text-4xl md:text-5xl font-bold text-black leading-tight">
            Still Curious about <br />
            CLIVA?
          </h2>
          <p className="text-gray-700 mt-4 text-lg">
            Let us answer your curiousity
          </p>
        </div>

        {/* Right: FAQ Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndexes.includes(index);
            return (
              <div
                key={index}
                className={`border rounded-xl shadow-sm overflow-hidden transition-colors duration-300 ${
                  isOpen
                    ? "bg-[#37B7BE] border-[#1D567C]"
                    : "bg-white border-gray-300"
                }`}
              >
                {/* Question */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center px-5 py-4 text-left focus:outline-none transition"
                >
                  <span
                    className={`text-lg font-medium ${
                      isOpen ? "text-white" : "text-black"
                    }`}
                  >
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-400 ${
                      isOpen ? "rotate-180 text-white" : "text-gray-600"
                    }`}
                  />
                </button>

                {/* Answer */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: 0.55,
                        ease: [0.25, 0.1, 0.25, 1], // smoother cubic-bezier
                      }}
                      className="px-5 pb-4"
                    >
                      <p className="text-white text-base leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
