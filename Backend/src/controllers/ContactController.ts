import { Request, Response } from "express";
import ContactModel from "../models/ContantModel"; // Model name typo fix kiya
import mailSender from "../utils/mailSender";
import { contactUsEmail } from "../utils/mail/contactUsEmail";

export const contactUsController = async (req: Request, res: Response) => {
  try {
    
    const { name, email, phoneno, message } = req.body;

    if (!email || !name || !phoneno || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // console.log("name -> ", name)
    // console.log("email -> ", email)
    // console.log("phoneno -> ", phoneno)
    // console.log("message -> ", message)


    const existingMsg = await ContactModel.findOne({ 
        email, 
        createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) } 
    });

    if (existingMsg) {
      return res.status(400).json({
        success: false,
        message: "You have already sent a message! Please try again after 24 hours.",
      });
    }

    
    const contact = await ContactModel.create({
      name,
      email,
      phoneno,
      message: message, 
    });

    try {
      const emailBody = contactUsEmail(name);
      await mailSender(
        email,
        "Message Received - CodeStudy",
        emailBody
      );
    } catch (mailError) {
      console.error("Email sending failed:", mailError);
    }

    return res.status(200).json({
      success: true,
      message: "Your message was sent successfully!",
    });

  } catch (error: any) {
    console.error("CONTACT_US_ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};