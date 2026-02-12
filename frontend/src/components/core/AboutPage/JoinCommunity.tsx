import React from "react";
import { Youtube, Linkedin, MessageSquare, Send, ExternalLink } from "lucide-react";

interface SocialPlatform {
  name: string;
  icon: React.ReactNode;
  link: string;
  brandColor: string;
}

const JoinCommunity: React.FC = ({text ,color="bg-white"}) => {
  let color1:string="text-slate-700"

  if(color==="bg-[#000814]")  color1="text-[#ececec]";
  const platforms: SocialPlatform[] = [
    {
      name: "YouTube",
      icon: <Youtube size={24} className="text-[#FF0000]" />, // Icon size chota kiya (24)
      link: "https://youtube.com",
      brandColor: "group-hover:text-[#FF0000]",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin size={24} className="text-[#0A66C2]" />,
      link: "https://linkedin.com",
      brandColor: "group-hover:text-[#0A66C2]",
    },
    {
      name: "Discord",
      icon: <MessageSquare size={24} className="text-[#5865F2]" />,
      link: "https://discord.com",
      brandColor: "group-hover:text-[#5865F2]",
    },
    {
      name: "Telegram",
      icon: <Send size={24} className="text-[#26A5E4]" />,
      link: "https://t.me",
      brandColor: "group-hover:text-[#26A5E4]",
    },
  ];

  return (
    <section className={`${color} py-16 md:py-24 px-4 flex flex-col items-center text-center`}>
       

        {/* Sub-heading */}
        <div className="mb-12">
          <h3 className="text-slate-400 font-semibold uppercase tracking-[0.2em] text-sm">
            {text}
          </h3>
        </div>

        {/* Platforms Grid - Centered via mx-auto */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8 md:gap-x-16 max-w-4xl w-full">
          {platforms.map((platform, index) => (
            <a
              key={index}
              href={platform.link}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col items-center space-y-4 transition-all duration-300"
            >
              {/* Icon Circle - Chota aur refined shadow */}
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.06)] group-hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)] group-hover:-translate-y-2 transition-all duration-500 relative">
                {platform.icon}
                <div className="absolute inset-0 rounded-full border border-transparent group-hover:border-slate-100 transition-all duration-500"></div>
              </div>

              {/* Platform Name - Centered with Icon */}
              <div className={`flex items-center justify-center gap-1.5 ${color1} font-bold text-sm md:text-base transition-colors duration-300 ${platform.brandColor}`}>
                <ExternalLink size={14} className="opacity-70" />
                {platform.name}
              </div>
            </a>
          ))}
        </div>
    </section>
  );
};

export default JoinCommunity;