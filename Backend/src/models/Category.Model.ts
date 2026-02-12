import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description?: string;
  courses: mongoose.Types.ObjectId[];
}

const categorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
  },
  courses: [
    {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
});

export default mongoose.model<ICategory>("Category", categorySchema);
