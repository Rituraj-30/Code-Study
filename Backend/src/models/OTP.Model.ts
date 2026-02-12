import mongoose, { Document, Schema } from "mongoose";

export interface IOTP extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
  createdAt: Date;
}

const OTPSchema: Schema<IOTP> = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, 
    },
  },
  {
    timestamps: true,
  }
);

const OTP = mongoose.model<IOTP>("OTP", OTPSchema);

export default OTP;
