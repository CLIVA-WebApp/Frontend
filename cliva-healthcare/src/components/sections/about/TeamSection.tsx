import React from "react";
import { TeamMember, TeamMemberType } from "./TeamMember";

interface TeamSectionProps {
  title?: string;
  teamMembers: TeamMemberType[];
  backgroundImage?: string;
}

export function TeamSection({ 
  title = "Meet Our Team", 
  teamMembers,
  backgroundImage = "/placeholder.svg?height=600&width=1200"
}: TeamSectionProps) {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-[#fefefe] to-[#1D567C] relative">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      ></div>
      <div className="container mx-auto max-w-6xl relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-black text-center mb-16">{title}</h2>

        <div className="space-y-12">
          {teamMembers.map((member, index) => (
            <TeamMember
              key={member.name}
              member={member}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}