import { Request, Response } from "express";
import SubSection from "../models/SubSection.Model"; // Name dhyan se check kar lena
import CourseProgress from "../models/CourseProgress.Model";
import mongoose from "mongoose";

// Interface for Auth Request
interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    accountType: "Admin" | "Instructor" | "Student";
  };
}

export const updateCourseProgress = async (req: AuthRequest, res: Response) => {
  const { courseId, subsectionId } = req.body;
  const userId = req.user?.id;

  try {
    const subsection = await SubSection.findById(subsectionId);
    if (!subsection) {
      return res.status(404).json({ success: false, error: "Invalid subsection" });
    }

    let courseProgress = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    });

    if (!courseProgress) {
      courseProgress = await CourseProgress.create({
        userId: userId,
        courseID: courseId,
        completedVideos: [subsectionId],
      });
      
      return res.status(200).json({ 
        success: true, 
        message: "Course progress initialized and updated" 
      });
    }

    if (courseProgress.completedVideos.includes(subsectionId as any)) {
      return res.status(400).json({ 
        success: false, 
        error: "Subsection already completed" 
      });
    }

    // 4. Add video to list
    courseProgress.completedVideos.push(subsectionId as any);
    await courseProgress.save();

    return res.status(200).json({ 
      success: true, 
      message: "Course progress updated" 
    });

  } catch (error: any) {
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const getProgressPercentage = async (req: AuthRequest, res: Response) => {
  const { courseId } = req.body; 
  const userId = req.user?.id;

  if (!courseId) {
    return res.status(400).json({ 
      success: false,
      error: "Course ID not provided." 
    });
  }

  try {
    let courseProgress: any = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    })
      .populate({
        path: "courseID",
        populate: {
          path: "courseContent",
        },
      })
      .exec();

    if (!courseProgress) {
      return res.status(400).json({ 
        success: false,
        error: "Cannot find Course Progress with these IDs." 
      });
    }

    let totalLectures = 0;
    courseProgress.courseID.courseContent?.forEach((sec: any) => {
      totalLectures += sec.subSection?.length || 0;
    });

    let progressPercentage = 0;
    if (totalLectures !== 0) {
       progressPercentage = (courseProgress.completedVideos.length / totalLectures) * 100;
       
       const multiplier = Math.pow(10, 2);
       progressPercentage = Math.round(progressPercentage * multiplier) / multiplier;
    } else {
       progressPercentage = 0;
    }

    return res.status(200).json({
      success: true,
      data: progressPercentage,
      message: "Successfully fetched Course progress",
    });

  } catch (error: any) {
    console.error("Error in getProgressPercentage:", error);
    return res.status(500).json({ 
      success: false,
      error: "Internal server error" 
    });
  }
};


