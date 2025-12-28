import { NextFunction, Request, Response} from "express";
import AppError from "./app-error";
import { StatusCodes } from "../constants/status-codes";

export const errorHandler = (
  err:AppError | Error | { code?: string; message?: string },
  _req: Request,
  res: Response,
  _next:NextFunction
) => {
  console.log("error message and error object",err?.message,err)
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
        message: err.message||"Internal server error",
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
    default:
      return StatusCodes.INTERNAL_SERVER_ERROR;
  }
};

