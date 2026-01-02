import { Multer } from "multer"

export interface GetDashboardRequest{
    page:number,
    pageSize:number,
    search:string | null
}

export interface UserList{
 email:string,
 userId:string,
 createdAt:Date
}

export interface UploadImageReq{
    imageFile:Express.Multer.File,
    userId:string
}

export interface UploadVideoReq{
    videoFile:Express.Multer.File,
    userId:string
}

export interface GetProfileReq{
    userId:string
}
export interface GetProfileResponse{
    imageUrl?:string,
    videoUrl?:string
}