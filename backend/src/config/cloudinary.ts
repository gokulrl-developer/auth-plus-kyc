import { UploadApiErrorResponse, UploadApiOptions, UploadApiResponse } from "cloudinary";

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


export const uploadToCloudinary = (fileBuffer:Buffer, options:UploadApiOptions):Promise<UploadApiResponse> => {
  return new Promise<UploadApiResponse>((resolve, reject)=> {
    const stream = cloudinary.uploader.upload_stream(
      options,
      (error:UploadApiErrorResponse|undefined, result:UploadApiResponse | undefined) => {
        if (error) reject(error);
        else if(result)resolve(result);
      }
    );

    stream.end(fileBuffer);
  });
};

export default cloudinary;
