import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from '../constants/status-codes';

export const getDashboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
  res.status(StatusCodes.OK).json("dashboard data sent")
  } catch (err) {
    next(err);
  }
};