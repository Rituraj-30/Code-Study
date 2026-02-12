import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { 
  useGetLectureQuery, 
  useUpdateCourseProgressMutation 
} from "../../services/authApi";
import { 
  PlayCircle, 
  CheckCircle2, 
  ChevronRight, 
  LayoutPanelLeft, 
  ArrowLeft, 
  ArrowRight,
  X 
} from "lucide-react";

// 1. HELPER: Seconds ko professional format (e.g., 2m 15s) mein badalne ke liye
const formatDuration = (totalSeconds: number | string) => {
  if (!totalSeconds) return "0s";
  const secs = Math.floor(Number(totalSeconds));
  const minutes = Math.floor(secs / 60);
  const remainingSeconds = secs % 60;

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${remainingSeconds}s`;
};

const ViewCourse = () => {
  const { courseId } = useParams();
  
  // API Calls
  const { data, isLoading } = useGetLectureQuery(courseId);
  const [updateProgress] = useUpdateCourseProgressMutation();
  
  // States
  const [activeVideo, setActiveVideo] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); 

  // Derived Data
  const courseDetails = data?.data?.courseDetails;
  const completedVideos = data?.data?.completedVideos || [];

  // Sabhi lectures ko ek array mein laana taaki Next/Prev buttons kaam karein
  const allLectures = courseDetails?.courseContent?.flatMap((sec: any) => sec.subSection) || [];
  const currentIndex = allLectures.findIndex((lec: any) => lec._id === activeVideo?._id);

  // Progress Percentage nikaalna sidebar ke liye
  const progressPercentage = allLectures.length > 0 
    ? Math.round((completedVideos.length / allLectures.length) * 100) 
    : 0;

  // Pehla video load par set karna
  useEffect(() => {
    if (courseDetails?.courseContent?.[0]?.subSection?.[0] && !activeVideo) {
      setActiveVideo(courseDetails.courseContent[0].subSection[0]);
    }
  }, [courseDetails, activeVideo]);



  const goToNext = () => {
    if (currentIndex < allLectures.length - 1) {
      setActiveVideo(allLectures[currentIndex + 1]);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setActiveVideo(allLectures[currentIndex - 1]);
    }
  };
    const handleVideoEnded = async () => {
    try {
      // 1. Pehle progress update karo backend mein
      await updateProgress({ 
        courseId, 
        subsectionId: activeVideo._id 
      }).unwrap(); 
goToNext()
    } catch (err) {
      console.error("Failed to update progress", err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#000814] flex items-center justify-center">
        <div className="text-cyan-400 font-bold animate-pulse">Loading Course Content...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#000814] text-white overflow-hidden relative">
      
      {/* ================= SIDEBAR (LEFT) ================= */}
      <div className={`
        ${isSidebarOpen ? "w-[300px] md:w-[350px]" : "w-0"} 
        fixed lg:relative z-50 h-full bg-[#020617] border-r border-white/5 
        transition-all duration-300 ease-in-out flex flex-col overflow-hidden
      `}>
        {/* Sidebar Header */}
        <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/5">
          <div className="flex items-center gap-2">
            <LayoutPanelLeft size={18} className="text-cyan-400" />
            <h2 className="font-black text-xs uppercase tracking-wider italic">Course Content</h2>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* PROGRESS BAR SECTION */}
        <div className="px-5 py-4 border-b border-white/5 bg-white/[0.01]">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold text-gray-500 uppercase">Your Progress</span>
            <span className="text-[10px] font-bold text-cyan-400">{progressPercentage}%</span>
          </div>
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-cyan-500 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(6,182,212,0.5)]"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Playlist Items */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pb-10">
          {courseDetails?.courseContent.map((section: any) => (
            <div key={section._id}>
              <div className="px-5 py-2 bg-white/[0.02] text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-white/5">
                {section.sectionName}
              </div>
              {section.subSection.map((sub: any) => {
                const isCompleted = completedVideos.includes(sub._id);
                const isActive = activeVideo?._id === sub._id;

                return (
                  <button
                    key={sub._id}
                    onClick={() => {
                      setActiveVideo(sub);
                      if (window.innerWidth < 1024) setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-5 py-4 text-left transition-all border-b border-white/[0.02] 
                      ${isActive ? "bg-cyan-500/10 border-r-4 border-r-cyan-500" : "hover:bg-white/5 text-gray-400"}`}
                  >
                    <div className="shrink-0">
                      {isCompleted ? (
                        <CheckCircle2 size={18} className="text-green-500" /> 
                      ) : (
                        <PlayCircle size={18} className={isActive ? "text-cyan-400" : "text-gray-600"} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-bold truncate ${isActive ? "text-white" : ""}`}>{sub.title}</p>
                      {/* FIX: Formatted Duration yahan dikhega */}
                      <p className="text-[10px] font-mono text-cyan-400/60 mt-0.5">
                        {sub.timeDuration ? formatDuration(sub.timeDuration) : "Video"}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* ================= MAIN AREA (RIGHT) ================= */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Sidebar Toggle Button */}
        {!isSidebarOpen && (
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="absolute left-4 top-4 z-40 p-2 bg-cyan-500 text-black rounded-xl shadow-lg hover:scale-110 transition-all"
          >
            <ChevronRight size={24} />
          </button>
        )}

        <div className="flex-1 overflow-y-auto pt-4 custom-scrollbar">
          <div className="max-w-5xl mx-auto p-4 lg:px-12">
            
            {/* NAVIGATION BUTTONS */}
            <div className="flex justify-between items-center mb-4">
              <button 
                onClick={goToPrevious}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 px-4 py-2 text-black  bg-cyan-200 0 hover:bg-cyan-300  rounded-xl text-xs font-bold transition-all disabled:opacity-20"
              >
                <ArrowLeft size={16} /> Previous
              </button>
              
              <button 
                onClick={goToNext}
                disabled={currentIndex === allLectures.length - 1}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-black hover:bg-cyan-400 rounded-xl text-xs font-bold transition-all disabled:opacity-20 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              >
                Next <ArrowRight size={16} />
              </button>
            </div>

            {/* VIDEO PLAYER */}
            <div className="relative w-full bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl h-[250px] md:h-[400px] lg:h-[480px]"> 
              {activeVideo ? (
                <video
                  key={activeVideo.videoUrl}
                  src={activeVideo.videoUrl}
                  autoPlay
                  controls
                  onEnded={handleVideoEnded } 
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-600 animate-pulse">
                  Select a lecture from the sidebar...
                </div>
              )}
            </div>

            {/* LECTURE INFO SECTION */}
            <div className="mt-8 pb-20">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 text-[9px] font-black uppercase rounded border border-cyan-500/20">
                  Lecture Active
                </span>
                {completedVideos.includes(activeVideo?._id) && (
                  <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[9px] font-black uppercase rounded border border-green-500/20">
                    Completed
                  </span>
                )}
              </div>
              
              <h1 className="text-xl md:text-3xl font-bold text-white tracking-tight border-b border-white/5 pb-5">
                {activeVideo?.title}
              </h1>

              <div className="mt-8 p-8 bg-white/[0.02] rounded-3xl border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500/50"></div>
                <h3 className="text-[10px] font-bold text-gray-500 uppercase mb-4 tracking-widest">Description</h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-4xl">
                  {activeVideo?.description || "No description provided."}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCourse;