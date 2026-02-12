

import { Router } from "express";
import router from "./user.Route";
import { authenticateUser , isStudent,isInstructor} from "../middlewares/auth.middlewares";
import { updateProfile, getProfileDetails, getEnrolledCourses, updateUserProfileImage, getInstructorCourses  ,deleteAccount} from "../controllers/Profile.Controller"
import {getLecture} from "../controllers/GetLecture"
import {updateCourseProgress} from "../controllers/CourseProgress.Controller"




router.get('/getUserDetails', authenticateUser, getProfileDetails);

router.get('/getEnrolledCourses', authenticateUser,isStudent,getEnrolledCourses);
router.get('/getLecture/:courseId', authenticateUser, isStudent, getLecture);


router.delete('/deleteProfile', authenticateUser, deleteAccount);


// update profile image
router.put('/updateProfile', authenticateUser, updateProfile);
router.put('/updateUserProfileImage', authenticateUser, updateUserProfileImage);

router.put('/getInstructorCourses', authenticateUser,isInstructor ,getInstructorCourses);
router.post("/updateCourseProgress", authenticateUser, isStudent, updateCourseProgress);



export default router;