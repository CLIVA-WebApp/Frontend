import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { HeroSection } from "@/components/sections/about/HeroSection";
import { AboutTeamSection } from "@/components/sections/about/AboutTeamSection";
import { MissionSection } from "@/components/sections/about/MissionSection";
import { TeamSection } from "@/components/sections/about/TeamSection";
import { TeamMemberType } from "@/components/sections/about/TeamMember";

export default function AboutPage() {
  const teamMembers: TeamMemberType[] = [
    {
      name: "Evelyn Yosiana",
      role: "Computer Science, ITB",
      image: "/images/eve.png",
      position: "left",
    },
    {
      name: "Dama Dhananjaya Daliman",
      role: "Information System, ITB",
      image: "/images/dama.png",
      position: "right",
    },
    {
      name: "Maximilian Sulistiyo",
      role: "Computer Science, ITB",
      image: "/images/max.png",
      position: "left",
    },
  ];

  const aboutCards = [
    {
      content: "Cliva (Clinical Services Evaluation WebApp) is a digital platform designed to make invisible healthcare gaps visible, helping local governments, public health planners, and NGOs improve access to care where it's needed most.",
      borderColor: "blue" as const,
    },
    {
      content: "We are a multidisciplinary team of web developers and designer committed to transforming complex health data into clear, actionable insights.",
      borderColor: "green" as const,
    },
  ];

  const mission = "To empower public health stakeholders with tools that make healthcare planning more equitable, data-driven, and transparent, ensuring no community is left behind.";

  return (
    <div className="min-h-screen bg-white">
      <Header variant="white" />
      
      <HeroSection title="About Us" />
      
      <AboutTeamSection 
        title="About Our Team"
        cards={aboutCards}
      />
      
      <MissionSection 
        title="Our Missions"
        mission={mission}
      />
      
      <TeamSection 
        title="Meet Our Team"
        teamMembers={teamMembers}
      />

      <Footer />
    </div>
  );
}