import React from "react";

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
  return (
    <section className="w-full bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {stats.map((item, index) => (
            <div
              key={index}
              className="bg-[#fbb917cc] rounded-xl shadow-lg p-6 transition-transform duration-300 hover:scale-105 hover:shadow-xl"
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
