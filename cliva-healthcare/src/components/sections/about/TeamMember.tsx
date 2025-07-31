import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export interface TeamMemberType {
  name: string;
  role: string;
  image: string;
  position: "left" | "right";
}

interface TeamMemberProps {
  member: TeamMemberType;
  index: number;
}

export function TeamMember({ member, index }: TeamMemberProps) {
  return (
    <div
      className={`flex flex-col md:flex-row items-center gap-8 ${
        member.position === "right" ? "md:flex-row-reverse" : ""
      }`}
    >
      <div className="flex-shrink-0">
        <div className="w-40 h-40 md:w-52 md:h-52 overflow-hidden">
          <Image
            src={member.image || "/placeholder.svg"}
            alt={member.name}
            width={208}
            height={208}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <Card className="bg-[#FEFEFE] shadow-md border border-gray-200 max-w-md w-full">
        <CardContent className="p-6">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">{member.name}</h3>
          <p className="text-[#8A8A8A] text-md md:text-lg">{member.role}</p>
        </CardContent>
      </Card>
    </div>
  );
}
