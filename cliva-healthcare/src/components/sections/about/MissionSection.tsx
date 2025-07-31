import React from "react";

interface MissionSectionProps {
  title?: string;
  mission: string;
  backgroundColor?: string;
}

export function MissionSection({ 
  title = "Our Missions", 
  mission,
  backgroundColor = "#fefefe" 
}: MissionSectionProps) {
  return (
    <section className={`py-16 px-4 ${backgroundColor}`}>
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">{title}</h2>
        <blockquote className="text-lg md:text-m text-[#1D567C] italic font-medium leading-relaxed">
          &quot;{mission}&quot;
        </blockquote>
      </div>
    </section>
  );
}
