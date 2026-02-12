import React, { useState } from 'react';
import { Mail, MapPin, Send, MessageSquare, GraduationCap, Instagram, Github, Linkedin, Loader2 } from 'lucide-react';
import profileImg from "../assets/img/my-img.jpg"; 
import HighlightText from '../components/common/HighlightText';
import { useContactUsMutation } from '../services/authApi'; // ✅ Hook Import
import { toast } from 'react-hot-toast';

const LeetCodeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.483 0a1.374 1.374 0 0 0-.961.414l-4.377 4.406a.124.124 0 0 0 .005.176l.1.1a.124.124 0 0 0 .176-.005l4.377-4.406s.543-.543 1.125-.543 1.125.543 1.125.543l4.377 4.406a.124.124 0 0 0 .176.005l.1-.1a.124.124 0 0 0-.005-.176l-4.377-4.406a1.374 1.374 0 0 0-.961-.414zm-10.37 8.356a1.374 1.374 0 0 0-.961.414l-1.74 1.762a1.374 1.374 0 0 0 0 1.942l5.088 5.14c.47.475 1.125.518 1.665.13l1.151-.832a.124.124 0 0 0 .017-.174l-1.004-1.205a.124.124 0 0 0-.173-.017l-.822.589a.124.124 0 0 1-.155-.008l-3.413-3.454a.124.124 0 0 1 0-.176l1.74-1.762a.124.124 0 0 1 .176 0l1.74 1.762a.124.124 0 0 1 0 .176l-.35.353a.124.124 0 0 0 .005.176l.1.1a.124.124 0 0 0 .176-.005l.448-.452a1.374 1.374 0 0 0 0-1.942l-1.74-1.762a1.374 1.374 0 0 0-.961-.414zm14.15 0a1.374 1.374 0 0 0-.961.414l-1.74 1.762a1.18 1.18 0 0 0 0 1.675l1.74 1.762a.124.124 0 0 1 0 .176l-5.112 5.163a.124.124 0 0 1-.176 0l-1.74-1.762a.124.124 0 0 1 0-.176l.35-.353a.124.124 0 0 0-.005-.176l-.1-.1a.124.124 0 0 0-.176.005l-.448.452a1.374 1.374 0 0 0 0 1.942l1.74 1.762a1.374 1.374 0 0 0 .961.414c.35 0 .7-.133.961-.414l5.112-5.163a1.374 1.374 0 0 0 0-1.942l-1.74-1.762a1.374 1.374 0 0 0-.961-.414z"/>
  </svg>
);

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "", 
    email: "", 
    phone: "", 
    message: ""
  });

  // ✅ RTK Query Hook use kiya
  const [contactUs, { isLoading }] = useContactUsMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // ✅ Form Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      
      await contactUs({
        name: formData.name,
        email: formData.email,
        phoneno: formData.phone, 
        message: formData.message
      }).unwrap(); 

      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", phone: "", message: "" }); // Reset Form
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to send message. Try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-[#000814] text-white py-12 px-4 md:px-8 lg:px-16 font-sans">
      {/* Background Decorative Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500 rounded-full filter blur-[120px]"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-600 rounded-full filter blur-[120px]"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Side: Info & Personal Card */}
          <div className="space-y-10 animate-fadeIn">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                Contact <HighlightText text={"Us"} /> 
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                We are available for questions, feedback, or collaboration opportunities. 
                Let us know how we can help you grow!
              </p>
              <p className="text-gray-400 text-lg leading-relaxed max-w-md">

                If you feel something is missing or have suggestions, please <HighlightText text={"share them"} />. 

                I’d love to hear your ideas and apply them!

              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center gap-4 hover:border-cyan-500/30 transition-all">
                <div className="p-3 bg-cyan-500/10 rounded-xl"><Mail className="text-cyan-400" size={20} /></div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Email</p>
                  <p className="text-sm text-gray-200">rutu-project@gmail.com</p>
                </div>
              </div>
              <div className="flex-1 bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center gap-4 hover:border-cyan-500/30 transition-all">
                <div className="p-3 bg-cyan-500/10 rounded-xl"><MessageSquare className="text-cyan-400" size={20} /></div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Support</p>
                  <p className="text-sm text-gray-200">24/7 Live Chat</p>
                </div>
              </div>
            </div>

            {/* Personal Card */}
            <div className="relative group max-w-md">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative bg-[#000d1f] border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
                <div className="w-24 h-24 rounded-full border-2 border-cyan-500 p-1 flex-shrink-0">
                  <img src={profileImg} alt="Rituraj Singh" className="w-full h-full rounded-full object-cover shadow-lg" />
                </div>
                <div className="text-center sm:text-left space-y-2">
                  <h3 className="text-xl font-bold text-white">Rituraj Singh</h3>
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-400 text-sm">
                     <MapPin size={14} className="text-cyan-400" /> sanawda - Mandsaur
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-400 text-sm">
                     <GraduationCap size={14} className="text-cyan-400" /> Mandsaur University 
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-3 pt-2">
                    <a href="https://github.com/Rituraj-30" target="_blank" rel="noreferrer" className="p-2 bg-white/5 rounded-lg hover:bg-cyan-500/20 hover:text-cyan-400 transition-all border border-white/5"><Github size={18} /></a>
                    <a href="https://leetcode.com/u/rituraj_2930/" target="_blank" rel="noreferrer" className="p-2 bg-white/5 rounded-lg hover:bg-cyan-500/20 hover:text-cyan-400 transition-all border border-white/5"><LeetCodeIcon /></a>
                    <a href="https://www.instagram.com/r_u_t_u_.30/?hl=en" target="_blank" rel="noreferrer" className="p-2 bg-white/5 rounded-lg hover:bg-cyan-500/20 hover:text-cyan-400 transition-all border border-white/5"><Instagram size={18} /></a>
                    <a href="https://www.linkedin.com/in/rituraj-singh-52a5a0312/" className="p-2 bg-white/5 rounded-lg hover:bg-cyan-500/20 hover:text-cyan-400 transition-all border border-white/5"><Linkedin size={18} /></a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="bg-[#000d1f] border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl relative">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 ml-1">Full Name</label>
                <input required type="text" name="name" value={formData.name} placeholder="Your Name" onChange={handleChange}
                  className="w-full bg-[#001529]/50 border border-white/10 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-cyan-500/50 transition-all" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-1">Email</label>
                  <input required type="email" name="email" value={formData.email} placeholder="Email" onChange={handleChange}
                    className="w-full bg-[#001529]/50 border border-white/10 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-cyan-500/50 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-1">Phone Number</label>
                  <input required type="tel" name="phone" value={formData.phone} placeholder="Your number" onChange={handleChange}
                    className="w-full bg-[#001529]/50 border border-white/10 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-cyan-500/50 transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 ml-1">Message</label>
                <textarea required rows={4} name="message" value={formData.message} placeholder="Type your message here..." onChange={handleChange}
                  className="w-full bg-[#001529]/50 border border-white/10 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-cyan-500/50 transition-all resize-none"></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-4 rounded-xl hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>Sending <Loader2 className="animate-spin" size={18} /></>
                ) : (
                  <>Send Message <Send size={18} /></>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;