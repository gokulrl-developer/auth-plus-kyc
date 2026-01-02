export interface IUserDashboardResponse{
  userList:UserListItem[],
  totalPages:number
}

export interface UserListItem{
 userId:string,
  email:string,
  createdAt:Date
}

export interface GetUserDashboardPayload{
  page:string,
  pageSize:string,
  search:string
}

export interface UploadImageRequest{
  image:Blob
}
export interface UploadVideoRequest{
  video:Blob
}

export interface UploadImageResponse{
  message:string,
  imageUrl:string
}
export interface UploadVideoResponse{
  message:string,
  videoUrl:string
}

export interface IUserProfileResponse{
profileData:{
  imageUrl:string,
  videoUrl:string
}
}