import "express";

declare global {
   namespace Multer {
        interface File {
            fieldname: string;
            originalname: string;
            encoding: string;
            mimetype: string;
            size: number;
            buffer: Buffer;
            destination?: string;
            filename?: string;
            path?: string;
        }
    }
  namespace Express {
     interface Request {
      account?: {
        userId: string;
      }
    }
  }
}
