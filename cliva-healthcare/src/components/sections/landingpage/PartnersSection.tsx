"use client";
import React from "react";

const logos = [
  "https://c.animaapp.com/7YfctCCD/img/lorem-lorem-logo-png-seeklogo-445274-5@2x.png",
  "https://c.animaapp.com/7YfctCCD/img/lorem-lorem-logo-png-seeklogo-445274-5@2x.png",
  "https://c.animaapp.com/7YfctCCD/img/lorem-lorem-logo-png-seeklogo-445274-5@2x.png",
  "https://c.animaapp.com/7YfctCCD/img/lorem-lorem-logo-png-seeklogo-445274-5@2x.png",
  "https://c.animaapp.com/7YfctCCD/img/lorem-lorem-logo-png-seeklogo-445274-5@2x.png",
  "https://c.animaapp.com/7YfctCCD/img/lorem-lorem-logo-png-seeklogo-445274-6@2x.png",
  "https://c.animaapp.com/7YfctCCD/img/lorem-lorem-logo-png-seeklogo-445274-7@2x.png",
];

const PartnersSection: React.FC = () => {
  return (
    <section className="relative w-full bg-white py-16 overflow-hidden">
      {/* Title */}
      <h2 className="text-3xl md:text-4xl font-bold text-center text-black mb-12">
        Meet our partners
      </h2>

      {/* Animated logos */}
      <div className="relative flex overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {logos.map((logo, index) => (
            <img
              key={index}
              src={logo}
              alt={`Partner ${index}`}
              className="h-12 mx-8 md:mx-16 object-contain"
            />
          ))}
          {/* Duplicate logos for seamless loop */}
          {logos.map((logo, index) => (
            <img
              key={`dup-${index}`}
              src={logo}
              alt={`Partner ${index}`}
              className="h-12 mx-8 md:mx-16 object-contain"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
