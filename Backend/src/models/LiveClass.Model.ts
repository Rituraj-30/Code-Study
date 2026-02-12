import mongoose, { Schema, Document } from "mongoose";

export interface ILiveClass extends Document {
  course: mongoose.Types.ObjectId;
  instructor: mongoose.Types.ObjectId;
  roomId: string;
  roomPassword: string;
  startTime: Date;
  endTime: Date;
  isLive: boolean;
  title:string;
  joinedStudents: mongoose.Types.ObjectId[];
}

const liveClassSchema = new Schema<ILiveClass>(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    roomId: {
      type: String,
      required: true,
      unique: true,
    },
    roomPassword: {
      type: String, 
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: { 
      type: Date,
    },
    isLive: {
      type: Boolean,
      default: false,
      index: true, 
    },

    joinedStudents: [
  {
    type: Schema.Types.ObjectId,
    ref: "User",
    default: [],
  }
],
  },
  { timestamps: true }
);

export default mongoose.model<ILiveClass>("LiveClass", liveClassSchema);
