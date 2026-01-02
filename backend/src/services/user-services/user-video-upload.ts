import { uploadToCloudinary } from "../../config/cloudinary";
import { AppErrorCodes } from "../../constants/error-codes";
import { ErrorMessages } from "../../constants/error-messages";
import { KYCStatus } from "../../constants/kyc-status";
import { VideoKYC } from "../../models/video-kyc.model";
import { UploadVideoReq } from "../../types/user.types";
import AppError from "../../utils/app-error";

export const uploadVideo = async (
  uploadVideoReq: UploadVideoReq
): Promise<string|void> => {
  const {userId,videoFile} = uploadVideoReq;
  const uploadedResult = await uploadToCloudinary(videoFile.buffer, {
    resource_type: "video",
    folder: "kyc-media",
    allowed_formats: ["webm", "mp4"],
    min: 200 * 1024,
    max: 20 * 1024 * 1024,
     max_duration: 30,
    min_duration: 15,
  });
const existingKYC=await VideoKYC.findOne({userId:userId}).sort({updatedAt:-1});

if(!existingKYC ||(
  existingKYC && existingKYC.status!=="accepted"
)){
  const videoKYC=await VideoKYC.create({
    userId:userId,
    videoUrl:uploadedResult.secure_url,
    publicId:uploadedResult.public_id,
    status:KYCStatus.SUBMITTED
  });
  return videoKYC.videoUrl
} else if(existingKYC && existingKYC.status==="accepted"){
  throw new AppError(ErrorMessages.VIDEO_KYC_COMPLETED,AppErrorCodes.VIDEO_KYC_COMPLETED)
}};
