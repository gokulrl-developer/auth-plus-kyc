import { Schema, model, Document, Types } from 'mongoose';
import { KYCStatus, KYCStatusType } from '../constants/kyc-status';

export interface IImageKYC extends Document {
  userId: Types.ObjectId;
  imageUrl: string;   // secure url from cloudinary
  publicId:string;
  status: KYCStatusType;
  createdAt: Date;
  updatedAt?: Date;
}

const imageKYCSchema = new Schema<IImageKYC>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  imageUrl: {
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

export const ImageKYC = model<IImageKYC>('ImageKYC', imageKYCSchema);
