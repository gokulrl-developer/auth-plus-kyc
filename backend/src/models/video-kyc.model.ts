import { Schema, model, Document, Types } from 'mongoose';
import { KYCStatus, KYCStatusType } from '../constants/kyc-status';

export interface IVideoKYC extends Document {
  userId: Types.ObjectId;
  videoUrl: string;   // secure url from cloudinary
  publicId:string;
  status: KYCStatusType;
  createdAt: Date;
  updatedAt?: Date;
}

const videoKYCSchema = new Schema<IVideoKYC>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(KYCStatus),
    default: KYCStatus.SUBMITTED,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

export const VideoKYC = model<IVideoKYC>('VideoKYC', videoKYCSchema);
