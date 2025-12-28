import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RegisterErrorType } from '../types/auth.types';
import { RegexExpressions } from '../constants/regex-expressions';
import { registerUserAPI } from '../services/userService';
import { useApiErrorHandler } from '../hooks/useApiErrorHandler';
import { toast } from 'sonner';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
    const {handleApiError}=useApiErrorHandler()
  const navigate=useNavigate();

  const [error, setError] = useState<RegisterErrorType>({
      email:[],
      password:[]
    });

  const validateForm = () => {
   if (!email.trim()) {
        setError({...error,email:[...error.email,"email is required"]});
        return false;
      }
      if (!/\S+@\S+\.\S+/.test(email)) {
        setError({...error,email:[...error.email,"email is invalid"]});
        return false;
      }
      if (!password) {
        setError({...error,password:[...error.password,"password is required"]});
        return false;
      }
      if (!password) {
        setError({...error,password:[...error.password,"password is required"]});
        return false;
      }
  
      if (typeof password !== "string" || RegexExpressions.STRONGER_PASSWORD_REGEX.test(password)===false) {
        setError({...error,password:[...error.password,"password must be 8 char length and contain atleast one lowercase,uppercase,number,special character."]});
        return false;
      }
      return true;

  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  setError({
    email:[],
    password:[]
  });
    if (!validateForm()) return;

    setLoading(true);
    try {
      const registerResult=await registerUserAPI({email, password});
            toast(registerResult.message || "registration successful");
    navigate("/login")    
    } catch (err) {
        handleApiError(err)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="backdrop-blur-lg bg-white/10 rounded-2xl shadow-xl border border-white/20 p-8">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">Sign Up</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="At least 8 characters"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-400 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
