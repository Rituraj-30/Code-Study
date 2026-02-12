import { authApi } from "./authApi"; // Apni main authApi file ka path yahan dalo

export const adminApi = authApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Create Category
    createCategory: builder.mutation({
      query: (data) => ({
        url: "admin/createCategory",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Categories"],
    }),

    // 2. Delete Category
    deleteCategory: builder.mutation({
      query: (categoryId) => ({
        url: "admin/deleteCategory",
        method: "DELETE",
        body: { categoryId },
      }),
      invalidatesTags: ["Categories"],
    }),

    // 3. Add Success Student (For File Uploads)
    addSuccessStudent: builder.mutation({
      query: (formData) => ({
        url: "admin/addSuccessStudent",
        method: "POST",
        body: formData,
        // RTK Query automatically sets Content-Type to multipart/form-data for FormData
      }),
    }),

    // 4. Upload Note
    uploadNote: builder.mutation({
      query: (formData) => ({
        url: "admin/uploadNote",
        method: "POST",
        body: formData,
      }),
    }),

    // 5. Get All Students
    getAllStudentsAdmin: builder.query({
      query: () => "admin/getAllStudentDetails",
      providesTags: ["AdminUsers"],
    }),

    // 6. Get All Instructors
    getAllInstructorsAdmin: builder.query({
      query: () => "admin/getInstructorDetails",
      providesTags: ["AdminUsers"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useAddSuccessStudentMutation,
  useUploadNoteMutation,
  useGetAllStudentsAdminQuery,
  useGetAllInstructorsAdminQuery,
} = adminApi;