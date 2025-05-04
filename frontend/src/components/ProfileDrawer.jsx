// src/components/ProfileDrawer.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserIcon, ChevronRightIcon, ArrowLeftStartOnRectangleIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

export default function ProfileDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  const drawerContent = (
    <div className={`relative bg-gray-800/90 backdrop-blur-sm h-full flex rounded-bl-2xl rounded-tl-2xl transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`}>
      {/* Toggle Icon */}
      <div
        className={`absolute -left-5 top-[20%] transform -translate-y-1/2 w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center shadow-lg cursor-pointer`}
        onClick={() => isMobile && setIsOpen(prev => !prev)}
      >
        <ChevronRightIcon
          className={`h-5 w-5 text-gray-300 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </div>

      {/* Always visible part */}
      <div className="w-15 h-full pl-4.5 flex flex-col items-center pt-12 space-y-8">
        <UserIcon className="h-8 w-8 text-gray-300 hover:text-blue-400 cursor-pointer" />
      </div>

      {/* Drawer details */}
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'w-52 opacity-100' : 'w-0 opacity-0'}`}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex-1 text-gray-300">
            {user ? (
              <div className="mb-4">
                <h3 className="text-lg pt-4 font-semibold">{user.username}</h3>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>
            ) : (
              <div>Profile content coming soon</div>
            )}
          </div>

          {user && (
            <button
              onClick={handleLogout}
              className="mt-auto flex items-center justify-center pl-5 space-x-2 w-full py-2 px-4 rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 text-gray-200 transition-colors duration-200"
            >
              <ArrowLeftStartOnRectangleIcon className="h-5 w-5" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="fixed right-0 top-0 h-full z-50 flex"
      onMouseEnter={!isMobile ? () => setIsOpen(true) : undefined}
      onMouseLeave={!isMobile ? () => setIsOpen(false) : undefined}
    >
      {drawerContent}
    </div>
  );
}
