import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { ErrorMessages } from "../constants/error-messages";

interface IAccessTokenPayload extends JwtPayload {
  userId: string;
}

export function generateAccessToken(payload: IAccessTokenPayload): string {
  if (!process.env.ACCESS_TOKEN_EXPIRY) {
    throw new Error(ErrorMessages.ACCESS_TOKEN_EXPIRY_NOT_FOUND);
  }
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error(ErrorMessages.ACCESS_TOKEN_SECRET_NOT_FOUND);
  }
  const accessTokenExpiry = Number(process.env.ACCESS_TOKEN_EXPIRY);
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET!;

  if (!Number.isInteger(accessTokenExpiry) || accessTokenExpiry <= 0) {
    throw new Error(ErrorMessages.ACCESS_TOKEN_EXPIRY_INVALID);
  }

  const options: SignOptions = { expiresIn: accessTokenExpiry };
  return jwt.sign(payload, accessTokenSecret, options);
}

export function verifyAccessToken(token: string): IAccessTokenPayload {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error(ErrorMessages.ACCESS_TOKEN_SECRET_NOT_FOUND);
  }
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  
  return jwt.verify(token, accessTokenSecret) as IAccessTokenPayload;
}
