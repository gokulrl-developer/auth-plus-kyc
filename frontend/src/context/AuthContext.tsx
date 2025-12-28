import { createContext, useContext,useState, ReactNode } from 'react';
import { AuthContextType, User } from '../types/auth.types';


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const localStorageUser=localStorage.getItem("user");
  const currentUser=localStorageUser?JSON.parse(localStorageUser):null;
  const [user, setUser] = useState<User | null>(currentUser);
  const [loading, setLoading] = useState(false);
  const removeLocalStorageUser=()=>{
      localStorage.removeItem("user")
  }
  
  return (
    <AuthContext.Provider value={{ user, loading, setLoading,setUser,removeLocalStorageUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
