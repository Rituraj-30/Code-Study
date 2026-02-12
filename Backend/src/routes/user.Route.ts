import { Router } from "express";
import {getAllSuccessStudents} from "../controllers/SuccessStudent.Contoller"


import { register, login, sendOTP ,updatePassword } from "../controllers/Auth.Controller";
import {contactUsController} from "../controllers/ContactController"
import {GetAllNotes } from "../controllers/Notes.Controller"
// middleware
import { authenticateUser } from "../middlewares/auth.middlewares";

const router = Router();

// Route for user signup
router.post("/signup", register);

// Route for user login
router.post("/login", login);

router.post('/sendotp', sendOTP);

// yha auth add krna he 
router.post('/updatePassword', authenticateUser,updatePassword);


router.post("/contact", contactUsController);


router.get("/getAllNotes" , GetAllNotes);



router.get('/getAllSuccessStudents', getAllSuccessStudents);



export default router;
