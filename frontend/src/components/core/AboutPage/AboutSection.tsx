import React from "react";
import HighlightText from "../../common/HighlightText";
import Button from "../../common/BTA";
import {
  Video,
  Download,
  PlayCircle,
  ShieldCheck,
} from "lucide-react";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureProps> = ({ icon, title, description }) => (
  <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group">
    <div className="w-14 h-14 bg-sky-50 text-sky-500 rounded-xl flex items-center justify-center mb-6 group-hover:bg-gradient-to-br group-hover:from-sky-500 group-hover:to-cyan-400 group-hover:text-white transition-all duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">
      {/* Title ke andar HighlightText direct wrap kiya hai */}
      <HighlightText text={title} />
    </h3>
    <p className="text-slate-600 leading-relaxed text-sm md:text-base">{description}</p>
  </div>
);

const AboutPage: React.FC = () => {
  return (
    <div className="bg-white overflow-hidden">
      {/* Hero Section - Reduced padding from py-24 to py-16 */}
      <section className="relative py-16 md:py-24 px-6 bg-slate-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-sky-500 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-400 rounded-full filter blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <h1 className="text-3xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Revolutionizing Education <br />
            <HighlightText text={"Live Class at a Time"} />
          </h1>
          <p className="text-base md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Welcome to the future of learning. We bridge the gap between expert
            instructors and passionate students through an interactive.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button linkto="#" variant="primary">Start Learning Now</Button>
            <Button linkto="#" variant="secondary">Join as Instructor</Button>
          </div>
        </div>
      </section>

      {/* Mission Section - Adjusted py-20 to py-12/16 */}
      <section className="py-12 md:py-20 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
              Our Mission: <HighlightText text={"Democratizing"} /> <br />
              Quality Education
            </h2>
            <p className="text-slate-600 text-base md:text-lg mb-6 leading-relaxed">
              We started with a simple idea: Learning should be interactive,
              accessible, and comprehensive. Our platform provides a seamless
              ecosystem.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Real-time interaction",
                "Unlimited access",
                "Flexibility",
                "Community Support",
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-slate-700 font-medium text-sm md:text-base">
                  <ShieldCheck size={20} className="text-sky-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-sky-50 rounded-3xl -rotate-2"></div>
            <img
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80"
              alt="Digital Learning"
              className="relative rounded-2xl shadow-2xl object-cover w-full h-[300px] md:h-[400px]"
            />
          </div>
        </div>
      </section>

      {/* Core Platform Features - Reduced gap and padding */}
      <section className="py-12 md:py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">What We Offer</h2>
            <div className="h-1.5 w-16 bg-gradient-to-r from-sky-500 to-cyan-400 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <FeatureCard
              icon={<Video size={28} />}
              title="Interactive Live Classes"
              description="Join real-time sessions led by industry experts. Ask questions just like a physical classroom."
            />
            <FeatureCard
              icon={<PlayCircle size={28} />}
              title="Recorded Lectures"
              description="Never miss a lesson. Access the full library of recorded live sessions anytime, anywhere."
            />
            <FeatureCard
              icon={<Download size={28} />}
              title="Premium Digital Notes"
              description="Get exclusive access to high-quality, downloadable PDF notes curated specifically for you."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;


{/* 
      CTA Section - Fixed Gradient
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-sky-500 to-cyan-500 rounded-[2rem] p-10 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-sky-200">
          <div className="relative z-10 text-white">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Master New Skills?
            </h2>
            <p className="text-sky-50 mb-10 max-w-xl mx-auto leading-relaxed opacity-90">
              Join thousands of students who are already learning from the best
              instructors. Your future starts with a single click.
            </p>
            <button className="bg-white text-sky-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-slate-50 transition-all inline-flex items-center gap-2 group shadow-lg">
              Join for Free
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-cyan-300/20 rounded-full blur-2xl"></div>
        </div>
      </section> */}
