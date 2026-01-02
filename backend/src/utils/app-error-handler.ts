import { NextFunction, Request, Response } from "express";
import AppError from "./app-error";
import { StatusCodes } from "../constants/status-codes";
import { AppErrorCodes } from "../constants/error-codes";

export const errorHandler = (
  err: AppError | Error | { code?: string; message?: string },
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.log("error message and error object", err?.message, err);
  if (err instanceof AppError) {
    const statusCode = errorToHttpStatus(err.code);
    if (statusCode >= 400 && statusCode < 500) {
      return res.status(statusCode).json({
        code: err.code,
        message: err.message,
        success: false,
      });
    } else {
      console.error("Custom Error:", err.message, err.code);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        code: "INTERNAL_SERVER_ERROR",
        message: err.message || "Internal server error",
        success: false,
      });
    }
  }

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    code: "INTERNAL_SERVER_ERROR",
    message: "Internal server error",
    success: false,
  });
};

const errorToHttpStatus = (code: string): number => {
  switch (code) {
    case AppErrorCodes.USER_ALREADY_EXISTS:
      return StatusCodes.CONFLICT;
    case AppErrorCodes.INVALID_CREDENTIALS:
      return StatusCodes.UNAUTHORIZED;
    case AppErrorCodes.ACCOUNT_BLOCKED:
      return StatusCodes.FORBIDDEN;
    case AppErrorCodes.EMAIL_INVALID:
      return StatusCodes.UNAUTHORIZED;
    case AppErrorCodes.PASSWORD_INVALID:
      return StatusCodes.UNAUTHORIZED;
    case AppErrorCodes.SESSION_EXPIRED:
      return StatusCodes.UNAUTHORIZED;
    case AppErrorCodes.INVALID_INPUT:
      return StatusCodes.BAD_REQUEST;
    case AppErrorCodes.FILE_INVALID:
      return StatusCodes.BAD_REQUEST;
    case AppErrorCodes.FILE_NOT_FOUND:
      return StatusCodes.BAD_REQUEST
    case AppErrorCodes.IMAGE_KYC_COMPLETED:
      return StatusCodes.CONFLICT;
    case AppErrorCodes.VIDEO_KYC_COMPLETED:
      return StatusCodes.CONFLICT;
    case AppErrorCodes.USER_NOT_FOUND:
      return StatusCodes.NOT_FOUND;
    default:
      return StatusCodes.INTERNAL_SERVER_ERROR;
  }
};
