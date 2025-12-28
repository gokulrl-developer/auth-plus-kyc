import { AppErrorCodes } from "../../constants/error-codes";
import { ErrorMessages } from "../../constants/error-messages";
import { RegexExpressions } from "../../constants/regex-expressions";
import { IUser, User } from "../../models/user.mode";
import { RegisterInput } from "../../types/auth.types";
import AppError from "../../utils/app-error";
import { hashPassword } from "../../utils/password-encryption";

export const registerUser = async ({ email, password }: RegisterInput): Promise<void> => {
    if(password.length<8 || RegexExpressions.STRONGER_PASSWORD_REGEX.test(password) ===false){
        throw new AppError(ErrorMessages.PASSWORD_INVALID,AppErrorCodes.PASSWORD_INVALID)
    }
  const existingUser = await User.findOne({ email });
  if (existingUser){
    throw new AppError(ErrorMessages.USER_ALREADY_EXISTS,AppErrorCodes.USER_ALREADY_EXISTS);
  }

  // Hash password
  const hashedPassword = await hashPassword(password)

  await User.create({ email, password: hashedPassword });
};