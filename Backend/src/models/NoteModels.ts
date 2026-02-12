import mongoose, { Schema, Document } from "mongoose";

export interface INote extends Document {
  title: string;       
  description?: string;
  category: "Handbook" | "Note" | "Cheatsheet"; 
  thumbnail: string;   
  fileUrl: string;     
  language: string;   
  createdAt: Date;
}

const noteSchema = new Schema<INote>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
    required: true,
    enum: ["Handbook", "Note", "Cheatsheet"], 
  },
  thumbnail: {
    type: String, 
    required: true,
  },
  fileUrl: {
    type: String, 
    required: true,
  },
  language: {
    type: String, 
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Note || mongoose.model<INote>("Note", noteSchema);