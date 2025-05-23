import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { 
  FaGlobe, 
  FaCity, 
  FaUsers, 
  FaRulerCombined,
  FaMoneyBillWave,
  FaLanguage,
  FaClock,
  FaCarSide,
  FaMapMarkerAlt,
  FaLandmark,
  FaFlag,
  FaFutbol,
  FaCalendarWeek,
  FaShare,
  FaCamera,
  FaHeart,
  FaRegHeart
} from "react-icons/fa";
import AnimatedCloseButton from "./AnimatedCloseButoon";
import html2canvas from "html2canvas";  
import { toBlob, toPng } from 'html-to-image';
import { addFavorite, removeFavorite } from '../services/api'
import { useAuth } from "../context/AuthContext";

export default function CountryModal({ country, onClose }) {
  const { token, favorites, loadFavorites } = useAuth();
  const [isOpen, setIsOpen] = useState(true);
  const contentRef = useRef(null);
  const cardRef = useRef(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isTakingScreenshot, setIsTakingScreenshot] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Extract data
  const currency = country.currencies ? Object.entries(country.currencies)[0] : null;
  const currencyLabel = currency ? `${currency[1].name} (${currency[0]}) ${currency[1].symbol ? `- ${currency[1].symbol}` : ''}` : 'N/A';
  const languages = country.languages ? Object.values(country.languages).join(', ') : 'N/A';
  const population = country.population ? country.population.toLocaleString() : 'N/A';
  const area = country.area ? `${country.area.toLocaleString()} km²` : 'N/A';
  const coordinates = country.latlng ? country.latlng.map(coord => coord.toFixed(2)).join(', ') : 'N/A';
  const timezones = country.timezones ? country.timezones.join(', ') : 'N/A';
  const drivingSide = country.car?.side ? `${country.car.side} (${country.car.signs?.join(', ') || ''})` : 'N/A';

  useEffect(() => {
    setIsFavorite(favorites?.some(fav => fav.code === country.cca3) || false);
  }, [favorites, country.cca3]);

  const toggleFavorite = async () => {
    if (!token) {
      showToast('Please login to add favorites', 'error');
      return;
    }
  
    setFavoriteLoading(true);
    const wasFavorite = isFavorite;
    setIsFavorite(!wasFavorite);
  
    try {
      if (wasFavorite) {
        await removeFavorite(country.cca3);
        showToast('Removed from favorites', 'info');
      } else {
        await addFavorite({
          code: country.cca3,
          name: country.name.common,
          flag: country.flags.png
        });
        showToast('Added to favorites', 'success');
      }
      await loadFavorites();
    } catch (err) {
      setIsFavorite(wasFavorite);
      showToast(err.response?.data?.message || 'Error updating favorites', 'error');
    } finally {
      setFavoriteLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 300);
  };

  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleTakeScreenshot = async () => {
    if (!cardRef.current || isTakingScreenshot) return;
    
    setIsTakingScreenshot(true);
    
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: isMobile ? 1 : 2,
        cacheBust: true,
      });
  
      const link = document.createElement('a');
      link.download = `${country.name?.common || 'country'}-card.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      setTimeout(() => {
        URL.revokeObjectURL(dataUrl);
      }, 100);
  
      showToast('Image downloaded!');
    } catch (error) {
      console.error('Error taking screenshot:', error);
      showToast('Failed to download image', 'error');
      
      try {
        const canvas = await html2canvas(cardRef.current, {
          scale: isMobile ? 1 : 2,
          logging: false,
          useCORS: true,
          allowTaint: true,
        });
        
        canvas.toBlob((blob) => {
          const link = document.createElement('a');
          link.download = `${country.name?.common || 'country'}-card.png`;
          link.href = URL.createObjectURL(blob);
          link.click();
          URL.revokeObjectURL(link.href);
        }, 'image/png');
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
      }
    } finally {
      setIsTakingScreenshot(false);
    }
  };

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.scrollbarWidth = 'none';
      contentRef.current.style.msOverflowStyle = 'none';
    }
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isOpen ? 1 : 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50"
    >
      {/* Close Button */}
      <motion.div
        className={`absolute ${isMobile ? 'top-20 right-5 z-50' : 'top-2 right-115'}`}
      >
        <AnimatedCloseButton onClick={handleClose} />
      </motion.div>

      {/* Favorite Button */}
      <motion.button
        className={`absolute ${isMobile ? 'top-4 right-16' : 'top-35 right-116'} z-50 p-2 rounded-full bg-gray-900/80 hover:bg-pink-500/80 transition-colors cursor-pointer`}
        whileHover={{ scale: isMobile ? 1 : 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleFavorite}
        disabled={favoriteLoading}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        {favoriteLoading ? (
          <div className="w-5 h-5 border-2 border-pink-400 border-t-transparent rounded-full animate-spin" />
        ) : isFavorite ? (
          <FaHeart className="h-5 w-5 text-pink-500" />
        ) : (
          <FaRegHeart className="h-5 w-5 text-gray-300 hover:text-pink-400" />
        )}
      </motion.button>

      {/* Screenshot Button */}
      <motion.button
        className={`absolute ${isMobile ? 'top-4 right-4' : 'top-20 right-116'} z-50 p-2 rounded-full bg-gray-900/80 hover:bg-blue-500 transition-colors cursor-pointer`}
        whileHover={{ scale: isMobile ? 1 : 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleTakeScreenshot}
        aria-label="Download country card"
      >
        <FaCamera className="h-5 w-5 text-gray-300" />
      </motion.button>

      {/* Loading indicator */}
      {isTakingScreenshot && (
        <motion.div
          className={`absolute ${isMobile ? 'top-4 left-4' : 'top-16 left-5'} z-50 p-2 bg-gray-900/80 rounded-full`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
        </motion.div>
      )}
      
      {/* ID Card Container */}
      <motion.div
        ref={cardRef}
        initial={{ scale: 0.95 }}
        animate={{ scale: isOpen ? 1 : 0.95 }}
        className={`relative w-full ${isMobile ? 'max-w-xs' : 'max-w-md'} bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border-2 border-gray-700/50 shadow-2xl overflow-hidden z-10`}
      >
        {/* Header Strip */}
        <div className="h-3 bg-gradient-to-r from-blue-500 to-blue-600"></div>

        {/* ID Card Body */}
        <div className={`p-4 ${isMobile ? '' : 'p-6'}`}>
          {/* Flag & Title */}
          <div className="flex items-center gap-4 mb-4">
            <div className={`${isMobile ? 'w-12 h-9' : 'w-16 h-12'} overflow-hidden rounded-md border-2 border-gray-600/50 shadow`}>
              <img 
                src={country.flags?.png} 
                alt={`${country.name?.common} flag`} 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-white`}>{country.name?.common}</h2>
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-300`}>{country.name?.official}</p>
            </div>
          </div>

          {/* ID Card Grid */}
          <div className="grid grid-cols-1 gap-3">
            {/* Row 1: Basic Info */}
            <div className="grid grid-cols-2 gap-3">
              <InfoField 
                icon={<FaGlobe className="text-blue-400" />}
                label="Region" 
                value={`${country.region}${country.subregion ? ` (${country.subregion})` : ''}`}
                isMobile={isMobile}
              />
              <InfoField 
                icon={<FaCity className="text-blue-400" />}
                label="Capital" 
                value={country.capital?.[0] || 'N/A'}
                isMobile={isMobile}
              />
            </div>

            {/* Row 2: Demographics */}
            <div className="grid grid-cols-2 gap-3">
              <InfoField 
                icon={<FaUsers className="text-blue-400" />}
                label="Population" 
                value={population}
                isMobile={isMobile}
              />
              <InfoField 
                icon={<FaRulerCombined className="text-blue-400" />}
                label="Area" 
                value={area}
                isMobile={isMobile}
              />
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-700/50 my-1"></div>

            {/* Row 3: Cultural Info */}
            <div className="grid grid-cols-2 gap-3">
              <InfoField 
                icon={<FaMoneyBillWave className="text-blue-400" />}
                label="Currency" 
                value={currencyLabel}
                isMobile={isMobile}
              />
              <InfoField 
                icon={<FaLanguage className="text-blue-400" />}
                label="Languages" 
                value={languages}
                isMobile={isMobile}
              />
            </div>

            {/* Row 4: Technical Info */}
            <div className="grid grid-cols-2 gap-3">
              <InfoField 
                icon={<FaClock className="text-blue-400" />}
                label="Timezones" 
                value={timezones}
                isMobile={isMobile}
              />
              <InfoField 
                icon={<FaCarSide className="text-blue-400" />}
                label="Driving Side" 
                value={drivingSide}
                isMobile={isMobile}
              />
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-700/50 my-1"></div>

            {/* Row 5: Geographical Info */}
            <InfoField 
              icon={<FaMapMarkerAlt className="text-blue-400" />}
              label="Coordinates" 
              value={coordinates}
              copyable
              onCopy={() => copyToClipboard(coordinates)}
              isMobile={isMobile}
            />

            {/* Row 6: International Info */}
            <div className="grid grid-cols-2 gap-3">
              <InfoField 
                icon={<FaLandmark className="text-blue-400" />}
                label="UN Member" 
                value={country.unMember ? 'Yes' : 'No'}
                isMobile={isMobile}
              />
              <InfoField 
                icon={<FaFlag className="text-blue-400" />}
                label="Country Codes" 
                value={`${country.cca2}/${country.cca3}`}
                isMobile={isMobile}
              />
            </div>

            {/* Row 7: Miscellaneous */}
            <div className="grid grid-cols-2 gap-3">
              <InfoField 
                icon={<FaFutbol className="text-blue-400" />}
                label="FIFA Code" 
                value={country.fifa || 'N/A'}
                isMobile={isMobile}
              />
              <InfoField 
                icon={<FaCalendarWeek className="text-blue-400" />}
                label="Week Starts" 
                value={country.startOfWeek || 'N/A'}
                isMobile={isMobile}
              />
            </div>
          </div>

          {/* Footer with Map Links */}
          <div className={`mt-4 pt-3 border-t border-gray-700/50 flex justify-center ${
            isMobile ? 'gap-1.5' : 'gap-2'
          }`}>
            <MapLink 
              href={country.maps?.googleMaps} 
              text="Google Maps"
              isMobile={isMobile}
            />
            <MapLink 
              href={country.maps?.openStreetMaps} 
              text="OpenStreetMap"
              isMobile={isMobile}
            />
          </div>
        </div>
      </motion.div>

      {/* Notifications */}
      {isCopied && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`fixed ${isMobile ? 'bottom-4 right-4' : 'bottom-6 right-6'} bg-green-600 text-white px-3 py-2 rounded-md shadow-lg text-sm`}
        >
          Copied to clipboard!
        </motion.div>
      )}
      {toast.show && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className={`fixed ${isMobile ? 'bottom-4 right-4' : 'bottom-6 right-6'} px-3 py-2 rounded-md shadow-lg z-50 text-sm ${
            toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'
          } text-white`}
        >
          {toast.message}
        </motion.div>
      )}
    </motion.div>
  );
}

// Updated InfoField component with mobile support
const InfoField = ({ icon, label, value, copyable = false, onCopy = () => {}, isMobile }) => (
  <div className="flex items-start gap-2 group">
    <div className={`${isMobile ? 'mt-0.5' : 'mt-1'}`}>{icon}</div>
    <div className="flex-1">
      <p className={`${isMobile ? 'text-2xs' : 'text-xs'} font-medium text-gray-400`}>{label}</p>
      <div className="flex items-center gap-1">
        <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-200 line-clamp-1`}>{value}</p>
        {copyable && (
          <button 
            onClick={onCopy}
            className={`${isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity text-gray-400 hover:text-blue-400`}
            title="Copy"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
          </button>
        )}
      </div>
    </div>
  </div>
);

// Updated MapLink component with mobile support
const MapLink = ({ href, text, isMobile }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    className={`${
      isMobile ? 
        'px-2.5 py-1 text-xs' : 
        'px-3 py-2 text-xs'
    } bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 rounded-md flex items-center gap-1 transition-colors border ${
      isMobile ? 
        'border-blue-400/30' : 
        'border-blue-400/20'
    }`}
  >
    <FaMapMarkerAlt className={isMobile ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
    <span className={isMobile ? 'text-xs' : ''}>
      {text}
    </span>
  </a>
);