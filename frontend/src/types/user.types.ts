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