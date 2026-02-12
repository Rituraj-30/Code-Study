import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEditCourseMutation, useGetCourseDetailsQuery, useGetAllCategoriesQuery } from "../../../services/authApi";
import { toast } from "react-hot-toast";
import CourseForm from "./CourseForm";
import { Loader2 } from "lucide-react";

const EditCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { data: categoriesData } = useGetAllCategoriesQuery(undefined);
  const { data: courseDetails, isLoading: isFetching } = useGetCourseDetailsQuery(courseId);
  const [updateCourse, { isLoading: isUpdating }] = useEditCourseMutation();

  const handleEdit = async (data: FormData) => {
    data.append("courseId", courseId as string);
    try {
      await updateCourse(data).unwrap();
      toast.success("Course updated successfully 🚀");
      navigate("/dashboard/my-courses");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update course");
    }
  };

  if (isFetching) return (
    <div className="min-h-screen flex items-center justify-center bg-[#000814]">
      <Loader2 className="animate-spin text-cyan-400" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#000814] flex justify-center items-start">
      <CourseForm 
        mode="edit"
        initialData={courseDetails?.data}
        categories={categoriesData?.data || []}
        onSubmit={handleEdit}
        isLoading={isUpdating}
      />
    </div>
  );
};

export default EditCourse;