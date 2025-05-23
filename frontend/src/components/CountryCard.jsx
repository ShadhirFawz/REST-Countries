import { useState, useEffect } from 'react';
import { FaHeart, FaGlobe, FaCity, FaMoneyBillWave} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

export default function CountryCard({ country, onClick }) {
  const currency = country.currencies
    ? Object.entries(country.currencies)[0]
    : null;

  const currencyCode = currency ? currency[0] : 'N/A';
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [isHovered, setIsHovered] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const { favorites } = useAuth();
  const isFavorite = favorites?.some(fav => fav.code === country.cca3);

  const truncateText = (text, maxLength) => {
    return text?.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const countryName = truncateText(country.name?.common || 'N/A', isMobile ? 15 : 20);
  const officialName = truncateText(country.name?.official || 'N/A', isMobile ? 20 : 30);
  const region = truncateText(country.region || 'N/A', isMobile ? 15 : 20);
  const capital = country.capital?.[0] ? truncateText(country.capital[0], isMobile ? 10 : 15) : 'N/A';

  useEffect(() => {
    if (!isMobile) {
      let animationFrame;
      let startTime;
      const duration = 500;

      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        setAnimationProgress(isHovered ? progress : 1 - progress);
        
        if ((isHovered && progress < 1) || (!isHovered && progress < 1)) {
          animationFrame = requestAnimationFrame(animate);
        }
      };

      animationFrame = requestAnimationFrame(animate);

      return () => {
        cancelAnimationFrame(animationFrame);
      };
    }
  }, [isHovered, isMobile]);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      className={`group relative cursor-pointer bg-gray-800/70 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-lg ${
        !isMobile ? 
          'hover:shadow-xl hover:bg-gray-700/60 transition-all duration-300 hover:-translate-y-1 p-6 h-[420px]' : 
          'p-4 h-[300px]'
      } flex flex-col`}
    >
      {isFavorite && (
        <div className={`absolute z-10 bg-pink-500/90 rounded-full shadow-md ${
          !isMobile ? 'top-4 right-4 p-2' : 'top-3 right-3 p-1.5'
        }`}>
          <FaHeart className={`text-white ${
            !isMobile ? 'h-3 w-3' : 'h-2.5 w-2.5'
          }`} />
        </div>
      )}

      {/* Header Section */}
      <div className="relative z-10">
        <h3 className={`font-bold font-serif text-blue-400 mb-1 tracking-tight line-clamp-2 ${
          !isMobile ? 
            'text-2xl group-hover:text-blue-300 transition-colors' : 
            'text-lg'
        }`}>
          {countryName}
        </h3>
        <p className={`text-gray-300 font-mono uppercase tracking-wider line-clamp-2 ${
          !isMobile ? 'text-xs mb-4' : 'text-xs mb-3'
        }`}>
          {officialName}
        </p>
        
        <div className="relative h-px bg-gradient-to-r from-transparent via-gray-600/40 to-transparent overflow-hidden">
          {!isMobile ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-blue-400/30 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="my-3"></div>
            </>
          ) : (
            <div className="my-2"></div>
          )}
        </div>
      </div>

      {/* Details Section */}
      <div className={`relative z-10 flex-grow ${
        !isMobile ? 'space-y-3' : 'space-y-2'
      }`}>
        <div className="flex items-baseline">
          <span className={`font-medium text-gray-300/90 tracking-wider font-mono flex items-center ${
            !isMobile ? 'text-xs w-24' : 'text-[10px] w-16'
          }`}>
            <FaGlobe className={!isMobile ? 'mr-2' : 'mr-1'} /> REGION
          </span>
          <span className="text-gray-200 font-sans line-clamp-1" style={{ 
            fontFamily: 'san-serif', 
            fontSize: !isMobile ? '1.5rem' : '0.9rem' 
          }}>
            {region}
          </span>
        </div>
        
        <div className="h-[0.5px] bg-gray-700/50 w-full"></div>

        <div className="flex items-baseline pt-1">
          <span className={`font-medium text-gray-300/90 tracking-wider font-mono flex items-center ${
            !isMobile ? 'text-xs w-24' : 'text-[10px] w-16'
          }`}>
            <FaCity className={!isMobile ? 'mr-2' : 'mr-1'} /> CAPITAL
          </span>
          <span className={`text-gray-200 font-light font-sans line-clamp-1 ${
            isMobile ? 'text-sm' : ''
          }`}>
            {capital}
          </span>
        </div>
        
        <div className="h-[0.5px] bg-gray-700/50 w-full"></div>

        <div className="flex items-baseline pt-1">
          <span className={`font-medium text-gray-300/90 tracking-wider font-mono flex items-center ${
            !isMobile ? 'text-xs w-24' : 'text-[10px] w-16'
          }`}>
            <FaMoneyBillWave className={!isMobile ? 'mr-2' : 'mr-1'} /> CURRENCY
          </span>
          <span className={`text-gray-200 font-light font-sans ${
            isMobile ? 'text-sm' : ''
          }`}>
            {currencyCode}
          </span>
        </div>
      </div>

      {/* Flag Section */}
      <div className={`relative ${
        !isMobile ? 'mt-5' : 'mt-3'
      }`}>
        <div className={`absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-600/40 to-transparent ${
          !isMobile ? '-top-3' : '-top-2'
        }`}></div>
        <div className={`relative overflow-hidden rounded-lg border border-gray-700/60 ${
          !isMobile ? 'group-hover:border-blue-400/40 transition-all duration-300' : ''
        }`}>
          <img
            src={country.flags?.png || country.flag}
            alt={`${country.name?.common} flag`}
            className={`w-full object-cover ${
              !isMobile ? 
                'h-24 group-hover:scale-105 transition-transform duration-500' : 
                'h-16'
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-transparent to-transparent"></div>
        </div>
      </div>

      <div className={`absolute ${
        !isMobile ? 'bottom-3 right-3' : 'bottom-2 right-2'
      }`}>
        <span className={`bg-gray-800/80 text-blue-400/90 rounded-md font-mono tracking-tight border border-gray-700/50 ${
          !isMobile ? 'text-xs px-2 py-1' : 'text-[10px] px-1.5 py-0.5'
        }`}>
          EXPLORE
        </span>
      </div>
    </div>
  );
}