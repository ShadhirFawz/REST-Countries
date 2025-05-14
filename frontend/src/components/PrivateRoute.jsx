// src/components/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children }) {
  const { user, authLoading } = useAuth();

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-gray-800 md:from-gray-900 md:via-black md:to-gray-800">
      <div className="relative">
        {/* Pulsing gradient circle */}
        
        {/* Rotating border */}
        <div className="absolute -inset-2 border-t-2 border-b-2 border-transparent rounded-full animate-spin"
             style={{
               borderTopColor: '#8b5cf6',
               borderBottomColor: '#3b82f6',
               animationDuration: '1.5s'
             }}></div>
        
        {/* Bouncing dots */}
        <div className="absolute inset-0 flex items-center justify-center space-x-1">
          {[...Array(3)].map((_, i) => (
            <div 
              key={i}
              className="w-2 h-2 bg-white rounded-full opacity-70"
              style={{
                animation: `bounce 1s infinite ${i * 0.2}s`,
              }}
            ></div>
          ))}
        </div>
        
        {/* Text */}
        <p className="mt-6 text-gray-300 font-medium">Authenticating...</p>
      </div>
      
      {/* Add the animation keyframes to your global CSS */}
      <style jsx global>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );

  return user ? children : <Navigate to="/login" />;
}