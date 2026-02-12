import { Request, Response } from 'express';
import UserModel from '../models/User.Model';
import ProfileModel from '../models/Profile.Model';
import CourseProgress from '../models/CourseProgress.Model';
import { uploadToCloudinary ,deleteResourceFromCloudinary } from "../utils/cloudinary/imgUploader";
import CourseModel from '../models/Course.Model';
import SectionModel from '../models/Section.Model';
import SubSectionModel from '../models/SubSection.Model';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    accountType: "Admin" | "Instructor" | "Student";
  };
}

// 1. Get Profile Details
export const getProfileDetails = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "User ID not found" });
    }

    const userDetails = await UserModel.findById(userId).populate('additionalDetails').exec();

    if (!userDetails) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      data: userDetails,
      message: 'User data fetched successfully',
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { 
        gender = "", 
        dateOfBirth = "", 
        about = "", 
        contactNumber = "", 
        firstName, 
        lastName 
    } = req.body;
    const userId = req.user?.id;

    const userDetails = await UserModel.findById(userId);
    if (!userDetails) return res.status(404).json({ success: false, message: "User not found" });

    const profileDetails = await ProfileModel.findById(userDetails.additionalDetails);
    if (!profileDetails) return res.status(404).json({ success: false, message: "Profile not found" });

    if (firstName) userDetails.firstName = firstName;
    if (lastName) userDetails.lastName = lastName;
    await userDetails.save();

    profileDetails.gender = gender;
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.contactNumber = contactNumber;
    await profileDetails.save();

    const updatedUserDetails = await UserModel.findById(userId)
      .populate("additionalDetails")
      .exec();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUserDetails, 
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// . Update Profile Image
export const updateUserProfileImage = async (req: AuthRequest, res: Response) => {
  try {
    // Yahan  'any' use kiya hai taaki TS property check bypass kregi
    const files = req.files as any;
    const profileImage = files?.profileImage;

    const userId = req.user?.id;

    if (!profileImage) {
      return res.status(400).json({ 
        success: false, 
        message: "Profile Image is required" 
      });
    }

    
    const image = await uploadToCloudinary(profileImage , { folder: "User-Profile" });

    // Database update
    const updatedUserDetails = await UserModel.findByIdAndUpdate(
      userId,
      { image: image.secure_url },
      { new: true }
    )
    .populate("additionalDetails")
    .exec();

    return res.status(200).json({ 
      success: true, 
      message: "Profile picture updated successfully",
      data: updatedUserDetails 
    });

  } catch (error: any) {
    console.error("Error updating profile image:", error);
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};


export const getEnrolledCourses = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    // const userDetails = await UserModel.findOne({ _id: userId })
    //   .populate({
    //     path: "courses",
    //     populate: {
    //       path: "courseContent",
    //       populate: { path: "subSection" },
    //     },
        
    //   })
    //   .exec();


    const userDetails = await UserModel.findOne({ _id: userId })
      .populate({
        path: "courses",
        match: { status: "Published" }, 
        populate: [
          {
            path: "courseContent",
            populate: { path: "subSection" },
          },
          {
            path: "ratingAndReviews",
          }
        ],
      })
      .exec();

    if (!userDetails) return res.status(404).json({ success: false, message: "User not found" });

    const userDetailsObj = userDetails.toObject();

    for (let i = 0; i < userDetailsObj.courses.length; i++) {
      const currentCourse = userDetailsObj.courses[i] as any;
      let totalLectures = 0;

      currentCourse.courseContent.forEach((section: any) => {
        totalLectures += section.subSection.length;
      });

      const courseProgress = await CourseProgress.findOne({
        courseID: currentCourse._id,
        userId: userId,
      });

      const completedCount = courseProgress?.completedVideos?.length || 0;

      if (totalLectures === 0) {
        currentCourse.progressPercentage = 100;
      } else {
        const multiplier = Math.pow(10, 2);
        currentCourse.progressPercentage =
          Math.round((completedCount / totalLectures) * 100 * multiplier) / multiplier;
      }

      currentCourse.completedVideos = courseProgress?.completedVideos || [];
    }


    return res.status(200).json({
      success: true,
      data: userDetailsObj.courses,
      userId: userId, 
    });

  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};



export const getInstructorCourses = async (req: AuthRequest, res: Response) => {
  try {
    const instructorId = req.user?.id;
    if (!instructorId) {
      return res.status(401).json({ success: false, message: "Instructor ID not found" });
    }

    const instructorCourses = await CourseModel.find({ instructor: instructorId })
      .sort({ createdAt: -1 })
      .exec();

    return res.status(200).json({
      success: true,
      data: instructorCourses,
      message: "Instructor courses fetched successfully",
    });

  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};



export const deleteAccount = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const userDetails = await UserModel.findById(userId);
        
        if (!userDetails) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

      
        if (userDetails.accountType === "Instructor") {
            const instructorCourses = userDetails.courses;

            for (const courseId of instructorCourses) {
               
                const course = await CourseModel.findById(courseId);
                
                if (course) {
                    
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
                            await SectionModel.findByIdAndDelete(sectionId);
                        }
                    }

                   
                    if (course.thumbnail) {
                        await deleteResourceFromCloudinary(course.thumbnail, "image");
                    }

                
                    await CourseModel.findByIdAndDelete(courseId);
                }
            }
        }
    
        if (userDetails.image?.includes("cloudinary")) {
            await deleteResourceFromCloudinary(userDetails.image, "image");
        }

    
        for (const courseId of userDetails.courses) {
            await CourseModel.findByIdAndUpdate(courseId, { $pull: { studentsEnrolled: userId } });
        }

        await CourseProgress.deleteMany({ userId });
        await ProfileModel.findByIdAndDelete(userDetails.additionalDetails);
        await UserModel.findByIdAndDelete(userId);

        res.status(200).json({ success: true, message: "Account deleted successfully" });

    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};