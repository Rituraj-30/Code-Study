import mongoose, { Schema, Document } from "mongoose";

export interface ISuccess extends Document {
    fullName: string;
    company: string;
    packege: string;
    role: string;
    image: string;
    createdAt: Date;
}

const successStudentSchema = new Schema<ISuccess>({
  fullName: { type: String, required: true },
  company: { type: String, required: true },
  packege: { type: String, required: true },
  role: { type: String, required: true },
  image: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// "SuccessStudent" model export
export default mongoose.models.SuccessStudent || mongoose.model<ISuccess>("SuccessStudent", successStudentSchema);