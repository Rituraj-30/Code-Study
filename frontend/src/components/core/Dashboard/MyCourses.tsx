import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  useGetInstructorCoursesMutation, 
  useEditCourseMutation, 
  useDeleteCourseMutation 
} from "../../../services/authApi";
import { motion } from "framer-motion";
import { 
  Pencil, UploadCloud, Users, Video, Plus, 
  EyeOff, Radio, Trash2, Loader2 
} from "lucide-react";
import { toast } from "react-hot-toast";
import ConfirmationModal from "../../common/ConfirmationModal";

const MyCourses: React.FC = () => {
  const navigate = useNavigate();
  
  // States
  const [modalOpen, setModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);

  // RTK Queries
  const [getCourses, { data, isLoading }] = useGetInstructorCoursesMutation();
  const [editCourse, { isLoading: isUpdating }] = useEditCourseMutation();
  const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation(); 

  useEffect(() => {
    getCourses(undefined);
  }, [getCourses]);

  // Status Toggle Logic (Draft <-> Published)
  const handleStatusToggle = async (courseId: string, currentStatus: string) => {
    const newStatus = currentStatus === "Published" ? "Draft" : "Published";
    const formData = new FormData();
    formData.append("courseId", courseId);
    formData.append("status", newStatus);

    try {
      await editCourse(formData).unwrap();
      toast.success(`Course moved to ${newStatus}`);
      getCourses(undefined);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  // ✅ FINAL DELETE LOGIC (Modal se trigger hoga)
  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;

    const toastId = toast.loading("Deleting course and Lecture...");
    try {
      await deleteCourse({ courseId: courseToDelete }).unwrap();
      toast.success("Course deleted successfully", { id: toastId });
      setModalOpen(false); // Modal band karo
      getCourses(undefined); // List refresh karo
    } catch (error: any) {
      toast.error(error?.data?.message || "Could not delete course", { id: toastId });
    } finally {
      setCourseToDelete(null);
    }
  };

  // Sorting: Published upar, Draft niche
  const courses = data?.data ? [...data.data].sort((a: any, b: any) => {
    if (a.status !== "Draft" && b.status === "Draft") return -1;
    if (a.status === "Draft" && b.status !== "Draft") return 1;
    return 0;
  }) : [];

  return (
    <div className="min-h-screen bg-[#000814] text-white px-4 py-6"> 
      
      {/* Modal Integration */}
      <ConfirmationModal 
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setCourseToDelete(null);
        }}
        onConfirm={handleDeleteCourse}
        title="Delete Course?"
        message="Are you sure to Delete Course"
      />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">My Courses</h1>
        <button 
          onClick={() => navigate("/dashboard/add-course")}
          className="bg-cyan-500 text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-cyan-400 flex items-center gap-2 transition-all active:scale-95 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
        >
          <Plus size={18} /> Create Course
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-[380px] bg-white/5 rounded-2xl animate-pulse border border-white/5" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
          <p className="text-gray-400 font-medium">No courses found. Start by creating one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course: any) => (
            <motion.div
              key={course._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#020617]/80 border border-white/5 rounded-2xl p-4 backdrop-blur flex flex-col justify-between hover:border-white/20 transition-all shadow-xl"
            >
              <div>
                <div className="relative overflow-hidden rounded-xl mb-4 group">
                  <img
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Status Overlay */}
                  <div className="absolute top-2 left-2">
                    <StatusBadge status={course.status} />
                  </div>
                  
                  {/* ✅ DELETE ICON (TOP RIGHT) */}
                  <button 
                    onClick={() => {
                      setCourseToDelete(course._id);
                      setModalOpen(true);
                    }}
                    disabled={isDeleting}
                    className="absolute top-2 right-2 p-2 bg-red-600/90 hover:bg-red-500 text-white rounded-full transition-all shadow-lg active:scale-90 opacity-0 group-hover:opacity-100"
                    title="Delete Course"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <h2 className="text-lg font-semibold line-clamp-1 mb-1">{course.courseName}</h2>

                <div className="flex items-center gap-2 text-gray-400 text-sm bg-white/5 w-fit px-3 py-1 rounded-full border border-white/5">
                  <Users size={14} className="text-cyan-500" />
                  {course.studentsEnrolled?.length || 0} Students
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-2">
                <button
                  onClick={() => navigate(`/dashboard/add-lecture/${course._id}`)}
                  className="w-full flex items-center justify-center gap-2 text-[11px] font-bold bg-white/10 border border-white/10 rounded-lg py-2.5 hover:bg-white/20 transition-all text-white"
                >
                  <Video size={14} /> Add Lecture
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/dashboard/edit-course/${course._id}`)}
                    className="flex-1 flex items-center justify-center gap-1 text-[11px] font-medium bg-white/5 border border-white/5 rounded-lg py-2 hover:bg-white/10 transition-colors"
                  >
                    <Pencil size={13} /> Edit
                  </button>

                  {course.status === "Published" ? (
                    <div className="flex-1 flex gap-2">
                      <button
                        onClick={() => navigate(`/dashboard/live/${course._id}`)}
                        className="flex-[2] flex items-center justify-center gap-1 text-[11px] font-bold bg-cyan-500 text-black rounded-lg py-2 hover:bg-cyan-400 transition-all"
                      >
                        <Radio size={13} className="animate-pulse" /> Go Live
                      </button>
                      <button
                        disabled={isUpdating}
                        onClick={() => handleStatusToggle(course._id, course.status)}
                        title="Unpublish"
                        className="flex-1 flex items-center justify-center bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg py-2 hover:bg-red-500/20 transition-all"
                      >
                        <EyeOff size={13} />
                      </button>
                    </div>
                  ) : (
                    <button
                      disabled={isUpdating}
                      onClick={() => handleStatusToggle(course._id, course.status)}
                      className="flex-1 flex items-center justify-center gap-1 text-[11px] font-bold bg-cyan-500 text-black rounded-lg py-2 hover:bg-cyan-400 transition-colors"
                    >
                      <UploadCloud size={13} /> Publish
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const base = "px-2 py-[2px] rounded-md text-[9px] font-black uppercase tracking-tighter shadow-xl";
  if (status === "Draft") return <span className={`${base} bg-yellow-500 text-black`}>Draft</span>;
  if (status === "Published") return <span className={`${base} bg-blue-500 text-white`}>Published</span>;
  return <span className={`${base} bg-green-500 text-black`}>Live</span>;
};

export default MyCourses;