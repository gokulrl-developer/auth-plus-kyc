import { isObjectIdOrHexString } from "mongoose";
import { AppErrorCodes } from "../../constants/error-codes";
import { ErrorMessages } from "../../constants/error-messages";
import { ImageKYC } from "../../models/image-kyc.model";
import { User } from "../../models/user.model";
import { VideoKYC } from "../../models/video-kyc.model";
import { GetProfileReq, GetProfileResponse } from "../../types/user.types";
import AppError from "../../utils/app-error";

export default async function getUserProfile(getProfileReq:GetProfileReq):Promise<GetProfileResponse|null>{
    const {userId}=getProfileReq;
  const user=await User.findById(userId);
  if(!user){
    throw new AppError(ErrorMessages.USER_NOT_FOUND,AppErrorCodes.USER_NOT_FOUND)
  }

  const videoKYC=await VideoKYC.findOne({userId:userId}).sort({updatedAt:-1});
  const imageKYC=await ImageKYC.findOne({userId:userId}).sort({updatedAt:-1});
  return {
    videoUrl:videoKYC?.videoUrl? videoKYC?.videoUrl:undefined,
    imageUrl:imageKYC?.imageUrl? imageKYC?.imageUrl:undefined
  }

}