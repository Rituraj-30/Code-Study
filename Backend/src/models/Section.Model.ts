import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ISection extends Document {
    sectionName: string;
    subSection: Types.ObjectId[]; 
}

const sectionSchema: Schema = new Schema({
    sectionName: {
        type: String,
        required: true 
    },
    subSection: [
        {
            type: Schema.Types.ObjectId,
            ref: 'SubSection',
            required: true
        }
    ]
});

export default mongoose.model<ISection>('Section', sectionSchema);