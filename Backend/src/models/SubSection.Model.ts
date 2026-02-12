import mongoose, { Schema, Document } from 'mongoose';

export interface ISubSection extends Document {
    title: string;
    timeDuration: string;
    description: string;
    videoUrl: string;
}

const subSectionSchema: Schema = new Schema({
    title: {
        type: String,
        required: true
    },
    timeDuration: {
        type: String
    },
    description: {
        type: String
    },
    videoUrl: {
        type: String
    }
});

export default mongoose.model<ISubSection>('SubSection', subSectionSchema);