import mongoose, { Schema, Document } from "mongoose";

export interface IProfile extends Document {
  gender?: string;
  dateOfBirth?: string;
  about?: string;
  contactNumber?: number;
  location?: {
    city?: string;
    country?: string;
  };
 
}

const profileSchema = new Schema<IProfile>(
  {
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", "Prefer not to say"], 
    },
    dateOfBirth: {
      type: String, 
    },
    about: {
      type: String,
      trim: true,
      maxlength: [500, "About section cannot exceed 500 characters"],
    },
    contactNumber: {
      type: Number,
      trim: true,
    },
    location: {
      city: String,
      country: String,
    },
  },
  { timestamps: true } 
);

export default mongoose.model<IProfile>("Profile", profileSchema);