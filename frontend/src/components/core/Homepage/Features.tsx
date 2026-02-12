import React from "react";
import { FaUserTie, FaGraduationCap } from "react-icons/fa";
import { MdAutoGraph } from "react-icons/md";
import { BsLightningChargeFill } from "react-icons/bs";
import HighlightText from "../../common/HighlightText"
const Features: React.FC = () => {
  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
            Learning any language{" "}
            < HighlightText text={"faster, smarter & in one place"}/>

          </h2>

          <p className="mt-4 max-w-2xl mx-auto text-gray-500 text-sm md:text-base">
            Learn 20+ languages with realistic voice practice, smart progress
            tracking, and personalized schedules.
          </p>
        </div>


        {/* Feature Cards */}
        {/* Feature Cards */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">

  {/* Card */}
  <div className="flex items-start gap-4 p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
    <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full bg-cyan-100 text-cyan-600">
      <FaUserTie />
    </div>
    <div>
      <h4 className="font-semibold text-gray-900">
        Expert Guidance
      </h4>
      <p className="text-sm text-gray-500 mt-1 leading-relaxed">
        Structured lessons created by experts to help you learn step by step.
      </p>
    </div>
  </div>

  <div className="flex items-start gap-4 p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
    <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full bg-pink-100 text-pink-600">
      <FaGraduationCap />
    </div>
    <div>
      <h4 className="font-semibold text-gray-900">
        Student-First Learning
      </h4>
      <p className="text-sm text-gray-500 mt-1 leading-relaxed">
        Personalized learning paths that adapt to your pace and goals.
      </p>
    </div>
  </div>

  <div className="flex items-start gap-4 p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
    <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
      <MdAutoGraph />
    </div>
    <div>
      <h4 className="font-semibold text-gray-900">
        Flexible Learning
      </h4>
      <p className="text-sm text-gray-500 mt-1 leading-relaxed">
        Learn anytime, anywhere with a schedule that fits your lifestyle.
      </p>
    </div>
  </div>

  <div className="flex items-start gap-4 p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
    <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
      <BsLightningChargeFill />
    </div>
    <div>
      <h4 className="font-semibold text-gray-900">
        Practice & Progress
      </h4>
      <p className="text-sm text-gray-500 mt-1 leading-relaxed">
        Improve faster with real-world practice and clear progress tracking.
      </p>
    </div>
  </div>

</div>

      </div>
    </section>
  );
};

export default Features;