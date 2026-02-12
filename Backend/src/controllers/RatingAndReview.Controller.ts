import { Request, Response } from "express";
import RatingAndReviewModel from "../models/RatingAndReview.Model";
import CourseModel from "../models/Course.Model";
import mongoose from "mongoose";
// ================= CREATE RATING & REVIEW =================
export const createRatingAndReview = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { rating, review, courseId } = req.body;
    const userId = req.user?.id;

    if (!rating || !review || !courseId || !userId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    // IDs convert in mongose id  '''' yha error aaaya tha  couse ke andr userid fine nhi huii thi  ''''
    const cid = new mongoose.Types.ObjectId(courseId);
    const uid = new mongoose.Types.ObjectId(userId);

    const courseDetails = await CourseModel.findById(cid);

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const isEnrolled = courseDetails.studentsEnrolled.some(
      (id) => id.toString() === uid.toString(),
    );

    if (!isEnrolled) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }

    // console.log("isEnrolled -> ", isEnrolled);

    // check already reviewed
    const alreadyReviewed = await RatingAndReviewModel.findOne({
      course: courseId,
      user: userId,
    });

    if (alreadyReviewed) {
      return res.status(403).json({
        success: false,
        message: "You have already reviewed this course",
      });
    }

    // create review
    const ratingReview = await RatingAndReviewModel.create({
      user: userId,
      course: courseId,
      rating,
      review,
    });

    await CourseModel.findByIdAndUpdate(courseId, {
      $push: { ratingAndReviews: ratingReview._id },
    });

    return res.status(201).json({
      success: true,
      message: "Rating and review created successfully",
      data: ratingReview,
    });
  } catch (error: any) {
    console.error("Create rating error:", error);
    return res.status(500).json({
      success: false,
      message: "Error while creating rating and review",
      error: error.message,
    });
  }
};

// export const deleteRatingAndReview = async (
//   req: Request,
//   res: Response,
// ): Promise<Response> => {
//   try {
//     const { ratingId } = req.params;
//     const userId = req.user?.id;

//     // console.log("ratingId -> ", ratingId);
//     // console.log("userId -> ", userId);
    
//     if (!ratingId || !userId) {
//       return res.status(400).json({
//         success: false,
//         message: "Rating ID is required",
//       });
//     }

//     const rating = await RatingAndReviewModel.findById(ratingId);

//     if (!rating) {
//       return res.status(404).json({
//         success: false,
//         message: "Rating not found",
//       });
//     }

//     if (rating.user.toString() !== userId.toString()) {
//       return res.status(403).json({
//         success: false,
//         message: "You are not allowed to delete this review",
//       });
//     }

//     // course se rating reference remove
//     await CourseModel.findByIdAndUpdate(rating.course, {
//       $pull: { ratingAndReviews: ratingId },
//     });

//     // delete rating
//     await RatingAndReviewModel.findByIdAndDelete(ratingId);

//     return res.status(200).json({
//       success: true,
//       message: "Rating and review deleted successfully",
//     });
//   } catch (error: any) {
//     console.error("Delete rating error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Error while deleting rating and review",
//       error: error.message,
//     });
//   }
// };


export const getAllRatingReview = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const allReviews = await RatingAndReviewModel.find({})
      .sort({ rating: -1 })
      .populate({
        path: "user",
        select: "firstName lastName email image",
      })
      .populate({
        path: "course",
        select: "courseName",
      });

    return res.status(200).json({
      success: true,
      message: "All reviews fetched successfully",
      data: allReviews,
    });
  } catch (error: any) {
    console.error("Fetch reviews error:", error);
    return res.status(500).json({
      success: false,
      message: "Error while fetching reviews",
      error: error.message,
    });
  }
};

