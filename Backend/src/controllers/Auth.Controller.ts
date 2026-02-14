import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.Model";
import Profile from "../models/Profile.Model";
import jwt from "jsonwebtoken";
import mailSender from "../utils/mailSender"
import optGenerator from'otp-generator'
import OTP from"../models/OTP.Model"
import { otpEmailTemplate } from "../utils/mail/OTPemail";
import { passwordUpdated } from "../utils/mail/UpdatePassword";


 export interface RegisterBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  otp: string;
  accountType: "Admin" | "Student" | "Instructor";
}

export const register = async (
  req: Request<{}, {}, RegisterBody>,
  res: Response
): Promise<Response> => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      otp,
      accountType,
    } = req.body;

    //  Validation
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp ||
      !accountType
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //  Password check
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    //  User already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    console.log("Verifying OTP for email:", email, "with OTP:", otp);
    //  Get latest OTP

    const recentOtp = await OTP.findOne({ email });
    // console.log("Recent OTP found:", recentOtp)

    if (!recentOtp) {
      return res.status(400).json({
        success: false,
        message: "OTP not found, please request again",
      });
    }

    //  OTP expiry check
    if (recentOtp.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    //  OTP match
    if (otp !== recentOtp.otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    //  Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //  Create profile
    const profile = await Profile.create({});

    // Approval logic
    const approved = accountType === "Instructor" ? false : true;

    //  Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType,
      approved,
      additionalDetails: profile._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    //  OTP delete after success and registered successfully
    await OTP.deleteMany({ email });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error: any) {
    console.error("Register Error:", error);
    return res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};


export interface SendOtpBody {
  email: string;
}
export const sendOTP = async (
  req: Request<{}, {}, SendOtpBody>,
  res: Response
): Promise<Response> => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already registered",
      });
    }

    // Generate OTP
    const otp = optGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    console.log("Generated OTP:", otp);
    
    // Delete old OTPs
    await OTP.deleteMany({ email });

    // Save new OTP
     const newOtp = await OTP.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min
    });

    // console.log("Saved OTP:", newOtp);
    const name = email.split('@')[0].split('.').map(part => part.replace(/\d+/g, '')).join(' ');
    // console.log(name);

    const mail = await mailSender(
  email,                       
  "OTP Verification",         
  otpEmailTemplate({ name, otp })
);
   console.log("mail ->",mail)

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error: any) {
    console.error("Send OTP Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: error.message,
    });
  }
};


export interface LoginBody {
  email: string;
  password: string;
  MAX_LOGIN_ATTEMPTS: number;
  LOCK_TIME: number;
}


export const login = async (
  req: Request<{}, {}, LoginBody>,
  res: Response
): Promise<Response> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });
    }

    const userDoc = await User.findOne({ email });
    if (!userDoc) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // check if account is locked
    if (userDoc.lockUntil && userDoc.lockUntil > new Date()) {
      const remainingTime =Math.ceil((userDoc.lockUntil.getTime() - Date.now()) / 60000);

      return res.status(403).json({
        success: false,
        message: `Account locked. Try again after ${remainingTime} minutes`,
      });
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      userDoc.password
    );

    if (!isPasswordMatch) {
      userDoc.loginAttempts += 1;

      const LOCK_TIME = 50000; 


      // lock account if limit reached
      if (userDoc.loginAttempts >= 5) {
        userDoc.lockUntil = new Date(Date.now() + LOCK_TIME);
      }

      await userDoc.save();

      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Correct password → reset attempts
    userDoc.loginAttempts = 0;
    userDoc.lockUntil = undefined;
    await userDoc.save();

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const payload = {
      email: userDoc.email,
      id: userDoc._id,
      accountType: userDoc.accountType,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    const user = userDoc.toObject() as any;
    delete user.password;
    user.token = token;

    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token,
      user,
    });
  } catch (error: any) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error while login user",
      error: error.message,
    });
  }
};

// update password, 
export const updatePassword = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    const userId = (req as any).user.id;

    const userDoc = await User.findById(userId);
    if (!userDoc) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }


    const isOldPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDoc.password
    );

    if (!isOldPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid old password",
      });
    }

    // Prevent same password
    const isSamePassword = await bcrypt.compare(
      newPassword,
      userDoc.password
    );

    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be same as old password",
      });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    userDoc.password = hashedNewPassword;
    await userDoc.save();



   await mailSender(
  userDoc.email,                                           // 1. Email (to)
  "Your password has been updated",                        // 2. Subject
  passwordUpdated(userDoc.email, `${userDoc.firstName} ${userDoc.lastName}`) // 3. HTML Body
);

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error: any) {
    console.error("Update Password Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error while updating password",
      error: error.message,
    });
  }
};

