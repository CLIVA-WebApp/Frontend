import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface InfoCardProps {
  content: string;
  borderColor?: "blue" | "green" | "red" | "yellow" | "purple";
}

export function InfoCard({ content, borderColor = "blue" }: InfoCardProps) {
  const borderColorClass = {
    blue: "border-l-blue-500",
    green: "border-l-green-500",
    red: "border-l-red-500",
    yellow: "border-l-yellow-500",
    purple: "border-l-purple-500",
  }[borderColor];

  return (
    <Card className={`border-l-4 ${borderColorClass} shadow-lg hover:shadow-xl transition-shadow duration-300`}>
      <CardContent className="p-6">
        <p className="text-gray-700 leading-relaxed">{content}</p>
      </CardContent>
    </Card>
  );
}
