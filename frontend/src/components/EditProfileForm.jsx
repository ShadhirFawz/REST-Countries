// src/components/EditProfileForm.jsx
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { updateUserProfile, getProfileImage } from '../services/api';
import { motion } from 'framer-motion';
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';

export default function EditProfileForm({ onClose, onUpdate }) {
  const { user, fetchUser } = useAuth();
  const { showToast } = useToast();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    profilePic: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentProfileImage, setCurrentProfileImage] = useState(null);

  // Fetch current profile image when component mounts
  useEffect(() => {
    const fetchCurrentProfileImage = async () => {
      try {
        if (user) {
          const imageUrl = await getProfileImage();
          setCurrentProfileImage(imageUrl);
          setImagePreview(imageUrl);
        }
      } catch (error) {
        console.error('Error fetching profile image:', error);
      }
    };

    fetchCurrentProfileImage();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setFormData(prev => ({ ...prev, profilePic: file }));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setFormData(prev => ({ ...prev, profilePic: file }));
    }
  };

  const removeImage = () => {
    // Reset to the current profile image instead of null
    setImagePreview(currentProfileImage);
    setFormData(prev => ({ ...prev, profilePic: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await updateUserProfile(formData);
      await fetchUser();
      showToast('Profile updated successfully!', 'success');
      onUpdate();
      onClose();
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to update profile', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-auto border border-gray-700 shadow-2xl"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-light text-gray-100">Edit Profile</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-200 transition-colors"
          aria-label="Close"
        >
          <XMarkIcon className="h-6 w-6 cursor-pointer" />
        </button>
      </div>

      <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
        <div className="space-y-5">
          {/* Profile Picture Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2" style={{fontFamily: "sans-serif"}}>
              Profile Picture
            </label>
            <div 
              className={`relative group rounded-lg overflow-hidden ${isDragging ? 'ring-2 ring-blue-500' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <div className="relative h-40 w-full">
                  <img
                    src={imagePreview}
                    alt="Profile preview"
                    className="h-full w-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage();
                    }}
                    className="absolute top-2 right-2 p-1 bg-gray-900/80 rounded-full text-gray-300 hover:text-white transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5 cursor-pointer" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 bg-gray-700/50 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  <PhotoIcon className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-400 text-center px-4">
                    Drag & drop an image here, or click to select
                  </p>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Username Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2" style={{fontFamily: "sans-serif"}}>
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2" style={{fontFamily: "sans-serif"}}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2" style={{fontFamily: "sans-serif"}}>
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="mt-8 flex justify-end space-x-3">
          <motion.button
            type="button"
            onClick={onClose}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            style={{fontFamily: "sans-serif"}}
            className="px-5 py-2.5 text-sm font-medium text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all cursor-pointer"
          >
            Cancel
          </motion.button>
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: isLoading ? 1 : 1.03 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            style={{fontFamily: "sans-serif"}}
            className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-800 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer transition-all flex items-center justify-center min-w-24"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : 'Save Changes'}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}