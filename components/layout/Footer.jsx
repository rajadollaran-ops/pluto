// Footer.jsx (Enhanced)
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaRss, FaVideo, FaHeart, FaStar, FaShieldAlt, FaAward } from 'react-icons/fa';

export default function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-b from-slate-900 via-purple-900/20 to-black text-gray-400 py-16 shadow-2xl border-t border-gray-800/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row justify-between items-center mb-12 gap-8">
          <div className="flex items-center group">
            <div className="relative">
              <FaVideo className="text-blue-500 text-4xl mr-4 group-hover:text-yellow-400 transition-colors duration-500 group-hover:scale-110 transform-gpu" />
              <div className="absolute inset-0 bg-yellow-400 rounded-full blur-md group-hover:blur-lg opacity-50 group-hover:opacity-70 transition-all duration-500"></div>
            </div>
            <a href="https://watchpluto.netlify.app" className="text-3xl font-black text-white hover:text-transparent bg-gradient-to-r from-blue-400 to-purple-400 hover:from-orange-400 hover:to-yellow-400 bg-clip-text transition-all duration-500">
              Pluto
            </a>
          </div>
          
          <div className="flex space-x-8">
            <a href="https://facebook.com" className="text-gray-400 hover:text-blue-400 transition-all duration-500 transform hover:scale-125 hover:rotate-12" target="_blank" rel="noopener noreferrer">
              <FaFacebook size={28} />
            </a>
            <a href="https://twitter.com" className="text-gray-400 hover:text-blue-400 transition-all duration-500 transform hover:scale-125 hover:rotate-12" target="_blank" rel="noopener noreferrer">
              <FaTwitter size={28} />
            </a>
            <a href="https://instagram.com" className="text-gray-400 hover:text-pink-400 transition-all duration-500 transform hover:scale-125 hover:rotate-12" target="_blank" rel="noopener noreferrer">
              <FaInstagram size={28} />
            </a>
            <a href="https://youtube.com" className="text-gray-400 hover:text-red-400 transition-all duration-500 transform hover:scale-125 hover:rotate-12" target="_blank" rel="noopener noreferrer">
              <FaYoutube size={28} />
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-12 flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="text-center lg:text-left">
            <p className="text-lg">&copy; {year} Pluto. All rights reserved.</p>
            <p className="text-sm mt-3 text-gray-500 flex items-center justify-center lg:justify-start gap-2">
              Made with <FaHeart className="text-red-500 animate-pulse" /> by movie enthusiasts worldwide
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 text-lg">
            <a href="/privacy-policy" className="text-gray-400 hover:text-blue-400 transition-all duration-300 hover:scale-105 flex items-center gap-2">
              <FaShieldAlt className="text-green-400" />
              Privacy Policy
            </a>
            <a href="/terms-of-service" className="text-gray-400 hover:text-blue-400 transition-all duration-300 hover:scale-105 flex items-center gap-2">
              <FaAward className="text-yellow-400" />
              Terms of Service
            </a>
            <a href="/contact" className="text-gray-400 hover:text-blue-400 transition-all duration-300 hover:scale-105 flex items-center gap-2">
              Contact Us
            </a>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-lg mb-4">
            Powered by{' '}
            <a
              href="https://www.themoviedb.org/"
              className="text-blue-400 hover:text-blue-300 transition-colors font-bold"
              target="_blank"
              rel="noopener noreferrer"
            >
              TMDB API
            </a>{' '}
            &{' '}
            <a
              href="https://nextjs.org"
              className="text-blue-400 hover:text-blue-300 transition-colors font-bold"
              target="_blank"
              rel="noopener noreferrer"
            >
              Next.js
            </a>
          </p>
          <p className="text-sm text-gray-500 mt-3 max-w-2xl mx-auto">
            Disclaimer: Pluto is a comprehensive movie database that provides information and reviews. We do not host any videos or content on our servers. All content is provided by legitimate third-party services.
          </p>
          
          <div className="mt-6 flex items-center justify-center text-lg text-gray-400 hover:text-orange-400 transition-colors duration-300">
            <FaRss className="mr-3 text-orange-400" />
            <a href="/rss" className="hover:text-orange-400 font-bold">RSS Feed</a>
          </div>
        </div>
      </div>
    </footer>
  );
}