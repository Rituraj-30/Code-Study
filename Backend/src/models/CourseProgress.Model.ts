import mongoose, { Schema, Document, Types } from "mongoose";


export interface ICourseProgress extends Document {
  courseID: Types.ObjectId;
  userId: Types.ObjectId;
  completedVideos: Types.ObjectId[];
}

const courseProgressSchema = new Schema<ICourseProgress>({
  courseID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  completedVideos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubSection",
    },
  ],
});

const CourseProgress = mongoose.models.CourseProgress || mongoose.model<ICourseProgress>("CourseProgress", courseProgressSchema);

export default CourseProgress;