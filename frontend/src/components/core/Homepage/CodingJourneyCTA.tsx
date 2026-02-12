import React from "react";
import Button from "../../common/BTA";
import HighlightText from "../../common/HighlightText";

const CodingJourneyCTA: React.FC = () => {
  return (
    // Height kam karne ke liye py-20 ko py-12/py-16 kiya hai
    <div className="relative w-full py-12 md:py-16 px-6 overflow-hidden bg-[#000814]">
      {/* Subtle Glows */}
      <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-blue-600/10 blur-[100px] rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-cyan-600/10 blur-[100px] rounded-full"></div>

      <div className="max-w-3xl mx-auto text-center relative z-10">
        {/* Main Heading - Size chota kiya hai (text-2xl to text-4xl) */}
        <h2 className="text-white text-2xl md:text-4xl font-extrabold mb-4 tracking-tight">
          Start Your <HighlightText text={"Coding Journey "} />
        </h2>

        {/* Description Text - Size chota kiya hai (text-xs to text-base) */}
        <p className="text-gray-400 text-xs md:text-base max-w-xl mx-auto mb-8 leading-relaxed">
          Learn coding step-by-step with India's most loved programming mentor.
        </p>

        {/* Buttons - Inka size aur padding bhi compact kiya hai */}
        <div className="flex flex-row items-center justify-center gap-3">
          <Button linkto="login" variant="primary">
            Start Now
          </Button>
          <Button linkto="#" variant="secondary">
            Curriculum
          </Button>
          
        </div>
      </div>
    </div>
  );
};

export default CodingJourneyCTA;
