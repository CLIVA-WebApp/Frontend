import React from "react";
import Header from "../components/Header";
import HeroSection from "../components/sections/landingpage/HeroSection";
import FeaturesSection from "../components/sections/landingpage/FeaturesSection";
import StatsSection from "../components/sections/landingpage/StatsSection";
// import PricingPlans from "../components/sections/landingpage/PricingPlans";
import TestimonialsSection from "../components/sections/landingpage/TestimonialsSection";
import FAQSection from "../components/sections/landingpage/FAQSection";
import PartnersSection from "../components/sections/landingpage/PartnersSection";
import Footer from "../components/Footer";
import PricingPlans from "@/components/sections/landingpage/PricingPlans";

const App: React.FC = () => {
  return (
    <div className="bg-[#fefefe] w-full">
      <Header variant="black"/>
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <PricingPlans />
      <TestimonialsSection />
      <FAQSection />
      <PartnersSection />
      <Footer />
    </div>
  );
};

export default App;