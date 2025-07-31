import React from "react";

interface HeaderProps {
  variant?: "white" | "black"; // Choose style theme
}

const Header: React.FC<HeaderProps> = ({ variant = "black" }) => {
  // Define styles based on variant
  const textColor =
    variant === "white" ? "text-white hover:text-gray-200" : "text-black hover:text-blue-500";

  return (
    <>
      {/* Centered Navigation */}
      <div className="absolute top-7 left-1/2 transform -translate-x-1/2 flex items-center gap-10">
        <a
          href="#"
          className={`${textColor} text-xl font-normal [font-family:'Inter',Helvetica] transition-colors`}
        >
          Home
        </a>
        <a
          href="#"
          className={`${textColor} text-xl font-normal [font-family:'Inter',Helvetica] transition-colors`}
        >
          About Us
        </a>
        <a
          href="#"
          className={`${textColor} text-xl font-normal [font-family:'Inter',Helvetica] transition-colors`}
        >
          Dashboard
        </a>

        {/* Line under "Home" */}
        <div
          className={`absolute top-8 left-0 w-14 h-0.5 bg-no-repeat bg-cover ${
            variant === "white"
              ? "bg-[url('https://c.animaapp.com/7YfctCCD/img/line-white.svg')]"
              : "bg-[url('https://c.animaapp.com/7YfctCCD/img/line-26.svg')]"
          }`}
        />
      </div>

      {/* Top-Right Sign In */}
      <a
        href="#"
        className={`absolute top-7 right-10 ${textColor} text-xl font-normal [font-family:'Inter',Helvetica] transition-colors`}
      >
        Sign In
      </a>
    </>
  );
};

export default Header;
