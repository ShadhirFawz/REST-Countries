import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import backgroundImage from '../assets/Login_bg.jpg'
import FinalLogo from '../assets/FinalLogo.jpg'
import appLogo from '../assets/AppLogo.jpg'

export default function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({ email: '', password: '', username: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center md:justify-start bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4 sm:p-5">
      
      <div className="lg:hidden absolute top-0 w-full">
        {/* Background logo - visible on both mobile and desktop */}
        <div className="w-full flex justify-center">
          <div className="relative w-full max-w-4xl h-100 opacity-50">
            <img 
              src={backgroundImage} 
              alt="Background Logo" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
              
        {/* Foreground app logo - mobile version */}
        <div className="lg:hidden absolute top-10 w-full flex justify-center z-50">
          <div className="w-50 h-30 overflow-hidden border-none">
            <img 
              src={FinalLogo}
              alt="App Logo" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <motion.div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(800px at ${mousePosition.x}px ${mousePosition.y}px, rgba(29, 78, 216, 0.2), transparent 98%)`,
        }}
        transition={{ type: 'spring', damping: 30 }}
      />
      
      {/* Background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-transparent to-transparent opacity-50"></div>

      <div className="absolute right-0 top-0 h-full w-4/7 mr-0 hidden lg:block">
        <div className="relative left-15 h-full w-lvh">
          <div 
            className="absolute inset-0 rounded-r-xl overflow-hidden"
            style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.8)',
            opacity: 0.8,
            width: 'calc(100% + 5rem)'
            }}
          />
        </div>
      </div>

      <div className="absolute w-3/4 mt-0 mb-40 max-w-md z-50 ml-200 hidden lg:block">
        <div className="rounded-2xl mt-0 z-0 overflow-hidden transform-none pointer-events-none opacity-100">
          <img 
            src={appLogo}
            alt="App Logo visual" 
            className="w-800 h-full object-cover"
            />
        </div>
      </div>
      
      <div className="absolute w-3/4 mt-5 mb-26 max-w-md items-center ml-248 hidden lg:block">
        <div className="h-[7px] rounded-full bg-pink-500 w-50 opacity-65 z-150"></div>
        </div>
      
      <div className="absolute w-3/4 mt-5 mb-22 max-w-md items-center ml-260 hidden lg:block">
        <div className="h-[7px] rounded-full bg-blue-900 w-50 opacity-65 z-150"></div>
      </div>
      
      {/* Form Container - Responsive adjustments */}
      <div className="relative z-10 w-full max-w-md md:left-20 md:mt-7 md:transform md:translate-y-[-2%]">
        {/* Header */}
        <div className="mb-6 sm:mb-7 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-100 font-serif">
            Create Account
          </h2>
          <p className="mt-2 sm:mt-3 text-gray-400 flex items-center justify-center">
            Join with us today to{' '}
            <Link 
              to="/" 
              className="font-light pl-1 text-blue-400 transition-colors cursor-default flex items-center"
            >
              Explore the world <GlobeAltIcon className="h-5 w-5 ml-1 text-gray-400 inline-block" />
            </Link>
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-gray-800 bg-opacity-60 backdrop-blur-sm rounded-xl shadow-xl pb-6 sm:pb-7 pt-2 px-5 sm:px-7 border border-gray-700">
          {error && (
            <div className="mb-0 p-3 bg-red-900 bg-opacity-30 border border-red-700 rounded-lg">
              <div className="flex items-center text-red-300">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}
          <div className="mt-5 sm:mt-7 mb-4 sm:mb-5 border-gray-700">
            <h2 className="text-xl sm:text-2xl font-medium text-gray-300 font-sans text-center">
              REGISTER
            </h2>
          </div>

          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2" style={{ fontFamily: "sans-serif" }}>
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={form.username}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-900 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 hover:placeholder-gray-300 focus:placeholder-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2" style={{ fontFamily: "sans-serif" }}>
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-900 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 hover:placeholder-gray-300 focus:placeholder-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2" style={{ fontFamily: "sans-serif" }}>
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-900 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 hover:placeholder-gray-300 focus:placeholder-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-blue-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-blue-400" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 sm:py-3 px-4 bg-indigo-800 hover:bg-blue-900 cursor-pointer text-white font-serif rounded-lg transition-colors duration-300 flex justify-center items-center ${
                isLoading ? 'opacity-80' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registering...
                </>
              ) : (
                'Register'
              )}
            </button>
          </form>

          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-700">
            <p className="text-center text-sm text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium font-serif transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}