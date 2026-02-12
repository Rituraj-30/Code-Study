import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import UserModel from "../models/User.Model";
import dotenv from "dotenv";

dotenv.config();


interface CustomJwtPayload extends JwtPayload {
  id: string;
  email: string;
  accountType: "Admin" | "Student" | "Instructor";
}

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    // Check all possible places for token
    const token = 
      req.cookies?.token || 
      req.body?.token || 
      req.headers.authorization?.replace("Bearer ", "");

    // console.log("problrm cheak hori he...: Received Token ->", token); // Debugging ke liye

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token missing",
      });
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as CustomJwtPayload;
      
      req.user = decoded; 
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const isAdmin = (
    req: Request,
    res: Response,
    next: NextFunction
): Response | void => {
  if (req.user?.accountType !== "Admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    });
  }
  next();
};

export const isInstructor = (
    req: Request,
    res: Response,
    next: NextFunction
): Response | void => {
    if (req.user?.accountType !== "Instructor") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Instructor privileges required.",
        });
    }
    next();
};
export const isStudent = (
    req: Request,
    res: Response,
    next: NextFunction
    ): Response | void => {
    if (req.user?.accountType !== "Student") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Student privileges required.",
        });
    }
    next();
};

