import mongoose, { Schema, Document } from "mongoose";

export interface IRatingAndReview extends Document {
  user: mongoose.Types.ObjectId;
  rating: number;
  review: string;
  course: mongoose.Types.ObjectId;
}

const ratingAndReviewSchema = new Schema<IRatingAndReview>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  review: {
    type: String,
    required: true,
    trim: true,
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
    index: true,
  },
});

export default mongoose.model<IRatingAndReview>(
  "RatingAndReview",
  ratingAndReviewSchema
);
