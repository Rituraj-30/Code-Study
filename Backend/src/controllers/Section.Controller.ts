import { Request, Response } from "express";
import CourseModel from "../models/Course.Model";
import SectionModel from "../models/Section.Model";


export const createSection = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { sectionName, courseId } = req.body;

    // console.log("sectionName -> ", sectionName )
    // console.log("courseId -> ", courseId )

    
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    
    const newSection = await SectionModel.create({ sectionName });

    await CourseModel.findByIdAndUpdate(courseId, {
      $push: { courseContent: newSection._id },
    });

    const updatedCourseDetails = await CourseModel.findById(courseId)
      .populate({
        path: "courseContent",
        populate: { path: "subSection" },
      })
      .exec();

    return res.status(200).json({
      success: true,
      data: updatedCourseDetails,
      message: "Section created successfully",
    });
  } catch (error: any) {
    console.error("Error while creating section:", error);
    return res.status(500).json({
      success: false,
      message: "Error while creating section",
      error: error.message,
    });
  }
};

// UPDATE SECTION 
export const updateSection = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { sectionId, sectionName, courseId } = req.body;

    if (!sectionId || !sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    await SectionModel.findByIdAndUpdate(sectionId, { sectionName });

    const updatedCourseDetails = await CourseModel.findById(courseId)
      .populate({
        path: "courseContent",
        populate: { path: "subSection" },
      })
      .exec();

    return res.status(200).json({
      success: true,
      data: updatedCourseDetails,
      message: "Section updated successfully",
    });
  } catch (error: any) {
    console.error("Error while updating section:", error);
    return res.status(500).json({
      success: false,
      message: "Error while updating section",
      error: error.message,
    });
  }
};

export const deleteSection = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { sectionId, courseId } = req.body;

    if (!sectionId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "SectionId and CourseId are required",
      });
    }

    await SectionModel.findByIdAndDelete(sectionId);

    await CourseModel.findByIdAndUpdate(courseId, {
      $pull: { courseContent: sectionId },
    });

    const updatedCourseDetails = await CourseModel.findById(courseId)
      .populate({
        path: "courseContent",
        populate: { path: "subSection" },
      })
      .exec();

    return res.status(200).json({
      success: true,
      data: updatedCourseDetails,
      message: "Section deleted successfully",
    });
  } catch (error: any) {
    console.error("Error while deleting section:", error);
    return res.status(500).json({
      success: false,
      message: "Error while deleting section",
      error: error.message,
    });
  }
};
