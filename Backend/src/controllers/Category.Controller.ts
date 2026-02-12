import { Request, Response } from "express";
import CategoryModel from "../models/Category.Model";




export const  deleteCategory = async ( 
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { categoryId } = req.body;

        const deletedCategory = await CategoryModel.findByIdAndDelete(categoryId);

        if (!deletedCategory) {
          return res.status(404).json({
            success: false,
            message: "Category not found",
          });
        }

        return res.status(200).json({
          success: true,
          message: "Category deleted successfully",
        });

      } catch (error: any) {
        console.error("Error while deleting category:", error);
        return res.status(500).json({
          success: false,
          message: "Error while deleting category",
          error: error.message,
        });
      }
    };
    
    
    
export const getAllCategories = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {

    const categories = await CategoryModel.find({})
      .populate({
        path: "courses",
        match: { status: "Published" }, 
        select:
          "courseName courseDescription price thumbnail instructor ratingAndReviews status studentsEnrolled", 
        populate: {
          path: "instructor",
          select: "firstName lastName email image",
        },
      })
      .exec();
      // console.log("categories -> ", categories)

    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: categories,
    });

  } catch (error: any) {
    console.error("Error while fetching categories:", error);
    return res.status(500).json({
      success: false,
      message: "Error while fetching categories",
      error: error.message,
    });
  }
};
