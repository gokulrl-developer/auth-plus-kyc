import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, User } from 'lucide-react';
import { logoutUserAPI } from '../services/userService';
import { useApiErrorHandler } from '../hooks/useApiErrorHandler';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { setUser,removeLocalStorageUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const {handleApiError}=useApiErrorHandler();
  const handleSignOut = async () => {
    try{
      await logoutUserAPI();
      removeLocalStorageUser();
      setUser(null);
      navigate('/login');
    }catch(error){
       handleApiError(error) 
    }finally{
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <nav className="backdrop-blur-lg bg-white/10 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-white">KYC Portal</h1>
              <div className="flex space-x-4">
                <Link
                  to="/dashboard"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive('/dashboard')
                      ? 'bg-white/20 text-white'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <LayoutDashboard size={18} />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/profile"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive('/profile')
                      ? 'bg-white/20 text-white'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <User size={18} />
                  <span>Profile</span>
                </Link>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
