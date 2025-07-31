"use client";
import React, { useEffect, useRef, useState } from "react";

const stats = [
  {
    title: "Up to",
    value: "1000+",
    subtitle: "Health center covered",
    description: "Tracking coverage across Indonesia's public clinics.",
  },
  {
    title: "Accross",
    value: "38",
    subtitle: "Province covered",
    description: "Supporting planning in all 38 Indonesian provinces.",
  },
  {
    title: "Localized to",
    value: "500+",
    subtitle: "Regions",
    description: "Plan smarter in urban, rural, and remote areas.",
  },
];

const StatsSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="w-full bg-white py-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {stats.map((item, index) => (
            <div
              key={index}
              className={`bg-[#fbb917cc] rounded-xl shadow-lg p-6 transition-all duration-700 hover:scale-105 hover:shadow-xl ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{
                transitionDelay: isVisible ? `${index * 150}ms` : "0ms",
              }}
            >
              {/* Title */}
              <div className="text-xl font-normal text-black">{item.title}</div>
              {/* Value */}
              <div className="text-5xl font-bold text-black mt-4">
                {item.value}
              </div>
              {/* Subtitle */}
              <div className="text-xl font-bold text-black mt-4">
                {item.subtitle}
              </div>
              {/* Description */}
              <p className="text-base text-black mt-4">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;