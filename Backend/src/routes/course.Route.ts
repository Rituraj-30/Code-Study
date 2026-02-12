
import { Router } from "express";
import router from "./user.Route";
import { createCourse ,editCourse, getFullCourseDetails , deleteCourse} from "../controllers/Course.Controller";
import {  getAllCategories} from "../controllers/Category.Controller";
import { createSection, updateSection, deleteSection } from "../controllers/Section.Controller";
import { createSubSection, updateSubSection, deleteSubSection } from "../controllers/SubSection.Controller";
import {createRatingAndReview  , getAllRatingReview } from "../controllers/RatingAndReview.Controller";
// middleware
import { authenticateUser , isStudent,isAdmin,isInstructor} from "../middlewares/auth.middlewares";
import UserModel from "../models/User.Model";
import CourseModel from "../models/Course.Model";
import {getAllSuccessStudents} from"../controllers/SuccessStudent.Contoller"

// create course



router.post('/createCourse',authenticateUser,isInstructor, createCourse);

router.post("/editCourse", authenticateUser, isInstructor , editCourse)



router.post("/getFullCourseDetails",authenticateUser ,getFullCourseDetails)

router.get("/getAllCategories", getAllCategories)


router.delete("/deleteCourse", authenticateUser, isInstructor, deleteCourse)




//Add a Section to a Course
router.post('/createSection', authenticateUser, isInstructor, createSection);
// Update a Section
router.post('/updateSection', authenticateUser, isInstructor, updateSection);
// Delete a Section
router.post('/deleteSection', authenticateUser, isInstructor, deleteSection);

// Add a Sub Section to a Section
router.post('/createSubSection', authenticateUser, isInstructor, createSubSection);
// Edit Sub Section
router.post('/updateSubSection', authenticateUser, isInstructor, updateSubSection);
// Delete Sub Section
router.post('/deleteSubSection', authenticateUser, isInstructor, deleteSubSection);




router.get('/getAllSuccessStudents', getAllSuccessStudents);

// rating and review
router.post('/createRating', authenticateUser, isStudent,createRatingAndReview);
// router.get('/getAverageRating', getAverageRating);
// router.delete('/deleteRating:id',authenticateUser, isStudent,deleteRatingAndReview);

router.get('/getReviews', getAllRatingReview);





export default router;