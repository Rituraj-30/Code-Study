import React from "react";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import HighlightText from "../../common/HighlightText";

interface Review {
  _id: string;
  rating: number;
  review: string;
  user: {
    firstName: string;
    lastName: string;
    image?: string;
  };
  course?: {
    courseName: string;
  };
}

interface Props {
  data?: Review[];
  heading?: boolean;
}

const TestimonialSlider: React.FC<Props> = ({ data = [], heading = true }) => {
  // ✅ Filter out reviews where user data is missing (Account deleted case)
  const validData = data.filter((item) => item && item.user);
  const duplicatedTestimonials = [...validData, ...validData];

  if (!validData.length) return null;

  return (
    <div className="w-full bg-white py-12 md:py-20 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 mb-8 md:mb-12 text-center">
        <h2 className="text-[#000814] text-2xl md:text-4xl font-black mb-3">
          {heading ? (
            <>What Our <HighlightText text={"Students Say"} /></>
          ) : (
            <>Student <HighlightText text={"Reviews"} /></>
          )}
        </h2>
        <p className="text-gray-500 text-xs md:text-base font-medium">
          {heading 
            ? "Real reviews from our amazing community" 
            : "How this course helped students transform their coding journey."}
        </p>
      </div>

      <div className="flex relative items-center">
        <motion.div
          className="flex gap-4 md:gap-6"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 25,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {duplicatedTestimonials.map((item, index) => (
            <div
              key={item._id + index}
              className="min-w-[260px] md:min-w-[350px] bg-[#161d29] rounded-2xl p-5 md:p-8 shadow-xl border border-white/5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 md:gap-4 mb-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden flex items-center justify-center shadow-lg shrink-0 border border-white/10">
                    {/* ✅ Optional chaining used here */}
                    {item?.user?.image ? (
                      <img 
                        src={item.user.image} 
                        alt={`${item?.user?.firstName} profile`} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm md:text-lg">
                        {item?.user?.firstName?.charAt(0) || "S"}
                      </div>
                    )}
                  </div>
                  
                  <div className="overflow-hidden">
                    <h4 className="text-white font-bold text-sm md:text-base truncate">
                      {item?.user?.firstName} {item?.user?.lastName}
                    </h4>
                    <p className="text-gray-400 text-[9px] md:text-[11px] uppercase tracking-wider truncate">
                      {item.course?.courseName || "Student"}
                    </p>
                  </div>
                </div>

                <p className="text-gray-300 text-xs md:text-sm mb-4 italic leading-relaxed line-clamp-4">
                  "{item?.review}"
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                <span className="text-yellow-400 font-bold text-xs md:text-sm">
                  {item?.rating}.0
                </span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`${i < (item?.rating || 0) ? "text-yellow-400" : "text-gray-600"} text-[10px] md:text-xs`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default TestimonialSlider;