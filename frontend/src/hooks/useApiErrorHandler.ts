import { useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { AuthContextType } from "../types/auth.types";


export function useApiErrorHandler(setUser?: AuthContextType["setUser"],removeLocalStorageUser?:AuthContextType["removeLocalStorageUser"]) { 
  const handleApiError = useCallback(
    (error: unknown) => {
      if (axios.isAxiosError(error)) {
        // Network / CORS / server down
        if (!error.response) {
          toast.error("Network error. Please check your internet connection.");
          return;
        }

        const { status, data } = error.response;
        const message = data?.message;

        if (status >= 500) {
          toast.error("Something went wrong. Please try again later.");
        } else if (status >= 400) {
          toast.error(message || "Internal server error");
        }

        console.error("API Error:", status, error.response.data);

        if (
          status === 401 
        ) {
          if(setUser && removeLocalStorageUser){
          removeLocalStorageUser();
          setUser(null);
          }
        }
      } else {
        toast.error("Unexpected error occurred.");
      }
    },
    [setUser]
  );

  return { handleApiError };
}
