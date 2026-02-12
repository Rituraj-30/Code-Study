import React from 'react';
import { FaUsers, FaHeart, FaLink } from 'react-icons/fa';
import HighlightText from '../../common/HighlightText';

const StatsComponent: React.FC = () => {
  const stats = [
    { label: "Subscribers on Youtube", value: "1 M+" },
    { label: "Followers on Twitter", value: "6 K+" },
    { label: "Followers on Instagram", value: "135 K+" },
    { label: "Followers on Linkedin", value: "522 K+" },
  ];

  const companies = [
    { name: "Amazon", src: "https://lwfiles.mycourse.app/62a6cd5e1e9e2fbf212d608d-public/ec5be16b046b62a2a860b67f9dc55b86.png" },
    { name: "Google", src: "https://lwfiles.mycourse.app/62a6cd5e1e9e2fbf212d608d-public/ee17a1d06126f8bfc5444ad666e8ba21.png" },
    { name: "Microsoft", src: "https://lwfiles.mycourse.app/62a6cd5e1e9e2fbf212d608d-public/9e4198383730a6e7036b2c7cf50554d0.png" },
    { name: "Goldman Sachs", src: "https://lwfiles.mycourse.app/62a6cd5e1e9e2fbf212d608d-public/5a5a608278ba2b74aff5fb081f7df81c.png" },
    { name: "PayPal", src: "https://lwfiles.mycourse.app/62a6cd5e1e9e2fbf212d608d-public/02fb63567e1b107d549d5d15e922424b.png" },
    { name: "Samsung", src: "https://lwfiles.mycourse.app/62a6cd5e1e9e2fbf212d608d-public/4d6e24add7d7c5d618aeef1795dba038.png" },
    { name: "SalesForce", src: "https://lwfiles.mycourse.app/62a6cd5e1e9e2fbf212d608d-public/622a116daf32436d38271cd6c49ee3af.png" },
    { name: "Hitachi", src: "https://lwfiles.mycourse.app/62a6cd5e1e9e2fbf212d608d-public/91cb8fef8fe424a1ae2406aa58a380d8.png" },
    { name: "JPMorgan", src: "https://lwfiles.mycourse.app/62a6cd5e1e9e2fbf212d608d-public/689bf09a2c1040423fba7a8db0248211.png" },
    { name: "IBM", src: "https://lwfiles.mycourse.app/62a6cd5e1e9e2fbf212d608d-public/b5070669b92945ffb20fadc3ea552d16.png" },
    { name: "Dell", src: "https://lwfiles.mycourse.app/62a6cd5e1e9e2fbf212d608d-public/0f683ab474c5a018baa3bdd53330c9ae.png" },
    { name: "Deloitte", src: "https://lwfiles.mycourse.app/62a6cd5e1e9e2fbf212d608d-public/e24ce5f542c45a73c05172d9c4f38e2e.png" },
  ];

  return (
    <>
      {/* py-16 md:py-24 ko py-10 md:py-16 kiya */}
      <div className="w-full bg-[#f8faff] py-10 md:py-16 px-4 font-sans">
        
        {/* Upper Stats Section - mb-12 ko mb-8 kiya */}
        <div className="max-w-[1200px] mx-auto text-center mb-8">
          <h2 className="text-[#000814] text-2xl md:text-4xl font-extrabold mb-6 tracking-tight">
            INDIA'S MOST LOVED <HighlightText text={"CODING COMMUNITY"} /> ❤️
          </h2>
          
          <div className="flex flex-row flex-wrap justify-center gap-8 md:gap-24 text-[#000814]">
            <div className="flex flex-col items-center min-w-[120px]">
              <div className="flex items-center gap-2 text-xl md:text-2xl font-black">
                <FaUsers className="text-sky-600" /> 7,000,000+
              </div>
              <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Happy Learners</p>
            </div>
            
            <div className="flex flex-col items-center min-w-[120px]">
              <div className="flex items-center gap-2 text-xl md:text-2xl font-black">
                <FaHeart className="text-pink-600" /> 2 CRORE+
              </div>
              <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Monthly Views</p>
            </div>

            <div className="flex flex-col items-center min-w-[120px]">
              <div className="flex items-center gap-2 text-xl md:text-2xl font-black">
                <FaLink className="text-cyan-600" /> 100,000+
              </div>
              <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">New Subscribers</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto rounded-2xl md:rounded-[2rem] p-4 md:p-6 ">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl p-2 md:p-4 min-h-[80px] md:min-h-[110px] flex flex-col items-center justify-center text-center shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group cursor-default"
              >
                <h3 className="text-[#000814] text-lg md:text-2xl font-black transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-sky-500 group-hover:via-cyan-400 group-hover:bg-clip-text group-hover:text-transparent">
                  {stat.value}
                </h3>
                <p className="text-gray-400 text-[8px] md:text-[10px] font-bold uppercase tracking-tighter mt-1 leading-tight">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Company logo section - py-16 ko py-10 kiya */}
      <div className="w-full bg-white py-10 px-4">
        <div className="max-w-[1200px] mx-auto text-center">
          {/* Heading mb-12 ko mb-8 kiya */}
          <h2 className="text-[#000814] text-xl md:text-3xl font-bold mb-8 tracking-tight">
            Helped students achieve their dream job at
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-5">
            {companies.map((company, index) => (
              <div 
                key={index} 
                className="bg-gray-50/50 rounded-xl h-16 md:h-20 flex items-center justify-center p-4 
                           border border-gray-100 hover:bg-white hover:shadow-xl hover:shadow-blue-500/10 
                           transition-all duration-300 group cursor-pointer"
              >
                <img 
                  src={company.src} 
                  alt={company.name} 
                  className="max-h-full max-w-full object-contain filter grayscale brightness-0 opacity-40 
                             group-hover:grayscale-0 group-hover:brightness-100 group-hover:opacity-100 
                             transition-all duration-500"
                />
              </div>
            ))}
          </div>
          {/* mt-10 ko mt-6 kiya */}
          <p className="text-gray-400 text-xs md:text-sm mt-6 font-medium">
            + many more companies
          </p>
        </div>
      </div>
    </>
  );
};

export default StatsComponent;