import { Router } from "express";
import router from "./user.Route";

import {
  createCategory,
  deleteCategory,
  addSuccessStudent,
  UploadNote,
  getAllStudentDetails,
  getInstructorDetails,
} from "../controllers/Admin.Controller";

// middleware
import { authenticateUser, isAdmin } from "../middlewares/auth.middlewares";
// create course

router.post("/createCategory", authenticateUser, isAdmin, createCategory);

router.get(
  "/getAllStudentDetails",
  authenticateUser,
  isAdmin,
  getAllStudentDetails,
);

router.get(
  "/getInstructorDetails",
  authenticateUser,
  isAdmin,
  getInstructorDetails,
);

router.delete("/deleteCategory", authenticateUser, isAdmin, deleteCategory);

// category routes
router.post("/addSuccessStudent", authenticateUser, isAdmin, addSuccessStudent);

router.post("/uploadNote", authenticateUser, isAdmin, UploadNote);

export default router;
