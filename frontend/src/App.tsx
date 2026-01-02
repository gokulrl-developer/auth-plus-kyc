import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PublicRoute from './components/PublicRoute';
import Profile from './pages/Profile';
import { Toaster } from 'sonner';

function App() {
  return (
    
    <AuthProvider>
     <Toaster position="top-right" richColors closeButton />
      <Router>
        <Routes>
          <Route path="/login" element={
            <PublicRoute>
            <Login />
          </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
            <Register />
          </PublicRoute>
          } />
           <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          /> 
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
