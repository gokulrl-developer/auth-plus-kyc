import { AppErrorCodesType } from "../constants/error-codes";

export default class AppError extends Error {
  constructor(
    message: string,
    public code:AppErrorCodesType
  ) {
    super(message);

  }
}
