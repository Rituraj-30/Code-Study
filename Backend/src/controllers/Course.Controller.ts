import { Request, Response } from "express";
import CourseModel from "../models/Course.Model";
import UserModel from "../models/User.Model";
import CategoryModel from "../models/Category.Model";
import { uploadToCloudinary ,deleteResourceFromCloudinary} from "../utils/cloudinary/imgUploader";
import SectionModel from "../models/Section.Model";
import SubSectionModel from "../models/SubSection.Model";

interface CustomRequest extends Request {
  user?: {
    id: string;
    email: string;
    accountType: "Admin" | "Instructor" | "Student";
  };
  files?: any;
}

const toArray = (value: string | string[]) => {
  if (Array.isArray(value)) return value;

  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
};

export const createCourse = async (
  req: CustomRequest,
  res: Response,
): Promise<Response> => {
  try {
    let {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tag,
      category,
      instructions,
    } = req.body;

    const thumbnail = req.files?.thumbnailImage;

    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !thumbnail ||
      !tag ||
      !category ||
      !instructions
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required, including thumbnail",
      });
    }
    let status;
    if (!status) status = "Draft";

    const learningsArray = toArray(whatYouWillLearn);
    const instructionsArray = toArray(instructions);
    const tagsArray = toArray(tag);

    const categoryDetails = await CategoryModel.findById(category);
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const instructorId = req.user?.id;
    if (!instructorId) {
      return res.status(401).json({
        success: false,
        message: "Instructor details not found in request",
      });
    }

    const thumbnailDetails = await uploadToCloudinary(thumbnail, {
      folder: "Course",
    });

    const newCourse = await CourseModel.create({
      courseName,
      courseDescription,
      instructor: instructorId,
      whatYouWillLearn: learningsArray,
      price: Number(price),
      tag: tagsArray,
      category: categoryDetails._id,
      thumbnail: thumbnailDetails.secure_url,
      instructions: instructionsArray,
      status,
    });

    await Promise.all([
      UserModel.findByIdAndUpdate(
        instructorId,
        { $push: { courses: newCourse._id } },
        { new: true },
      ),
      CategoryModel.findByIdAndUpdate(
        categoryDetails._id,
        { $push: { courses: newCourse._id } },
        { new: true },
      ),
    ]);

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (error: any) {
    console.error("Error while creating course:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const editCourse = async (
  req: any,
  res: Response,
): Promise<Response> => {
  try {
    const { courseId } = req.body;
    const updates = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Sirf wahi fields nikalo jo update karni hain
    const updateData: any = {};

    // const status = await CourseModel.findById(courseId )
    // console.log(status)

    for (const key in updates) {
      if (updates[key] !== undefined && key !== "courseId") {
        if (key === "tag" || key === "instructions") {
          try {
            updateData[key] = JSON.parse(updates[key]);
            // console.log("if - try- ", updateData[key])
          } catch (e) {
            updateData[key] = updates[key];
            // console.log("if - catch- ", updateData[key])
          }
        } else {
          updateData[key] = updates[key];
          // console.log("Else - try- ", updateData[key])
        }
      }
    }

    // image ko uploe kiya agr change huii to 
    if (req.files && req.files.thumbnailImage) {
      const thumbnail = req.files.thumbnailImage;
      const uploadedThumbnail = await uploadToCloudinary(
        thumbnail.tempFilePath,
        { folder: "Course" },
      );
      updateData.thumbnail = uploadedThumbnail.secure_url;
    }

    // console.log("updateData-> ",updateData)

    // Isse sirf wahi badlega jo 'updateData' mein hai
    const updatedCourse = await CourseModel.findByIdAndUpdate(
      courseId,
      { $set: updateData },
      { new: true }, 
    )
      .populate("instructor")
      .populate("category")
      .lean();

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error: any) {
    console.error("Edit course error:", error);
    return res.status(500).json({
      success: false,
      message: "Error while updating course",
      error: error.message,
    });
  }
};

export const getFullCourseDetails = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const courseId =
      req.body.courseId || req.params.courseId || req.query.courseId;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    const courseDetails = await CourseModel.findById(courseId)
      .select(
        "courseName courseDescription whatYouWillLearn ratingAndReviews thumbnail price instructor category studentsEnrolled instructions",
      )
      .populate({
        path: "instructor",
        select: "firstName lastName image",
      })
      .populate({
        path: "category",
        select: "name",
      })
      .populate({
        path: "ratingAndReviews",
        select: "rating review user",
        populate: {
          path: "user",
          select: "firstName lastName image",
        },
      })
      .exec();

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      });
    }

    /* RESPONSE OPTIMIZATION */

    const formattedCourseDetails = {
      _id: courseDetails._id,
      courseName: courseDetails.courseName,
      courseDescription: courseDetails.courseDescription,
      whatYouWillLearn: courseDetails.whatYouWillLearn,
      instructions: courseDetails.instructions,
      thumbnail: courseDetails.thumbnail,
      price: courseDetails.price,

      category: courseDetails.category,
      instructor: courseDetails.instructor,

      ratingAndReviews: courseDetails.ratingAndReviews,
      studentsEnrolled: courseDetails.studentsEnrolled || 0,
    };

    // console.log("Optimized CourseDetails ->", formattedCourseDetails);

    return res.status(200).json({
      success: true,
      data: {
        courseDetails: formattedCourseDetails,
      },
    });
  } catch (error: any) {
    console.error("Error in getFullCourseDetails:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const deleteCourse = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { courseId } = req.body;
    if (!courseId)
      return res
        .status(400)
        .json({ success: false, message: "Course ID required" });

    const course = await CourseModel.findById(courseId);
    if (!course)
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });

    for (const studentId of course.studentsEnrolled) {
      await UserModel.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      });
    }

    for (const sectionId of course.courseContent) {
      const section = await SectionModel.findById(sectionId);
      if (section) {
        for (const subSectionId of section.subSection) {
          const subSection = await SubSectionModel.findById(subSectionId);

          if (subSection?.videoUrl) {
            await deleteResourceFromCloudinary(subSection.videoUrl, "video");
          }
          await SubSectionModel.findByIdAndDelete(subSectionId);
        }
      }
      await SectionModel.findByIdAndDelete(sectionId);
    }

    if (course.thumbnail) {
      await deleteResourceFromCloudinary(course.thumbnail, "image");
    }

    //. Delete course from DB
    await CourseModel.findByIdAndDelete(courseId);

    return res.status(200).json({
      success: true,
      message: "Course and all related resources deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
