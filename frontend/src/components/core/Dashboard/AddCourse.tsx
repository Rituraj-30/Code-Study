import { useCreateCourseMutation, useGetAllCategoriesQuery } from "../../../services/authApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import CourseForm from "./CourseForm";

const AddCourse = () => {
  const navigate = useNavigate();
  const { data: categoriesData } = useGetAllCategoriesQuery(undefined);
  const [createCourse, { isLoading }] = useCreateCourseMutation();

  const handleCreate = async (data: FormData) => {
    try {
      await createCourse(data).unwrap();
      toast.success("Course created successfully 🚀");
      navigate("/dashboard/my-courses");
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-[#000814] flex justify-center items-start">
      <CourseForm 
        mode="create"
        categories={categoriesData?.data || []}
        onSubmit={handleCreate}
        isLoading={isLoading}
      />
    </div>
  );
};

export default AddCourse;