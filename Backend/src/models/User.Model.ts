import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  accountType: "Admin" | "Student" | "Instructor";
  active: boolean;
  approved: boolean;
  additionalDetails: mongoose.Types.ObjectId;
  courses: mongoose.Types.ObjectId[];
  token?: string;
  resetPasswordExpires?: Date;
  image: string;
  courseProgress: mongoose.Types.ObjectId[];
  loginAttempts: number;
  lockUntil?: Date;
}

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    accountType: {
      type: String,
      enum: ["Admin", "Student", "Instructor"],
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    approved: {
      type: Boolean,
      default: true,
    },
    additionalDetails: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    courses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    token: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    image: {
      type: String,
      required: true,
    },
    courseProgress: [
      {
        type: Schema.Types.ObjectId,
        ref: "courseProgress",
      },
    ],
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
    },
  },

  { timestamps: true },
);

export default mongoose.model<IUser>("User", userSchema);
