import { Request, Response } from "express";
import SuccessStudentModel from "../models/SuccessStudent.Model";
import { uploadToCloudinary } from "../utils/cloudinary/imgUploader";



export const getAllSuccessStudents = async (req: Request, res: Response) => {
    try {
        
        const allStudents = await SuccessStudentModel.find().sort({ createdAt: -1 });
        
        return res.status(200).json({ 
            success: true, 
            count: allStudents.length,
            data: allStudents 
        });

    } catch (error: any) {
        console.error("GET_ALL_STUDENTS_ERROR:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Error while fetching students", 
            error: error.message 
        });
    }
};