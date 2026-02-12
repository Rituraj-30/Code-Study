import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import HighlightText from "../../common/HighlightText";

// declare module 'swiper/css';
// declare module 'swiper/css/pagination';
// declare module 'swiper/css/navigation';

import 'swiper/css/bundle';

interface PlacementCard {
  id: number;
  name: string;
  company: string;
  companyLogo: string;
  role: string;
  package: string;
  userImage: string;
  college: string;
}

const placementData: PlacementCard[] = [
  {
    id: 1,
    name: "Kartik Agarwal",
    company: "Microsoft",
    role: "SDE Intern",
    package: "50K+ Stipend",
    college: "IIT Delhi",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    userImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kartik"
  },
  {
    id: 2,
    name: "Ananya Singh",
    company: "Google",
    role: "Software Engineer",
    package: "45 LPA",
    college: "NIT Trichy",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    userImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya"
  },
  {
    id: 3,
    name: "Rahul Verma",
    company: "Amazon",
    role: "Cloud Architect",
    package: "32 LPA",
    college: "BITS Pilani",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    userImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul"
  },
  {
    id: 4,
    name: "Sneha Kapoor",
    company: "Goldman Sachs",
    role: "Analyst",
    package: "28 LPA",
    college: "DTU",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/6/61/Goldman_Sachs_logo.svg",
    userImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha"
  },
  {
    id: 5,
    name: "Vikram Rathore",
    company: "Adobe",
    role: "Product Designer",
    package: "25 LPA",
    college: "NID",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Adobe_Corporate_logo.svg",
    userImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram"
  },
  {
    id: 6,
    name: "Ishita Dutta",
    company: "Zomato",
    role: "Frontend Dev",
    package: "18 LPA",
    college: "NSUT",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Zomato_Logo.svg",
    userImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ishita"
  },
  {
    id: 7,
    name: "Arjun Mehta",
    company: "Uber",
    role: "Backend Engineer",
    package: "38 LPA",
    college: "IIIT Hyderabad",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png",
    userImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun"
  }
];

const SuccessStories: React.FC = () => {
  return (
    <section className="py-12 md:py-24 bg-[#000814] relative overflow-hidden">
      {/* Background Glows - Responsive sizes */}
      <div className="absolute top-0 right-0 w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-sky-600/10 blur-[80px] md:blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-cyan-500/10 blur-[80px] md:blur-[120px] rounded-full"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-3xl md:text-6xl font-black text-white mb-4 tracking-tight leading-tight">
            Our Student <HighlightText text={"Cracking Top Tech"} />
          </h2>
          <p className="text-slate-400 text-base md:text-xl max-w-2xl mx-auto px-4">
            From learning basics to landing dream offers. Join the league of successful students.
          </p>
        </div>

        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={20}
          slidesPerView={1}
          loop={true}
          speed={1000}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true, dynamicBullets: true }}
          breakpoints={{
            // Mobile (default): 1 slide
            768: {
              slidesPerView: 2,
              spaceBetween: 30,
            },
            // Laptop/Desktop: 3 slides
            1100: {
              slidesPerView: 3,
              spaceBetween: 40,
            },
          }}
          className="pb-16 md:pb-20 cursor-grab active:cursor-grabbing"
        >
          {placementData.map((student) => (
            <SwiperSlide key={student.id}>
              <div className="group relative bg-[#161d29] border border-slate-700 rounded-3xl p-6 md:p-8 transition-all duration-500 hover:border-sky-500 hover:shadow-[0_0_30px_rgba(14,165,233,0.15)]">
                
                {/* Profile Header */}
                <div className="flex items-center gap-4 md:gap-5 mb-6 md:mb-8">
                  <div className="relative shrink-0">
                    <img 
                      src={student.userImage} 
                      alt={student.name} 
                      className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover border-2 border-slate-600 group-hover:border-sky-400 transition-colors"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl md:text-2xl font-bold text-white truncate group-hover:text-sky-400 transition-colors">
                      {student.name}
                    </h3>
                    <p className="text-slate-400 text-sm md:text-base font-medium truncate">{student.college}</p>
                  </div>
                </div>

                {/* Placement Box */}
                <div className="bg-[#000814]/50 rounded-2xl p-5 md:p-6 border border-slate-800 mb-6 md:mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-slate-500 text-[10px] md:text-xs uppercase tracking-widest font-bold">Placed At</span>
                    <span className="bg-sky-500/10 text-sky-400 text-[10px] md:text-xs px-2 py-1 rounded-full font-bold">
                      {student.role}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <img 
                      src={student.companyLogo} 
                      alt={student.company} 
                      className="h-6 md:h-8 max-w-[100px] md:max-w-[120px] object-contain brightness-0 invert opacity-80 group-hover:opacity-100 transition-opacity" 
                    />
                    <div className="text-right flex-shrink-0">
                      <p className="text-green-400 font-black text-lg md:text-xl leading-none">{student.package}</p>
                      <p className="text-slate-500 text-[9px] md:text-[10px] mt-1 uppercase">Package</p>
                    </div>
                  </div>
                </div>

                {/* Footer Quote */}
                <div className="flex items-center gap-2 text-slate-500 italic text-xs md:text-sm">
                  <div className="w-6 md:w-8 h-[1px] bg-slate-700"></div>
                  <span className="truncate">"Career transformed with CodeStudy"</span>
                  <div className="w-6 md:w-8 h-[1px] bg-slate-700"></div>
                </div>
              </div>


            </SwiperSlide>
          ))}
          <br /><br />
        </Swiper>
      </div>

      {/* Pagination Dot Styling */}
      <style>{`
        .swiper-pagination-bullet { background: #475569 !important; }
        .swiper-pagination-bullet-active { background: #0ea5e9 !important; width: 24px !important; border-radius: 10px !important; }
      `}</style>
    </section>
  );
};

export default SuccessStories;