import mongoose, { Schema, Document } from "mongoose";


export interface IContact extends Document {

    name: string;
    email: string;
    phoneno: string;
    message: string;
    createdAt: Date;

}

const contactSchema = new Schema<IContact>({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  phoneno: {
    type: String,
    required: true,
  },
  message: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IContact>("contact", contactSchema);
