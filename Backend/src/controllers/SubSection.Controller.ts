import { Response } from "express";
import SectionModel from "../models/Section.Model";
import SubSectionModel from "../models/SubSection.Model";
import CourseModel from "../models/Course.Model"; // Added this
import { uploadToCloudinary } from "../utils/cloudinary/imgUploader";

export const createSubSection = async (req: any, res: Response): Promise<Response> => {
  try {
    const { title, description, sectionId, courseId } = req.body; // Added courseId
    const videoFile = req.files?.video;

    if (!title || !description || !videoFile || !sectionId || !courseId) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const uploadDetails = await uploadToCloudinary(videoFile ,{ folder: "SubSection-video" });

    const subSection = await SubSectionModel.create({
      title,
      description,
      videoUrl: uploadDetails.secure_url,
      timeDuration: `${(uploadDetails as any).duration}`,
    });

    // Push into Section
    await SectionModel.findByIdAndUpdate(
      sectionId,
      { $push: { subSection: subSection._id } },
      { new: true }
    );

    const updatedCourse = await CourseModel.findById(courseId)
      .populate({
        path: "courseContent",
        populate: { path: "subSection" },
      })
      .exec();

    return res.status(200).json({
      success: true,
      data: updatedCourse,
      message: "SubSection created successfully",
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Error while creating SubSection", error: error.message });
  }
};

//  UPDATE SUBSECTION 
export const updateSubSection = async (
  req: any,
  res: Response
): Promise<Response> => {
  try {
    const { sectionId, subSectionId, title, description } = req.body;

    if (!subSectionId || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "subSectionId and sectionId are required",
      });
    }
    

    const subSection = await SubSectionModel.findById(subSectionId);

    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    if (title) subSection.title = title;
    if (description) subSection.description = description;

    // video update
    if (req.files?.videoFile) {
      const uploadDetails = await uploadToCloudinary( req.files.videoFile  ,{ folder: "SubSection-video" });
      subSection.videoUrl = uploadDetails.secure_url;
      subSection.timeDuration = `${(uploadDetails as any).duration}`;
    }

    await subSection.save();

    const updatedSection = await SectionModel.findById(sectionId).populate(
      "subSection"
    );

    return res.status(200).json({
      success: true,
      data: updatedSection,
      message: "SubSection updated successfully",
    });
  } catch (error: any) {
    console.error("Error while updating SubSection:", error);
    return res.status(500).json({
      success: false,
      message: "Error while updating SubSection",
      error: error.message,
    });
  }
};

//  DELETE SUBSECTION 
export const deleteSubSection = async (
  req: any,
  res: Response
): Promise<Response> => {
  try {
    const { subSectionId, sectionId } = req.body;

    if (!subSectionId || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "subSectionId and sectionId are required",
      });
    }

    // Remove reference from section
    await SectionModel.findByIdAndUpdate(sectionId, {
      $pull: { subSection: subSectionId },
    });

    // Delete subsection
    const deletedSubSection = await SubSectionModel.findByIdAndDelete(
      subSectionId
    );

    if (!deletedSubSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    const updatedSection = await SectionModel.findById(sectionId).populate(
      "subSection"
    );

    return res.status(200).json({
      success: true,
      data: updatedSection,
      message: "SubSection deleted successfully",
    });
  } catch (error: any) {
    console.error("Error while deleting SubSection:", error);
    return res.status(500).json({
      success: false,
      message: "Error while deleting SubSection",
      error: error.message,
    });
  }
};
