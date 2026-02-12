import React, { useState } from "react";
import { useCreateRatingMutation } from "../../../services/authApi";
import { Star, Send, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

interface RatingProps {
  courseId: string;
  onClose: () => void;
}

const RatingAndReview: React.FC<RatingProps> = ({ courseId, onClose }) => {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [review, setReview] = useState<string>("");

  const [createRating, { isLoading }] = useCreateRatingMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return toast.error("Please select a star rating");

    try {
      await createRating({ courseId, rating, review }).unwrap();
      toast.success("Review submitted!");
      setRating(0);
      setReview("");
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to submit review");
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-[2px]">
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-[400px] bg-[#000b1a] border border-white/10 rounded-2xl shadow-2xl p-5 md:p-6"
      >
        {/* CROSS BUTTON - Now on Right Side */}
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 p-1 text-gray-500 hover:text-white transition-colors bg-white/5 rounded-full"
        >
          <X size={18} />
        </button>

        <div className="mb-5">
          <h2 className="text-lg font-bold text-white">Course Review</h2>
          <p className="text-gray-400 text-xs">How was your learning experience?</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* COMPACT STAR SECTION */}
          <div className="flex flex-col items-center justify-center py-3 bg-white/[0.03] rounded-xl border border-white/5">
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="transition-transform active:scale-90"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                >
                  <Star
                    size={26} // Size thoda chota kiya
                    className={`${
                      star <= (hover || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-700"
                    } transition-colors duration-200`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
               <p className="text-yellow-500 text-[10px] mt-2 font-bold uppercase tracking-wider">
                 {rating === 5 ? "Excellent! 😍" : rating >= 3 ? "Good! 🙂" : "Average 😕"}
               </p>
            )}
          </div>

          {/* COMPACT TEXT AREA */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">
              Feedback
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Write your review here..."
              rows={3} // Rows kam kar di
              className="w-full bg-black/50 text-white border border-white/10 rounded-xl p-3 text-sm focus:ring-1 focus:ring-cyan-500/50 focus:outline-none transition-all placeholder:text-gray-600 resize-none"
            />
          </div>

          {/* SLEEK SUBMIT BUTTON */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all
              ${isLoading 
                ? "bg-gray-800 text-gray-500 cursor-not-allowed" 
                : "bg-cyan-500 hover:bg-cyan-400 text-black shadow-md"
              }`}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                <Send size={14} /> Submit
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default RatingAndReview;