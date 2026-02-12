import crypto from "crypto";
import dotenv from "dotenv";
import { Request, Response } from "express";
import mongoose from "mongoose";

import { instance } from "../config/razorpay";
import mailSender from "../utils/mailSender";
import { courseEnrollmentEmail } from "../utils/mail/courseEnrollmentEmail";
import { paymentSuccessEmail } from "../utils/mail/paymentSuccessEmail";

import UserModel from "../models/User.Model";
import CourseModel from "../models/Course.Model";
import CourseProgressModel from "../models/CourseProgress.Model";

dotenv.config();

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    accountType: "Admin" | "Instructor" | "Student";
  };
}

export const capturePayment = async (req: AuthRequest, res: Response) => {
  try {
    const { coursesId }: { coursesId: string[] } = req.body;
    const userId = req.user?.id;

    if (!coursesId || coursesId.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide Course Id" });
    }

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    let totalAmount = 0;

    for (const courseId of coursesId) {
      const course = await CourseModel.findById(courseId);

      if (!course) {
        return res
          .status(404)
          .json({ success: false, message: "Course not found" });
      }

      const isAlreadyEnrolled = course.studentsEnrolled.some(
        (id: mongoose.Types.ObjectId) => id.toString() === userId
      );

      //  console.log("isAlreadyEnrolled -> ", isAlreadyEnrolled);
      if (isAlreadyEnrolled) {
        return res.status(400).json({
          success: false,
          message: "Student is already enrolled",
        });
      }

      totalAmount += course.price ?? 0;
    }

    const order = await instance.orders.create({
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });
    
    // console.log("order -> ",order );


    return res.status(200).json({
      success: true,
      order,
    });

  } catch (error: any) {
    console.error("CAPTURE PAYMENT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyPayment = async (req: AuthRequest, res: Response) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      coursesId,
    } = req.body;

    const userId = req.user?.id;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !coursesId ||
      !userId
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Payment data missing" });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET as string)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Signature" });
    }

    await enrollStudents(coursesId, userId);

    return res.status(200).json({
      success: true,
      message: "Payment verified & enrollment successful",
    });
  } catch (error: any) {
    console.error("VERIFY PAYMENT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const enrollStudents = async (courses: string[], userId: string) => {
  for (const courseId of courses) {
    const enrolledCourse = await CourseModel.findByIdAndUpdate(
      courseId,
      { $push: { studentsEnrolled: userId } },
      { new: true }
    );

    if (!enrolledCourse) continue;

    const courseProgress = await CourseProgressModel.create({
      courseID: courseId,
      userId,
      completedVideos: [],
    });

    const enrolledStudent = await UserModel.findByIdAndUpdate(
      userId,
      {
        $push: {
          courses: courseId,
          courseProgress: courseProgress._id,
        },
      },
      { new: true }
    );

    if (!enrolledStudent) continue;

    await mailSender(
  enrolledStudent.email!,
  `Successfully Enrolled in ${enrolledCourse.courseName ?? "Your Course"}`,
  courseEnrollmentEmail({
    courseName: enrolledCourse.courseName ?? "Your Course",
    name: enrolledStudent.firstName ?? "Student",
  })
);

  }
};

export const sendPaymentSuccessEmail = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { orderId, paymentId, amount } = req.body;
    const userId = req.user?.id;

    if (!orderId || !paymentId || !amount || !userId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing payment fields" });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    await mailSender(
      user.email,
      "Payment Successful 🎉",
      paymentSuccessEmail({
        name: user.firstName ?? "Student",
        amount,
        orderId,
        paymentId,
      })
    );

    return res.status(200).json({
      success: true,
      message: "Payment success email sent",
    });
  } catch (error: any) {
    console.error("PAYMENT EMAIL ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
