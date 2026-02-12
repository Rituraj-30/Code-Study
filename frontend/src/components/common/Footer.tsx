import React from 'react';
import { FaGithub, FaTwitter, FaYoutube, FaFacebook } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#000814] text-white pt-12 pb-6 px-6 border-t border-white/5">
      {/* Container width ko kam kiya (max-w-4xl) taaki content center mein pass-pass rahe */}
      <div className="max-w-4xl mx-auto">
        
        {/* Footer Columns - Gap kam kar diya hai */}
        <div className="grid grid-cols-2 md:flex md:justify-between gap-x-4 gap-y-10 mb-12">
          
          {/* Main Column */}
          <div className="flex flex-col gap-2 min-w-[120px]">
            <h4 className="text-sm md:text-base font-bold uppercase tracking-widest text-gray-200">Main</h4>
            <ul className="flex flex-col gap-1.5 text-gray-400 text-xs md:text-sm">
              <li className="hover:text-blue-400 cursor-pointer transition-colors w-fit">Home</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors w-fit">Contact</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors w-fit">Work With Us</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors w-fit">My Gear</li>
            </ul>
          </div>

          {/* Learn Column */}
          <div className="flex flex-col gap-2 min-w-[120px]">
            <h4 className="text-sm md:text-base font-bold uppercase tracking-widest text-gray-200">Learn</h4>
            <ul className="flex flex-col gap-1.5 text-gray-400 text-xs md:text-sm">
              <li className="hover:text-blue-400 cursor-pointer transition-colors w-fit">Courses</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors w-fit">Tutorials</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors w-fit">Notes</li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="flex flex-col gap-2 min-w-[120px]">
            <h4 className="text-sm md:text-base font-bold uppercase tracking-widest text-gray-200">Legal</h4>
            <ul className="flex flex-col gap-1.5 text-gray-400 text-xs md:text-sm">
              <li className="hover:text-blue-400 cursor-pointer transition-colors w-fit">Terms</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors w-fit">Privacy</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors w-fit">Refund</li>
            </ul>
          </div>

          {/* Social Column */}
          <div className="flex flex-col gap-2 min-w-[120px]">
            <h4 className="text-sm md:text-base font-bold uppercase tracking-widest text-gray-200">Social</h4>
            <ul className="flex flex-col gap-2.5 text-gray-400 text-xs md:text-sm">
              <li className="flex items-center gap-2 hover:text-white cursor-pointer transition-all group">
                <FaGithub className="group-hover:scale-110" /> <span>GitHub</span>
              </li>
              <li className="flex items-center gap-2 hover:text-[#1DA1F2] cursor-pointer transition-all group">
                <FaTwitter className="group-hover:scale-110" /> <span>Twitter (X)</span>
              </li>
              <li className="flex items-center gap-2 hover:text-[#FF0000] cursor-pointer transition-all group">
                <FaYoutube className="group-hover:scale-110" /> <span>YouTube</span>
              </li>
              <li className="flex items-center gap-2 hover:text-[#1877F2] cursor-pointer transition-all group">
                <FaFacebook className="group-hover:scale-110" /> <span>Facebook</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar - Same to same alignment */}
        <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-gray-600 text-[10px] md:text-xs">
            © 2026 CodeStudy. All rights reserved.
          </p>
          <p className="text-gray-500 text-[11px] md:text-xs font-medium flex items-center gap-1">
           Built  <span className="text-red-500">❤️ </span> for Developers  <span className="text-amber-800">💻</span> by a Developer
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;