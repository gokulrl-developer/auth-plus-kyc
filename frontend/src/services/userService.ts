import { Routes } from "../constants/routes";
import { ILoginPayload, ILoginResponse, ILogoutResponse, IRegisterPayload, IRegisterResponse } from "../types/auth.types";
import axiosInstance from "./axiosInstance";


export const registerUserAPI = (payload: IRegisterPayload) =>
  axiosInstance.post<IRegisterResponse>(Routes.USER_REGISTER, payload).then(res => res.data);

export const loginUserAPI = (payload: ILoginPayload) =>
  axiosInstance.post<ILoginResponse>(Routes.USER_LOGIN, payload).then(res => res.data);

export const logoutUserAPI = () =>
  axiosInstance.post<ILogoutResponse>(Routes.USER_LOGOUT).then(res => res.data);

export const getUserDashboardAPI = () =>
  axiosInstance.get<{message:"success"}>(Routes.USER_DASHBOARD).then(res=>res.data);
