export interface IRegisterPayload{
    email:string,
    password:string
}

export interface IRegisterResponse{
   message:string
}

export type LogoutFn = () => void;


export interface ILoginPayload{
    email:string,
    password:string
}

export interface ILoginResponse{
     message:string,
  user:User
}

export interface User{
    email:string,
    userId:string
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<User|null>>;
  removeLocalStorageUser:()=>void
}

export interface LoginErrorType{
  email:string[],
  password:string[]
}

export interface RegisterErrorType{
  email:string[],
  password:string[]
}

export interface ILogoutResponse{
  message:string
}