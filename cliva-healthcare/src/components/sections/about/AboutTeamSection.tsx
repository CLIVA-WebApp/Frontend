import React from "react";
import clsx from "clsx";

interface InfoCardProps {
  content: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ content }) => {
  return (
    <div
      className={clsx(
        "border border-[#1D567C] rounded-md shadow-sm p-4 text-m leading-relaxed text-gray-800"
      )}
    >
      {content}
    </div>
  );
};

interface AboutTeamSectionProps {
  title?: string;
  cards: Array<{ content: string }>;
}

export function AboutTeamSection({
  title = "About Our Team",
  cards,
}: AboutTeamSectionProps) {
  return (
    <section className="py-12 px-6">
      <div className="container mx-auto max-w-6xl grid md:grid-cols-[auto_1fr] gap-10 items-center">
        {/* Title block */}
        <div>
          <h2 className="md:text-4xl font-bold text-black leading-tight drop-shadow-md text-left">
            About Our <br /> Team
          </h2>
        </div>

        {/* Cards */}
        <div className="space-y-4">
          {cards.map((card, index) => (
            <InfoCard key={index} content={card.content} />
          ))}
        </div>
      </div>
    </section>
  );
}
