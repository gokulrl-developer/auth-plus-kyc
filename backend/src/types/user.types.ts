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