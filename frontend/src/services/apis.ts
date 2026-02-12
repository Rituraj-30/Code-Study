const BASE_URL = "http://localhost:5000/api/v1";

// PROFILE ENDPOINTS
export const profileEndpoints = {
  GET_USER_DETAILS_API: BASE_URL + "/profile/getUserDetails",
  GET_USER_ENROLLED_COURSES_API: BASE_URL + "/profile/getEnrolledCourses",
  // DELETE_PROFILE_API: BASE_URL + "/profile/deleteProfile",
};

// SETTINGS ENDPOINTS
export const settingsEndpoints = {
  UPDATE_DISPLAY_PICTURE_API: BASE_URL + "/profile/updateUserProfileImage",
  UPDATE_PROFILE_API: BASE_URL + "/profile/updateProfile",
  DELETE_PROFILE_API: BASE_URL + "/profile/deleteProfile", 
};

// COURSE ENDPOINTS
export const courseEndpoints = {
  CREATE_SECTION: BASE_URL + "/auth/course/createSection",
  UPDATE_SECTION: BASE_URL + "/auth/course/updateSection",
  DELETE_SECTION: BASE_URL + "/auth/course/deleteSection",

  CREATE_SUBSECTION: BASE_URL + "/auth/course/createSubSection",
  UPDATE_SUBSECTION: BASE_URL + "/auth/course/updateSubSection",
  DELETE_SUBSECTION: BASE_URL + "/auth/course/deleteSubSection",
};

// STUDENT (PAYMENT) ENDPOINTS
export const studentEndpoints = {
  COURSE_PAYMENT_API: BASE_URL + "/auth/payment/capturePayment",
  COURSE_VERIFY_API: BASE_URL + "/auth/payment/verifyPayment",
  SEND_PAYMENT_SUCCESS_EMAIL_API: BASE_URL + "/auth/payment/sendPaymentSuccessEmail",
};