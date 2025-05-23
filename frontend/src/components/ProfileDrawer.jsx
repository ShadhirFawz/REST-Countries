// src/components/ProfileDrawer.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ChevronRightIcon, ArrowLeftStartOnRectangleIcon } from '@heroicons/react/24/outline';
import { EnvelopeIcon, PhoneIcon, UserIcon, PencilIcon } from '@heroicons/react/24/solid'
import { useNavigate } from 'react-router-dom';
import { getProfileImage } from '../services/api';
import EditProfileForm from './EditProfileForm';
import Modal from './Modal';

export default function ProfileDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user, logout } = useAuth();
  const [profileImage, setProfileImage] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (user) {
        try {
          const imageUrl = await getProfileImage();
          setProfileImage(imageUrl);
        } catch (error) {
          console.error('Failed to load profile image:', error);
          setProfileImage(null);
        }
      }
    };
    
    fetchProfileImage();
  }, [user]);

   const handleProfileUpdate = async () => {
    await fetchUser();
    await refreshProfileImage();
  };

  const editButton = (
    <button
      onClick={(e) => {
        e.stopPropagation(); // Prevent event from bubbling up
        setShowEditForm(true);
      }}
      className="flex items-center justify-center space-x-1 py-1 px-3 rounded-md cursor-pointer bg-gray-700 hover:bg-gray-600 text-gray-200 transition-colors duration-200 text-sm"
    >
      <PencilIcon className="h-3 w-3" />
      <span>Edit</span>
    </button>
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  const drawerContent = (
    <div className={`relative bg-gray-800/90 backdrop-blur-sm h-full flex rounded-bl-2xl rounded-tl-2xl transition-all duration-300 ${
      isOpen 
        ? isMobile ? 'w-64' : 'w-64' 
        : isMobile ? 'w-5' : 'w-20'
    }`}>
      {/* Toggle Icon */}
      <div
        className={`absolute -left-5 top-[20%] transform -translate-y-1/2 w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center shadow-lg cursor-pointer`}
        onClick={() => isMobile && setIsOpen(prev => !prev)}
      >
        <ChevronRightIcon
          className={`h-5 w-5 text-gray-300 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </div>

      {/* Single Profile Circle that animates */}
      <div className={`
        absolute top-12 transition-all duration-300
        ${isOpen ? 
          'left-1/2 transform -translate-x-1/2 h-20 w-20' : 
          isMobile ? 'left-2 h-8 w-8 p-1' : 'left-4 h-12 w-12'
        }
      `}>
        {profileImage ? (
          <div className="h-full w-full rounded-md bg-gray-700 overflow-hidden">
            <img 
              src={profileImage} 
              alt="Profile" 
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="h-full w-full rounded-md bg-red-500 flex items-center justify-center">
            <span className={`text-gray-300 ${isOpen ? 'text-2xl' : isMobile ? 'text-lg' : 'text-lg'} font-medium`}>
              {user?.username?.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Drawer details */}
      <div className={`overflow-visible transition-all duration-300 ${isOpen ? 'w-52 opacity-100' : 'w-0 opacity-0'}`}>
        <div className="h-full flex flex-col items-center pl-13 pt-45">
          <div className="w-full px-4 flex flex-col space-y-4"> {/* Added space-y-4 for vertical gaps */}
            {user ? (
              <div className="flex flex-col w-full mx-auto space-y-4"> {/* Added space-y-4 */}
                {/* Username Section */}
                <div className="flex flex-col space-y-2"> {/* Nested space-y-2 */}
                  <div className="flex items-center justify-center gap-2"> {/* Changed to proper flex alignment */}
                    <span className="inline-flex"> {/* Icon wrapper */}
                      <UserIcon className="h-5 w-5 text-gray-400 flex-shrink-0" /> {/* Added flex-shrink-0 */}
                    </span>
                  </div>
                  <h3 className="text-lg uppercase font-semibold text-center pb-3">{user.username}</h3>
                </div>

                {/* Email Section */}
                <div className="flex flex-col space-y-2 pt-2">
                  <div className="flex items-center justify-center gap-2"> {/* Changed to proper flex alignment */}
                    <span className="inline-flex"> {/* Icon wrapper */}
                      <EnvelopeIcon className="h-6 w-6 text-gray-400 pb-1 flex-shrink-0" /> {/* Added flex-shrink-0 */}
                    </span>
                    <p className="text-lg text-gray-400 pb-2">{user.email}</p>
                  </div>
                  <div className="h-[3px]  bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 w-auto"></div>
                </div>

                {/* Phone Section (conditionally rendered) */}
                {user.phone && (
                  <div className="flex flex-col space-y-2 pt-2">
                    <div className="flex items-center justify-center gap-2"> {/* Changed to proper flex alignment */}
                      <span className="inline-flex"> {/* Icon wrapper */}
                        <PhoneIcon className="h-5 w-5 text-gray-400 pb-1 flex-shrink-0" /> {/* Added flex-shrink-0 */}
                      </span>
                      <p className="text-lg text-gray-400 text-start pb-2">{user.phone}</p>
                    </div>
                    
                    <div className="h-[3px]  bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 w-auto"></div>
                  </div>
                )}

                {editButton}
              </div>
            ) : (
              <div>Profile content coming soon</div>
            )}
          </div>

          {/* Logout Button */}
          {user && (
            <div className="w-full px-4 mt-auto mb-4 flex justify-center"> {/* Centered button container */}
              <button
                onClick={handleLogout}
                className="flex items-center justify-center space-x-2 py-2 px-6 rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 text-gray-200 transition-colors duration-200"
              >
                <ArrowLeftStartOnRectangleIcon className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="fixed right-0 top-0 h-full z-50 flex"
        onMouseEnter={!isMobile ? () => setIsOpen(true) : undefined}
        onMouseLeave={!isMobile ? () => setIsOpen(false) : undefined}
      >
        {drawerContent}
      </div>

      {/* Edit Profile Modal */}
      {showEditForm && (
        <Modal isOpen={showEditForm} onClose={() => setShowEditForm(false)}>
          <EditProfileForm 
            onClose={() => setShowEditForm(false)}
            onUpdate={handleProfileUpdate}
          />
        </Modal>
      )}
    </>
  );
}