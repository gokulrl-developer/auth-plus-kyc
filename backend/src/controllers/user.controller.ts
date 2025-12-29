import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "../constants/status-codes";
import { AppErrorCodes } from "../constants/error-codes";
import AppError from "../utils/app-error";
import { ErrorMessages } from "../constants/error-messages";
import { getUserDashboard } from "../services/user-services/user-dashboard.service";

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
