import React from "react";

const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full min-h-screen flex items-center bg-white overflow-hidden">
      {/* Left content */}
      <div className="max-w-[600px] pl-40 md:pl-40 pr-8 z-10">
        {/* Logo */}
        <img
          src="/images/cliva.png"
          alt="Logo"
          className="w-[50px] h-[50px] mb-6"
        />

        {/* Headline */}
        <h1 className="text-5xl font-extrabold text-black leading-tight mb-6">
          Seeing Health <br />
          Where It's Missing
        </h1>

        {/* Subheading */}
        <p className="text-lg text-gray-800 mb-4">
          An AI-powered tool for locating{" "}
          <span className="text-red-500 font-semibold">healthcare gaps</span>{" "}
          and{" "}
          <span className="text-cyan-600 font-semibold">simulating impact</span>
        </p>

        {/* Check + Text */}
        <div className="flex items-center mb-6">
          <img
            src="https://c.animaapp.com/7YfctCCD/img/check-list-1@2x.png"
            alt="Check"
            className="w-[24px] h-[24px] mr-2"
          />
          <span className="text-lg text-gray-800">Simulation for free</span>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mb-10">
          <button className="px-6 py-2 bg-[#1A2B91] text-white rounded-full shadow-md hover:bg-[#102075] transition duration-300">
            Simulate Now
          </button>
          <button className="px-6 py-2 bg-white text-black rounded-full border border-[#1A2B91] shadow-md hover:bg-[#f0f2ff] transition duration-300">
            Getting started
          </button>
        </div>

        {/* Logos */}
        <div className="flex items-center gap-2">
          <img
            src="https://c.animaapp.com/7YfctCCD/img/7123025-logo-google-g-icon-1@2x.png"
            alt="Google"
            className="w-[30px] h-[30px]"
          />
          <img
            src="https://c.animaapp.com/7YfctCCD/img/google-gemini--streamline-svg-logos-2.svg"
            alt="Gemini"
            className="w-[80px] h-[30px]"
          />
        </div>
      </div>

      {/* Right image with overlay */}
      <div className="absolute right-0 top-0 h-full w-1/2 overflow-hidden">
        {/* Hospital image */}
        <img
          src="/images/hospital-building.png"
          alt="Hospital"
          className="object-cover h-full w-full"
        />
        {/* Gradient overlay ONLY on this side */}
        <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent" />
      </div>
    </section>
  );
};

export default HeroSection;
