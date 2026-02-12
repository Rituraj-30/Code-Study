import { Request, Response } from "express";
import mongoose from "mongoose";
import Course from "../models/Course.Model";
import CourseProgress from "../models/CourseProgress.Model";

export const getLecture = async (req: any, res: Response) => {
  try {
    const { courseId } = req.params;
    const userId = req.user?.id;

    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ success: false, message: "Invalid Course ID" });
    }

    //  Course details fetch karo 
    const courseDetails = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .populate("instructor")
      .exec();
    //   console.log("Course Details:", courseDetails)

    if (!courseDetails) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // . User ki progress fetch karo is course ke liye
    const courseProgressCount = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    });

    // console.log("Course Progress Loaded:", courseProgressCount);

    // Response mein dono cheezein bhejo
    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        completedVideos: courseProgressCount?.completedVideos || [],
      },
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};