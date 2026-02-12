import mongoose, { Schema, Document } from "mongoose";

export interface ILiveParticipant extends Document {
  liveClass: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  canVideo: boolean;
  canAudio: boolean;
  canScreenShare: boolean;
}

const liveParticipantSchema = new Schema<ILiveParticipant>({
  liveClass: {
    type: Schema.Types.ObjectId,
    ref: "LiveClass",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  canVideo: {
    type: Boolean,
    default: false,
  },
  canAudio: {
    type: Boolean,
    default: false,
  },
  canScreenShare: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model<ILiveParticipant>(
  "LiveParticipant",
  liveParticipantSchema
);
