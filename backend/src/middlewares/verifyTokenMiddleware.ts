import { Request, Response, NextFunction } from "express";
import AppError from "../utils/app-error";
import { verifyAccessToken } from "../utils/token-handler";
import { ErrorMessages } from "../constants/error-messages";
import { AppErrorCodes } from "../constants/error-codes";

async function verifyTokenMiddleware(req: Request, res: Response, next: NextFunction){
  try{ 
  const token = req.cookies.accessToken;
    if (!token) {
      throw new AppError(ErrorMessages.SESSION_EXPIRED,AppErrorCodes.SESSION_EXPIRED)
    }

    const decoded = await verifyAccessToken(token);
    if (!decoded || !decoded.userId) {
      throw new AppError(ErrorMessages.SESSION_EXPIRED,AppErrorCodes.SESSION_EXPIRED)
    }
      req.account={userId:decoded.userId}

    next();
  }catch(error){
    next(error)
  }
  };

  export default verifyTokenMiddleware;

