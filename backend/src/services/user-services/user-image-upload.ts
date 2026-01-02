import { uploadToCloudinary } from "../../config/cloudinary";
import { AppErrorCodes } from "../../constants/error-codes";
import { ErrorMessages } from "../../constants/error-messages";
import { KYCStatus } from "../../constants/kyc-status";
import { ImageKYC } from "../../models/image-kyc.model";
import { UploadImageReq } from "../../types/user.types";
import AppError from "../../utils/app-error";

export const uploadImage = async (
  uploadImageReq: UploadImageReq
): Promise<string | void> => {
  const {imageFile,userId} = uploadImageReq;
  const uploadedResult = await uploadToCloudinary(imageFile.buffer, {
    resource_type: "image",
    folder: "kyc-media",
    allowed_formats: ["png"],
    min_file_size: 5 * 1024,
    max_file_size: 5 * 1024 * 1024,
  });
const existingKYC=await ImageKYC.findOne({userId:userId}).sort({updatedAt:-1});
console.log(uploadedResult)
if(!existingKYC ||(
  existingKYC && existingKYC.status!=="accepted"
)){
  const imageKYC=await ImageKYC.create({
    userId:userId,
    imageUrl:uploadedResult.secure_url,
    publicId:uploadedResult.public_id,
    status:KYCStatus.SUBMITTED
  });
  return imageKYC.imageUrl
} else if(existingKYC && existingKYC.status==="accepted"){
  throw new AppError(ErrorMessages.IMAGE_KYC_COMPLETED,AppErrorCodes.IMAGE_KYC_COMPLETED)
}

};
