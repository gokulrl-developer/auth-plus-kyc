import "express";

declare global {
  namespace Express {
     interface Request {
      account?: {
        userId: string;
      }
    }
  }
}
