import { AppErrorCodes } from "../../constants/error-codes";
import { ErrorMessages } from "../../constants/error-messages";
import { User } from "../../models/user.model";
import { LoginInput } from "../../types/auth.types";
import AppError from "../../utils/app-error";
import { comparePasswords } from "../../utils/password-encryption";
import { generateAccessToken } from "../../utils/token-handler";

export const loginUser = async ({ email, password }: LoginInput): Promise<{accessToken:string,email:string,userId:string}> => {
  const user = await User.findOne({ email });
  if (!user) throw new AppError(ErrorMessages.INVALID_CREDENTIALS,AppErrorCodes.INVALID_CREDENTIALS);
  const userId=user._id.toString();

  const isPasswordMatching = await comparePasswords(password,user.password);
  if (!isPasswordMatching){
    throw new AppError(ErrorMessages.INVALID_CREDENTIALS,AppErrorCodes.INVALID_CREDENTIALS);
  }
  const accessToken = generateAccessToken({userId})
  return {
    accessToken,
    email:user.email,
    userId
  };
};