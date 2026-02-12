import React from 'react';
import HighlightText from '../../common/HighlightText';

// Corrected Imports
import teacherImg from "../../../assets/img/teacher.png";
import teacher2Img from "../../../assets/img/teacher2.png";
import teacher3Img from "../../../assets/img/teacher3.png";

const AboutSection: React.FC = () => {
  return (
    <div className="relative w-full bg-[#000814] py-16 md:py-24 px-6 overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-cyan-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-[1100px] mx-auto relative z-10">
        
        {/* Top Header */}
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-white text-3xl md:text-5xl font-black mb-6 tracking-tight leading-[1.1]">
            Innovating Education for a <br className="hidden sm:block" />
            <HighlightText text={"Brighter Future"} />
          </h2>
          <p className="text-gray-400 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed opacity-80">
            We are revolutionizing learning by merging tech with world-class pedagogy. 
            We create an environment where students become future industry leaders.
          </p>
        </div>

        {/* Image Gallery - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-24">
          {[teacherImg, teacher2Img, teacher3Img].map((img, index) => (
            <div 
              key={index}
              className="group relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#000814] via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
              
              <img 
                src={img} 
                alt={`Teacher ${index + 1}`} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
            </div>
          ))}
        </div>

        {/* Bottom Quote Section */}
        <div className="text-center max-w-4xl mx-auto pt-10 border-t border-white/5">
          <p className="text-gray-200 text-xl md:text-3xl font-extrabold tracking-tight italic">
            "We bridge the gap between <HighlightText text={"talent and opportunity"} />"
          </p>
          <div className="mt-4 h-1 w-20 bg-cyan-500 mx-auto rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default AboutSection;