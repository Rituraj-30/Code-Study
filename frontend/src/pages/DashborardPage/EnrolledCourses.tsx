import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGetEnrolledCoursesQuery } from "../../services/authApi";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux"; // Redux se user nikalne ke liye
import RatingAndReview from "../../components/core/Dashboard/RatingAndReview";
import { PlayCircle, Loader2, BookOpen, CheckCircle } from "lucide-react";

const EnrolledCourses: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useGetEnrolledCoursesQuery(undefined);
  
  // Redux store se user data nikalna (Kyuki API response me userId undefined aa rahi hai)
  const { user } = useSelector((state: any) => state.profile);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState("");

  const courses = data?.data || [];
  
  // Multiple sources se userId check karna: 1. API 2. Redux 3. LocalStorage
  const userId = data?.userId || user?._id || user?.id || JSON.parse(localStorage.getItem("user") || "{}")?._id;

  // Debugging ke liye (Check in browser console)
  useEffect(() => {
    console.log("Current UserID:", userId);
    console.log("Enrolled Courses Data:", courses);
  }, [data, userId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#000814] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-cyan-400 mb-4" size={40} />
        <p className="text-gray-400 animate-pulse">Loading Your Enrolled Courses...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000814] text-white px-4 py-6 md:px-8">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-8">
        Your Learning
      </h1>

      {/* NO COURSES VIEW */}
      {courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="bg-white/5 p-6 rounded-full mb-4">
            <BookOpen size={48} className="text-gray-500" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">You haven't enrolled in any courses yet</h2>
          <p className="text-gray-400 mb-8 max-w-sm">
            Start your learning journey today by exploring our wide range of professional courses.
          </p>
          <button
            onClick={() => navigate("/courses")}
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-cyan-500/20"
          >
            Explore Courses
          </button>
        </div>
      ) : (
        /* COURSES GRID */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course: any) => {
            // Check if current user has already reviewed
            const userReview = course.ratingAndReviews?.find((r: any) => {
              const reviewUserId = r.user?._id || r.user; // Object ho ya String, handle karega
              return String(reviewUserId) === String(userId);
            });

            const progress = course.progressPercentage || 0;

            return (
              <motion.div
                key={course._id}
                className="bg-[#020617] border border-white/5 rounded-2xl overflow-hidden flex flex-col group"
              >
                {/* THUMBNAIL */}
                <div
                  className="relative aspect-video cursor-pointer"
                  onClick={() => navigate(`/view-course/${course._id}`)}
                >
                  <img
                    src={course.thumbnail}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                    alt={course.courseName}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                    <PlayCircle size={40} className="text-cyan-400" />
                  </div>
                </div>

                {/* DETAILS */}
                <div className="p-4 flex flex-col flex-grow">
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <h2 className="text-md font-bold line-clamp-1">{course.courseName}</h2>
                    
                    {/* REVIEW ACTION */}
                    {userReview ? (
                      <div className="flex items-center gap-1 text-green-400 bg-green-400/10 px-2 py-1 rounded-md">
                        <CheckCircle size={12} />
                        <span className="text-[10px] font-bold uppercase">Reviewed</span>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCourseId(course._id);
                          setIsModalOpen(true);
                        }}
                        className="text-[10px] font-bold text-cyan-500 uppercase hover:underline"
                      >
                        Add Review
                      </button>
                    )}
                  </div>

                  {/* PROGRESS BAR */}
                  <div className="mb-4">
                    <div className="flex justify-between text-[10px] mb-1 text-gray-400 font-medium">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/view-course/${course._id}`)}
                    className="mt-auto w-full py-2.5 bg-white/5 hover:bg-cyan-500 hover:text-black rounded-xl font-bold text-xs transition-all"
                  >
                    Continue Learning
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* RATING MODAL */}
      {isModalOpen && (
        <RatingAndReview
          courseId={selectedCourseId}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            refetch(); // Fresh data load karega review ke baad
          }}
        />
      )}
    </div>
  );
};

export default EnrolledCourses;