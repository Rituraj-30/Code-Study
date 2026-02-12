import React, { useState, useMemo } from 'react';
import { useGetAllCategoriesQuery } from '../services/authApi';
import { Search, IndianRupee, Star, Loader2, BookOpen, ArrowRight, Users } from 'lucide-react'; // 1. Users icon add kiya
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { toast } from 'react-hot-toast';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import HighlightText from "../components/common/HighlightText"

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Courses: React.FC = () => {
  const { data, isLoading } = useGetAllCategoriesQuery({});
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  
  const token = useSelector((state: RootState) => state.auth.token);

  const filteredCategories = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((category: any) => {
      if (category.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return category;
      }
      const filteredCourses = category.courses?.filter((course: any) =>
        course.courseName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return { ...category, courses: filteredCourses };
    }).filter((cat: any) => cat.courses && cat.courses.length > 0);
  }, [data, searchTerm]);

  const handleCourseClick = (courseId: string) => {
    const currentToken = token || localStorage.getItem("token");
    if (currentToken) {
      navigate(`/courses/${courseId}`);
    } else {
      toast.error("Please login to see course details");
    }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-[#000814] flex flex-col items-center justify-center">
      <Loader2 className="animate-spin text-cyan-400 mb-4" size={40} />
      <p className="text-gray-400 animate-pulse">Loading Categories & Courses...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#000814] font-sans">
      {/* Search Header Section */}
      <div className="bg-white w-full py-16 px-4 md:px-8 lg:px-16 shadow-lg mb-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#000814]">
              Master New <HighlightText text={"Skills"} />
            </h1>
            <p className="text-gray-600 max-w-lg font-medium">
              Browse through our top-rated categories and find the perfect course.
            </p>
          </div>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search..."
              className="w-full bg-gray-50 border border-gray-200 text-[#000814] rounded-xl py-4 pl-12 pr-4 outline-none"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-20 px-4 md:px-8 lg:px-16 pb-20 text-white">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category: any) => (
            <div key={category._id} className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-4">
                  <div className="h-8 w-1 bg-cyan-500 rounded-full"></div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest">{category.name}</h2>
                    <p className="text-[10px] md:text-xs text-gray-500 mt-0.5">{category.description}</p>
                  </div>
                </div>
                <button className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-all text-xs md:text-sm font-bold tracking-tighter">
                  <HighlightText text={" VIEW ALL"}/> <ArrowRight size={14} />
                </button>
              </div>

              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={20}
                slidesPerView={1.2}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                  1280: { slidesPerView: 4 },
                }}
                className="pb-10"
              >
                {category.courses.map((course: any) => (
                  <SwiperSlide key={course._id}>
                    <div 
                      onClick={() => handleCourseClick(course._id)}
                      className="group bg-[#000d1f]/50 border border-white/10 rounded-2xl overflow-hidden hover:border-cyan-500/40 transition-all cursor-pointer flex flex-col h-full shadow-lg"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img src={course.thumbnail} alt={course.courseName} className="w-full h-full object-cover group-hover:scale-110 transition-all" />
                      </div>

                      <div className="p-5 flex flex-col flex-grow">
                        <h3 className="font-bold text-lg mb-2 line-clamp-1">{course.courseName}</h3>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center text-xl font-black text-white">
                            <IndianRupee size={18} className="text-cyan-400" />
                            {course.price}
                          </div>
                          
                          {/* 2. Rating ki jagah Student Count wala UI */}
                          <div className="flex items-center gap-1.5 text-gray-400 bg-white/5 px-2 py-1 rounded-lg">
                            <Users size={14} className="text-cyan-400" />
                            <span className="text-xs font-bold text-gray-300">
                               {/* Backend field ke according change karein (e.g. course.studentsEnrolled.length) */}
                              {course.studentsEnrolled?.length || 0} Students
                            </span>
                          </div>

                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <BookOpen size={48} className="text-gray-700 mb-4" />
            <p className="text-gray-500">No courses found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;