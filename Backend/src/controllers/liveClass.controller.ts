import { Request, Response } from "express";
import { RtcTokenBuilder, RtcRole } from "agora-access-token";
import LiveClassModel from "../models/LiveClass.Model"; // Path check karle
import CourseModel from "../models/Course.Model";
import mongoose from "mongoose";
import mailSender from "../utils/mailSender";
import { liveClassNotificationEmail } from "../utils/mail/liveClassNotificationEmail";


const generateAgoraToken = (channelName: string, role: number) => {
  const appId = process.env.AGORA_APP_ID || "";
  const appCertificate = process.env.AGORA_APP_CERTIFICATE || "";
  const expirationTimeInSeconds = 3600 * 2;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  const uid = 0;

  const token = RtcTokenBuilder.buildTokenWithUid(
    appId,
    appCertificate,
    channelName,
    uid,
    role,
    privilegeExpiredTs,
  );

  return { token, uid, appId };
};

export const startLiveClass = async (req: Request, res: Response) => {
  try {
    const { courseId, title, roomId, roomPassword } = req.body;
    const instructorId = req.user?.id;

    const course =
      await CourseModel.findById(courseId).populate("studentsEnrolled");

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    if (course.instructor.toString() !== instructorId) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized access" });
    }

    //  agr pele se live  he ya nhi
    const activeSession = await LiveClassModel.findOne({
      course: courseId,
      isLive: true,
    });

    if (activeSession) {
      return res.status(400).json({
        success: false,
        message: "A live session is already active for this course.",
      });
    }

    const newLiveSession = await LiveClassModel.create({
      course: courseId,
      instructor: instructorId,
      title,
      roomId: roomId.trim(),
      roomPassword,
      startTime: new Date(),
      isLive: true,
      joinedStudents: [],
    });

    // Token create kiya
    const { token, uid, appId } = generateAgoraToken(roomId, RtcRole.PUBLISHER);

    //  Email Process
    const enrolledStudents = course.studentsEnrolled;

    if (enrolledStudents && enrolledStudents.length > 0) {
      const emailPromises = enrolledStudents.map((student: any) => {
        return mailSender(
      student.email,                         
      `🔴 LIVE NOW: ${title}`,               
      liveClassNotificationEmail({           
        courseName: course.courseName || " Your Enroll Course",
        name: student.firstName || "Student",
        title: title,
        roomId: roomId,
        roomPassword: roomPassword,
      })
    );
      });

      Promise.all(emailPromises)
        .then(() =>
          console.log(
            `Notification sent to ${enrolledStudents.length} students`,
          ),
        )
        .catch((err) => console.error("Email Error:", err));
    }

    return res.status(201).json({
      success: true,
      message: "Class started successfully!",
      token,
      uid,
      appId,
      session: newLiveSession,
    });
  } catch (error: any) {
    console.error("START_LIVE_ERROR:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const joinLiveClass = async (req: Request, res: Response) => {
  try {
    const { roomId, password } = req.body;
    const studentId = req.user?.id;

    if (!roomId || !password) {
      return res.status(400).json({ message: "Room ID and Password required" });
    }

    const liveSession = await LiveClassModel.findOne({ roomId, isLive: true });
    if (!liveSession) {
      return res.status(404).json({ message: "No active live session found." });
    }

    if (liveSession.roomPassword !== password) {
      return res.status(403).json({ message: "Invalid Room Password" });
    }

    // Enrollment Check
    const course = await CourseModel.findById(liveSession.course);
    const isEnrolled = course?.studentsEnrolled.includes(studentId as any);

    if (!isEnrolled) {
      return res
        .status(403)
        .json({ message: "You are not enrolled in this course." });
    }

    const { token, uid, appId } = generateAgoraToken(
      roomId,
      RtcRole.SUBSCRIBER,
    );

    await LiveClassModel.findByIdAndUpdate(liveSession._id, {
      $addToSet: { joinedStudents: studentId },
    });

    res.status(200).json({
      success: true,
      token,
      uid,
      appId,
      channelName: roomId,
    });
  } catch (error) {
    res.status(500).json({ message: "Join process failed" });
  }
};

export const endLiveClass = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.body;
    const instructorId = req.user?.id;

    const session = await LiveClassModel.findOneAndUpdate(
      {
        roomId: roomId.trim(),
        instructor: instructorId,
        isLive: true,
      },
      {
        $set: { isLive: false, endTime: new Date() },
      },
      { new: true },
    );

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "No active session found to end.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Class ended successfully",
      duration:
        Math.round(
          (new Date().getTime() - session.startTime.getTime()) / 60000,
        ) + " minutes",
    });
  } catch (error: any) {
    return res
      .status(500)
      .json({ success: false, message: "Error ending class" });
  }
};
