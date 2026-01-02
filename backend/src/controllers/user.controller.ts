import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "../constants/status-codes";
import { AppErrorCodes } from "../constants/error-codes";
import AppError from "../utils/app-error";
import { ErrorMessages } from "../constants/error-messages";
import { getUserDashboard } from "../services/user-services/user-dashboard.service";
import { uploadVideo } from "../services/user-services/user-video-upload";
import { uploadImage } from "../services/user-services/user-image-upload";
import getUserProfile from "../services/user-services/user-profile.service";

export const getDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let pageSize: number, page: number;
    if (
      !req.query.pageSize ||
      typeof req.query.pageSize !== "string" ||
      isNaN(Number(req.query.pageSize)) === true
    ) {
      pageSize = 10;
    } else {
      pageSize = Number(req.query.pageSize);
    }
    if (
      !req.query.page ||
      typeof req.query.page !== "string" ||
      isNaN(Number(req.query.page)) === true
    ) {
      page = 1;
    } else {
      page = Number(req.query.page);
    }
    if (req.query.search) {
      if (typeof req.query.search !== "string") {
        throw new AppError(
          ErrorMessages.INVALID_INPUT,
          AppErrorCodes.INVALID_INPUT
        );
      }
    }
    const {userList,totalPages}= await getUserDashboard({
      search: req.query.search?req.query.search:null,
      page,
      pageSize,
    });
    res.status(StatusCodes.OK).json({ userList,totalPages });
  } catch (err) {
    next(err);
  }
};
export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if(!req.account ||!req.account!.userId){
      throw new AppError(ErrorMessages.INTERNAL_SERVER_ERROR,AppErrorCodes.INTERNAL_SERVER_ERROR)
    }
    const profileData=await getUserProfile({
      userId:req.account.userId
    })

    res.status(StatusCodes.OK).json({ message:"profile fetched successfully",profileData });
  } catch (err) {
    next(err);
  }
};
export const uploadImageKYC = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if(!req.file){
      throw new AppError(ErrorMessages.NO_FILE,AppErrorCodes.FILE_NOT_FOUND)
    }
    if(!req.account ||!req.account!.userId){
      throw new AppError(ErrorMessages.INTERNAL_SERVER_ERROR,AppErrorCodes.INTERNAL_SERVER_ERROR)
    }
    const imageUrl=  await uploadImage({
        imageFile:req.file,
        userId:req.account.userId})
     res.status(StatusCodes.OK).json({message:"Image uploaded successfully",imageUrl})
  } catch (err) {
    next(err);
  }
};
export const uploadVideoKYC = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if(!req.file){
      throw new AppError(ErrorMessages.NO_FILE,AppErrorCodes.FILE_NOT_FOUND)
    }
    if(!req.account || !req.account!.userId){
      throw new AppError(ErrorMessages.INTERNAL_SERVER_ERROR,AppErrorCodes.INTERNAL_SERVER_ERROR)
    }
   const videoUrl= await uploadVideo({
      videoFile:req.file,
      userId:req.account.userId
    })
    res.status(StatusCodes.OK).json({ message:"video uploaded successfully",videoUrl });
  } catch (err) {
    next(err);
  }
};
