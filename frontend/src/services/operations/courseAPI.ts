import { axiosInstance } from "../axiosInstance";
import { courseEndpoints } from "../apis";

// ================= CREATE SECTION =================
export const createSection = async (data: {
  sectionName: string;
  courseId: string;
}) => {
  const res = await axiosInstance.post(
    courseEndpoints.CREATE_SECTION,
    data
  );
  return res.data;
};

// ================= UPDATE SECTION =================
export const updateSection = async (data: {
  sectionId: string;
  sectionName: string;
  courseId: string;
}) => {
  const res = await axiosInstance.post(
    courseEndpoints.UPDATE_SECTION,
    data
  );
  return res.data;
};

// ================= DELETE SECTION =================
export const deleteSection = async (data: {
  sectionId: string;
  courseId: string;
}) => {
  const res = await axiosInstance.post(
    courseEndpoints.DELETE_SECTION,
    data
  );
  return res.data;
};

// ================= CREATE SUB SECTION =================
export const createSubSection = async (formData: FormData) => {
  const res = await axiosInstance.post(
    courseEndpoints.CREATE_SUBSECTION,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return res.data;
};

// ================= UPDATE SUB SECTION =================
export const updateSubSection = async (formData: FormData) => {
  const res = await axiosInstance.post(
    courseEndpoints.UPDATE_SUBSECTION,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return res.data;
};

// ================= DELETE SUB SECTION =================
export const deleteSubSection = async (data: {
  subSectionId: string;
  sectionId: string;
  courseId: string;
}) => {
  const res = await axiosInstance.post(
    courseEndpoints.DELETE_SUBSECTION,
    data
  );
  return res.data;
};
