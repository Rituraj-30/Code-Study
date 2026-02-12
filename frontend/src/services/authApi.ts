import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_APP_BASE_URL,

    prepareHeaders: (headers) => {
  const token = localStorage.getItem("token");
  if (token) {
    // Agar quotes ke saath save hai toh parse karo, warna direct bhej do
    const cleanToken = token.startsWith('"') ? JSON.parse(token) : token;
    headers.set("authorization", `Bearer ${cleanToken}`);
  }
  return headers;
},
  }),
  // "CourseProgress" tag add kiya hai auto-refresh ke liye
  tagTypes: ["Courses", "Categories", "CourseProgress"],

  endpoints: (builder) => ({
    // ===== AUTH =====
    sendOtp: builder.mutation({
      query: (email) => ({
        url: "sendotp",
        method: "POST",
        body: { email },
      }),
    }),

    signup: builder.mutation({
      query: (data) => ({
        url: "signup",
        method: "POST",
        body: data,
      }),
    }),

    login: builder.mutation({
      query: (credentials) => ({
        url: "login",
        method: "POST",
        body: credentials,
      }),
    }),
    updatePassword: builder.mutation({
      query: (data) => ({
        url: "updatePassword",
        method: "POST",
        body: data,
      }),
    }),

    contactUs: builder.mutation({
      query: (contactData) => ({
        url: "contact",
        method: "POST",
        body: contactData,
      }),
    }),

    // ===== COURSE CREATION & EDITING =====
    createCourse: builder.mutation({
      query: (formData) => ({
        url: "createCourse",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Courses"],
    }),

    editCourse: builder.mutation({
      query: (formData) => ({
        url: "editCourse",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Courses"],
    }),

    // ===== DATA =====
    getAllCategories: builder.query({
      query: () => "getAllCategories",
      providesTags: ["Categories"],
    }),

    getAllCourses: builder.query({
      query: () => "getAllCourses",
      providesTags: ["Courses"],
    }),

    getCourseDetails: builder.query({
      query: (courseId) => ({
        url: "getFullCourseDetails",
        method: "POST",
        body: { courseId },
      }),
      providesTags: ["Courses"],
    }),

    // ===== LECTURE & PROGRESS (NEW) =====
    // Isse saare sections, lectures aur user ki progress milegi
    getLecture: builder.query({
      query: (courseId) => ({
        url: `getLecture/${courseId}`,
        method: "GET",
      }),
      providesTags: ["CourseProgress"],
    }),

    // Video complete hone par ye hit hoga
    updateCourseProgress: builder.mutation({
      query: (data) => ({
        url: "updateCourseProgress",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["CourseProgress"],
    }),

    // ===== REVIEWS =====
    getAllReviews: builder.query({
      query: () => ({
        url: "getReviews",
        method: "GET",
      }),
    }),

    // ===== INSTRUCTOR =====
    getInstructorCourses: builder.mutation({
      query: () => ({
        url: "getInstructorCourses",
        method: "PUT",
      }),
      invalidatesTags: ["Courses"],
    }),

    // ===== STUDENT ENROLLED COURSES =====
    getEnrolledCourses: builder.query({
      query: () => ({
        url: "getEnrolledCourses",
        method: "GET",
      }),
      providesTags: ["Courses"],
    }),

    // ===== RATINGS & REVIEWS =====
    createRating: builder.mutation({
      query: (ratingData) => ({
        url: "createRating",
        method: "POST",
        body: ratingData,
      }),
      invalidatesTags: ["Courses"],
    }),

    deleteRating: builder.mutation<any, string>({
      query: (ratingId) => ({
        url: `deleteRatingAndReview/${ratingId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Courses"],
    }),
  deleteCourse: builder.mutation<any, { courseId: string }>({
  query: (body) => ({
    url: "/deleteCourse", 
    method: "DELETE",
    body,
  }),
}),

startLiveClass: builder.mutation({
    query: (data) => ({
        url: "/liveClass/start",
        method: "POST",
        body: data,
    }),
}),
endLiveClass: builder.mutation({
      query: (data) => ({
        url: "/liveClass/end", // Backend ka endpoint
        method: "POST",
        body: data, // Isme roomId jayega
      }),
      // Isse cache clear ho jayega aur dashboard refresh ho jayega
      invalidatesTags: ["Courses"], 
    }),

joinLiveClass: builder.mutation({
    query: (data) => ({
        url: "/liveClass/join", // Check kar lena backend pe yahi route hai ya /live/join
        method: "POST",
        body: data,
    }),
}),

    
  }),
});

export const {
  useSendOtpMutation,
  useSignupMutation,
  useLoginMutation,
  useContactUsMutation,
  useCreateCourseMutation,
  useEditCourseMutation,
  useGetAllCategoriesQuery,
  useGetAllCoursesQuery,
  useGetCourseDetailsQuery,
  useGetLectureQuery, // Exported
  useUpdateCourseProgressMutation, // Exported
  useGetAllReviewsQuery,
  useGetInstructorCoursesMutation,
  useGetEnrolledCoursesQuery,
  useCreateRatingMutation,
  useUpdatePasswordMutation,
  useDeleteRatingMutation,
  useDeleteCourseMutation,
  useStartLiveClassMutation,
  useJoinLiveClassMutation,
  useEndLiveClassMutation,
} = authApi;
