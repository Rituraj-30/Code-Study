import React from "react";
import Button from "../../common/BTA";
import { TypeAnimation } from "react-type-animation";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

/* ================= PROPS TYPES ================= */
interface CTAButtonProps {
  active: boolean;
  link: string;
  btnText: string;
}

interface CodeBlocksProps {
  position: string;
  heading: React.ReactNode;
  subheading: string;
  ctabtn1: CTAButtonProps;
  ctabtn2: CTAButtonProps;
  codeblock: string;
  backgroundGradient: string;
  codeColor: string;
}

const CodeBlocks: React.FC<CodeBlocksProps> = ({
  position, heading, subheading, ctabtn1, ctabtn2, codeblock, backgroundGradient, codeColor
}) => {
  
  // 3D Mouse Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="w-full bg-[#000814] py-20 overflow-hidden">
      <div className={`max-w-[1260px] mx-auto flex ${position} justify-between flex-col lg:flex-row gap-12 items-center px-15`}>
        
        {/* LEFT SECTION (With Entrance Animation) */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-[50%] flex flex-col gap-8"
        >
          <div className="text-white text-3xl md:text-5xl font-extrabold tracking-tight">
            {heading}
          </div>
          <p className="text-gray-400 text-lg font-medium leading-relaxed max-w-[450px]">
            {subheading}
          </p>
          <div className="flex gap-6 mt-4">
            <Button linkto={ctabtn1.link} variant={ctabtn1.active ? "primary" : "secondary"}>
              <div className="flex items-center gap-2">{ctabtn1.btnText} <FaArrowRight /></div>
            </Button>
            <Button linkto={ctabtn2.link} variant={ctabtn2.active ? "primary" : "secondary"}>
              {ctabtn2.btnText}
            </Button>
          </div>
        </motion.div>

        {/* RIGHT SECTION: INTERACTIVE 3D CODE BLOCK */}
        <motion.div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateY, rotateX, transformStyle: "preserve-3d" }}
          className="relative w-full lg:w-[550px] group"
        >
          {/* Glowing Background (Moves with Mouse) */}
          <div className={`absolute -inset-4 blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full ${backgroundGradient}`}></div>
          
          <div className="relative flex flex-row py-4 text-[15px] leading-[24px] border border-white/10 bg-black/40 backdrop-blur-2xl rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
            
            {/* Window Controls (Mac Style) */}
            <div className="absolute top-4 left-4 flex gap-2 z-20">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
            </div>

            {/* Line Numbers */}
            <div className="text-center flex flex-col w-[12%] select-none text-gray-600 font-mono font-bold border-r border-white/5 mt-8">
              {Array.from({ length: 11 }).map((_, i) => (
                <p key={i} className="h-[24px]">{i + 1}</p>
              ))}
            </div>

            {/* Typing Area */}

            <div className={`w-[88%] flex flex-col font-mono font-bold px-2 mt-8 z-10`} style={{ color: codeColor }}>
              <TypeAnimation
                sequence={[codeblock, 2000, ""]}
                repeat={Infinity}
                cursor={true}
                style={{ whiteSpace: "pre-line", display: "block" }}
                omitDeletionAnimation={true}
              />
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default CodeBlocks;