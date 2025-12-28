import { Request, Response, NextFunction } from 'express';
import { registerUser } from '../services/auth-services/register.services';
import { ErrorMessages } from '../constants/error-messages';
import { AppErrorCodes } from '../constants/error-codes';
import AppError from '../utils/app-error';
import { SuccessMessages } from '../constants/success-messages';
import { loginUser } from '../services/auth-services/login.services';
import { StatusCodes } from '../constants/status-codes';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;   
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     
    if(!email || typeof email !== "string" || emailRegex.test(email)===false){
        throw new AppError(ErrorMessages.EMAIL_INVALID,AppErrorCodes.EMAIL_INVALID)
    }
    
    if(!password || typeof password !== "string"){
        throw new AppError(ErrorMessages.PASSWORD_INVALID,AppErrorCodes.PASSWORD_INVALID)
    }

    await registerUser({ email, password });
    res.status(201).json({ message: SuccessMessages.REGISTRATION_SUCCESS});
  } catch (err) {
    next(err);
  }
};
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;   
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     
    if(!email || typeof email !== "string" || emailRegex.test(email)===false){
        throw new AppError(ErrorMessages.EMAIL_INVALID,AppErrorCodes.EMAIL_INVALID)
    }
    
    if(!password || typeof password !== "string"){
        throw new AppError(ErrorMessages.PASSWORD_INVALID,AppErrorCodes.PASSWORD_INVALID)
    }

    const user = await loginUser({ email, password });
   
    res.cookie("accessToken", user.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: Number(process.env.ACCESS_TOKEN_COOKIE_MAX_AGE!),
        path: "/",
      });

    res.status(201).json({ message: SuccessMessages.LOGIN_SUCCESS,user:{email:user.email,userId:user.userId}});
  } catch (err) {
    next(err);
  }
}
  export const logout =async (req:Request,res:Response,next:NextFunction)=>{
     try{
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict" as const,
        path:"/"
      };
       res.clearCookie("accessToken",{...cookieOptions});
       res.status(StatusCodes.OK).json({message:SuccessMessages.SIGNOUT_SUCCESS})
     }catch(error){
        next(error)
     }   
  }

