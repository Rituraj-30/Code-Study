import mongoose, { Schema, Document } from "mongoose";

export type CourseStatus = "Draft" | "Published";

export interface ICourse extends Document {
  courseName?: string;
  courseDescription?: string;
  instructor: mongoose.Types.ObjectId;
  whatYouWillLearn?: string[]; 
  courseContent: mongoose.Types.ObjectId[];
  ratingAndReviews: mongoose.Types.ObjectId[];
  price?: number;
  thumbnail?: string;
  tag: string[]; 
  category?: mongoose.Types.ObjectId;
  studentsEnrolled: mongoose.Types.ObjectId[];
  instructions?: string[]; 
  status?: CourseStatus;
  createdAt: Date;
}

const courseSchema = new Schema<ICourse>({
  courseName: {
    type: String,
  },
  courseDescription: {
    type: String,
  },
  instructor: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  whatYouWillLearn: {
    type: [String], 
  },

  courseContent: [
    {
      type: Schema.Types.ObjectId,
      ref: "Section",
    },
  ],
  ratingAndReviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "RatingAndReview",
    },
  ],
  price: {
    type: Number,
  },
  thumbnail: {
    type: String,
  },
  tag: {
    type: [String],
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
  studentsEnrolled: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],

  instructions: {
    type: [String],
  },

  status: {
    type: String,
    enum: ["Draft", "Published"],
    default: "Draft",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<ICourse>("Course", courseSchema);
