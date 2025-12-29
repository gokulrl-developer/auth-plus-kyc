import { Routes } from "../constants/routes";
import { ILoginPayload, ILoginResponse, ILogoutResponse, IRegisterPayload, IRegisterResponse } from "../types/auth.types";
import { GetUserDashboardPayload, IUserDashboardResponse } from "../types/user.types";
import axiosInstance from "./axiosInstance";


export const registerUserAPI = (payload: IRegisterPayload) =>
  axiosInstance.post<IRegisterResponse>(Routes.USER_REGISTER, payload).then(res => res.data);

export const loginUserAPI = (payload: ILoginPayload) =>
  axiosInstance.post<ILoginResponse>(Routes.USER_LOGIN, payload).then(res => res.data);

export const logoutUserAPI = () =>
  axiosInstance.post<ILogoutResponse>(Routes.USER_LOGOUT).then(res => res.data);

export const getUserDashboardAPI = (getDashboardPayload:GetUserDashboardPayload) =>{     
   const queryParamsObject: Omit<GetUserDashboardPayload, "search"> | GetUserDashboardPayload =
    getDashboardPayload.search.length>0
      ? getDashboardPayload
      : (({ search, ...rest }) => rest)(getDashboardPayload);

  return axiosInstance
    .get<IUserDashboardResponse>(Routes.USER_DASHBOARD, {
      params: queryParamsObject,
    })
    .then((res) => res.data);
}
