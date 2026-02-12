import React from "react";
import { FaBookOpen ,FaArrowRight} from "react-icons/fa";
import Button from "../../common/BTA" 
import HighlightText from "../../common/HighlightText";
const Hero: React.FC = () => {
  return (
    <div className="bg-[#000814] flex flex-col items-center justify-center text-center px-4 py-12 md:py-16 min-h-[60vh]">

      {/* Small Subtitle */}
      <div className="flex items-center gap-2 mb-4 text-gray-400 text-sm font-medium">
        <FaBookOpen size={14} className="text-[#12D8FA]" />
        <p>Learn coding the right way</p>
        <FaArrowRight size={14} />
      </div>

      {/* Main Heading */}
      <h1 className="text-2xl md:text-4xl font-bold text-white mb-5">
        Matser the Art of Coding with{" "}
       < HighlightText text={"Precision"}/>
        
      </h1>


      <p className="max-w-180 text-gray-400 text-base md:text-lg font-normal mb-8 leading-relaxed">
        Journey from a Beginner to an industry-Professional with our meticulously crafte coding program . Clear explanations real-word Projects, and a community of 1M+ learners.
      </p>

      {/* Action Buttons */}

<div className="flex flex-wrap justify-center gap-5">
  <Button linkto="#" variant="primary">
    Explore Programs
  </Button>

  <Button linkto="#" variant="secondary">
    Book a Demo
  </Button>
</div>

    </div>
  );
};

export default Hero;
