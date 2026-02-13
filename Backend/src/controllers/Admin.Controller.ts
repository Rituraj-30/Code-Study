import { Request, Response } from "express";
import CategoryModel from "../models/Category.Model";
import NoteModels from "../models/NoteModels";
import SuccessStudentModel from "../models/SuccessStudent.Model";
import { uploadToCloudinary } from "../utils/cloudinary/imgUploader";
import UserModel from "../models/User.Model";

// Category controller fo Add and delete 

export const createCategory = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    
    const { name, description } = req.body;
    // console.log("createCategory->  is clciked by the admin")
    // console.log("name -> ", name)
    // console.log("description -> ", description)

    //  Validation
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "Name and Description are required",
      });
    }

    //  Create category
    const categoryDetails = await CategoryModel.create({
      name,
      description,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: categoryDetails,
    });
  } catch (error: any) {
    console.error("Error while creating category:", error);
    return res.status(500).json({
      success: false,
      message: "Error while creating category",
      error: error.message,
    });
  }
};


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


  

    // Success Student Controller
    
    export const addSuccessStudent = async (req: Request, res: Response) => {
        try {
            const { fullName, company, packege, role } = req.body;
            

            
            const files = req.files as any;
            const image = files?.image;
    
          
            if (!fullName || !company || !packege || !role || !image) {
                return res.status(400).json({ 
                    success: false, 
                    message: "All fields are required (including image)" 
                });
            }
    
           
            const uploadedImage = await uploadToCloudinary(image , { folder: "SuccessStudent" });
    
            if (!uploadedImage) {
                return res.status(500).json({ success: false, message: "Image upload failed" });
            }
    
           
            const newStudent = await SuccessStudentModel.create({
                fullName,
                company,
                packege,
                role,
                image: uploadedImage.secure_url
            });
    
            return res.status(201).json({ 
                success: true, 
                message: "Success Student added successfully",
                data: newStudent 
            });
    
        } catch (error: any) {
            console.error("ADD_SUCCESS_STUDENT_ERROR:", error);
            return res.status(500).json({ 
                success: false, 
                message: "Error while adding student", 
                error: error.message 
            });
        }
    };
    
    



    // Note Controller
    
    export const UploadNote = async (req: Request, res: Response) => {
      try {
        const { title, description, category, language } = req.body;
    
        const files = req.files as any;
        const thumbnailFile = files?.thumbnail; 
        const pdf = files?.pdfFile;
    
        // console.log("title -> ", title)      
        // console.log("description -> ", description)      
        // console.log("category -> ", category)      
        // console.log("language -> ", language)      
        // console.log("thumbnail -> ", thumbnailFile)      
        // console.log("pdfFile -> ", pdf)      
    
        if (!title || !category || !language || !thumbnailFile || !pdf) {
          return res.status(400).json({
            success: false,
            message: "Missing required fields: title, category, language, thumbnail, and pdf are mandatory.",
          });
        }
    
const uploadedImage = await uploadToCloudinary(thumbnailFile, { 
  folder: "Notes", 
  resource_type: "raw" 
});    
    
    const uploadedPdf = await uploadToCloudinary(pdf, { folder: "Notes" });
        if (!uploadedImage || !uploadedPdf) {
          return res.status(500).json({
            success: false,
            message: "Failed to upload files to Cloudinary.",
          });
        }
    
        const newNote = await NoteModels.create({
          title,
          description,
          category,
          language,
          thumbnail: uploadedImage.secure_url,
          fileUrl: uploadedPdf.secure_url,
        });
    
        return res.status(201).json({
          success: true,
          message: "Note uploaded successfully!",
          data: newNote,
        });
    
      } catch (error: any) {
        console.error("UPLOAD_NOTE_ERROR:", error);
        return res.status(500).json({
          success: false,
          message: "Internal server error while uploading note.",
          error: error.message,
        });
      }
    };
    




// Student Details
export const getAllStudentDetails = async (req: Request, res: Response) => {
    try {
        
        const allStudents = await UserModel.find({ accountType: "Student" })
            .populate("additionalDetails")
            .select("-password") 
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "All student details fetched successfully",
            data: allStudents,
        });
    } catch (error: any) {
        console.error("GET_ALL_STUDENTS_ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Error while fetching students",
            error: error.message,
        });
    }
};

// 2. Get All Instructor Details
export const getInstructorDetails = async (req: Request, res: Response) => {
    try {
      console.log("getInstructorDetails ->  is clciked by the admin")
        const allInstructors = await UserModel.find({ accountType: "Instructor" })
            .populate("additionalDetails")
            .select("-password")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "All instructor details fetched successfully",
            data: allInstructors,
        });
    } catch (error: any) {
        console.error("GET_ALL_INSTRUCTORS_ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Error while fetching instructors",
            error: error.message,
        });
    }
};
