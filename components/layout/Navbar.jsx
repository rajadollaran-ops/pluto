// components/layout/Navbar.jsx

"use client";

import Link from 'next/link';
import { FaVideo, FaChevronDown, FaBars, FaTimes, FaUser, FaCalendar, FaTrophy } from 'react-icons/fa';
import { getMovieGenres, getTvSeriesGenres } from '../../lib/api';
import SearchBar from '../SearchBar';
import { useEffect, useState } from 'react';

// Reusable class for dropdown items for consistency
const dropdownItemClass = "block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-red-800 hover:text-white transition-colors duration-200";

// Reusable class for sub-dropdown triggers
const subDropdownTriggerClass = "flex justify-between items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-blue-700 cursor-pointer";

// Utility function to create a slug from a genre name
const createSlug = (name) => {
  return name.toLowerCase().replace(/\s+/g, '-');
};

// Define DropdownMenu component outside of Navbar
const DropdownMenu = ({ title, categories, genres, genrePathPrefix }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenresOpen, setIsGenresOpen] = useState(false);
  let timeoutId;

  const handleMouseEnter = () => {
    clearTimeout(timeoutId);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => {
      setIsOpen(false);
      setIsGenresOpen(false); // Pastikan sub-dropdown juga tertutup
    }, 100); // Penundaan 100ms
  };

  // Handler khusus untuk sub-dropdown Genres
  const handleGenresMouseEnter = () => {
    setIsGenresOpen(true);
  };

  const handleGenresMouseLeave = () => {
    setIsGenresOpen(false);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className="flex items-center text-white hover:text-green-600 transition-colors duration-200 font-bold"
      >
        {title} <FaChevronDown className={`ml-1 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute left-0 mt-2 w-48 bg-slate-800 dark:bg-gray-800 rounded-md shadow-lg z-20">
          <div className="py-1">
            {categories.map((category) => (
              <Link
                key={category.href}
                href={category.href}
                className={dropdownItemClass}
                onClick={() => setIsOpen(false)} // Close parent dropdown on item click
              >
                {category.label}
              </Link>
            ))}
            {genres.length > 0 && (
              <div
                className="relative"
                onMouseEnter={handleGenresMouseEnter}
                onMouseLeave={handleGenresMouseLeave}
              >
                <button className={subDropdownTriggerClass}>
                  Genres <FaChevronDown className={`ml1 transition-transform duration-200 ${isGenresOpen ? 'rotate-180' : ''}`} />
                </button>
                {isGenresOpen && (
                  <div className="absolute top-0 left-full mt-0 w-48 bg-slate-800 dark:bg-gray-800 rounded-md shadow-lg z-30 ml1">
                    <div className="py-1 max-h-60 overflow-y-auto">
                      {genres.map((genre) => (
                        <Link
                          key={genre.id}
                          href={`/${genrePathPrefix}/genre/${createSlug(genre.name)}`}
                          className={dropdownItemClass}
                          onClick={() => { setIsOpen(false); setIsGenresOpen(false); }} // Close all on item click
                        >
                          {genre.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default function Navbar() {
  const [movieGenres, setMovieGenres] = useState([]);
  const [tvGenres, setTvGenres] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const [fetchedMovieGenres, fetchedTvGenres] = await Promise.all([
          getMovieGenres(),
          getTvSeriesGenres()
        ]);
        setMovieGenres(fetchedMovieGenres);
        setTvGenres(fetchedTvGenres);
      } catch (error) {
        console.error("Error fetching genres in Navbar:", error);
      }
    };
    fetchGenres();
  }, []);

  // Generate current year and decade for archives
  const currentYear = new Date().getFullYear();
  const recentYears = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const decades = ['2020s', '2010s', '2000s', '1990s', '1980s'];

  return (
    <nav className="bg-gradient-to-b from-purple-900/50 to-slate-900 py-6 p-4 sticky top-0 z-50 shadow-lg transition-colors duration-300">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {/* Logo mengarah ke Trendingpage (/) - halaman about */}
          <Link href="/" className="flex items-center text-3xl font-bold transition-colors duration-200 group">
            <FaVideo className="text-white mr-2 group-hover:text-yellow-200 transition-colors" />
            <span className="rainbow-text hover:text-white transition-colors">
              Pluto Tv
            </span>
          </Link>
          <div className="hidden md:flex items-center space-x-4">
            
            {/* Movies Dropdown */}
            <DropdownMenu
              title="Movies"
              categories={[
                { href: "/movie/popular", label: "Popular" },
                { href: "/movie/now_playing", label: "Now Playing" },
                { href: "/movie/upcoming", label: "Upcoming" },
                { href: "/movie/top_rated", label: "Top Rated" },
              ]}
              genres={movieGenres}
              genrePathPrefix="movie"
            />
            
            {/* TV Series Dropdown */}
            <DropdownMenu
              title="Tv Series"
              categories={[
                { href: "/tv-show/popular", label: "Popular" },
                { href: "/tv-show/airing_today", label: "Airing Today" },
                { href: "/tv-show/on_the_air", label: "On The Air" },
                { href: "/tv-show/top_rated", label: "Top Rated" },
              ]}
              genres={tvGenres}
              genrePathPrefix="tv-show"
            />
            
            {/* Actors/People */}
            <Link href="/people" className="flex items-center text-white hover:text-green-600 transition-colors duration-200 font-bold">
              <FaUser className="mr-1" /> Actors
            </Link>
            
            {/* Rankings/Top Rated */}
            <Link href="/rankings" className="flex items-center text-white hover:text-green-600 transition-colors duration-200 font-bold">
              <FaTrophy className="mr-1" /> Rankings
            </Link>
            
            {/* Archives by Year */}
            <div className="relative group">
              <button className="flex items-center text-white hover:text-green-600 transition-colors duration-200 font-bold">
                <FaCalendar className="mr-1" /> Archives <FaChevronDown className="ml-1" />
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-slate-800 rounded-md shadow-lg z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-2">
                  <div className="px-4 py-1 text-xs text-gray-400 border-b border-gray-700">By Year</div>
                  {recentYears.map(year => (
                    <Link
                      key={year}
                      href={`/movie/year/${year}`}
                      className={dropdownItemClass}
                    >
                      {year}
                    </Link>
                  ))}
                  <div className="px-4 py-1 text-xs text-gray-400 border-b border-gray-700 mt-2">By Decade</div>
                  {decades.map(decade => (
                    <Link
                      key={decade}
                      href={`/movie/decade/${decade.toLowerCase()}`}
                      className={dropdownItemClass}
                    >
                      {decade}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          {/* Search Bar */}
          <div className="w-72 md:w-80 lg:w-96 hidden md:block">
            <SearchBar />
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white p-2 rounded-md bg-slate-800 dark:bg-gray-700 hover:bg-slate-700 dark:hover:bg-gray-600 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-800 dark:bg-gray-800 p-4">
          <div className="mb-4">
            <SearchBar />
          </div>
          <div className="flex flex-col space-y-3">
            <Link 
              href="/people" 
              className="text-white font-bold hover:text-green-600 transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Actors & People
            </Link>
            
            <Link 
              href="/rankings" 
              className="text-white font-bold hover:text-green-600 transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Top Rankings
            </Link>
            
            {/* Archives Mobile */}
            <div className="border-t border-gray-700 pt-3">
              <h3 className="text-white font-bold mb-2">Archives</h3>
              <div className="grid grid-cols-3 gap-2 pl-2">
                {recentYears.map(year => (
                  <Link
                    key={year}
                    href={`/movie/year/${year}`}
                    className="text-xs text-gray-300 hover:text-white transition-colors text-center py-1"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {year}
                  </Link>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 pl-2 mt-2">
                {decades.map(decade => (
                  <Link
                    key={decade}
                    href={`/movie/decade/${decade.toLowerCase()}`}
                    className="text-xs text-gray-300 hover:text-white transition-colors text-center py-1"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {decade}
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Movies Mobile */}
            <div className="border-t border-gray-700 pt-3">
              <h3 className="text-white font-bold mb-2">Movies</h3>
              <div className="flex flex-col space-y-2 pl-4">
                <Link 
                  href="/movie/popular" 
                  className="text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Popular
                </Link>
                <Link 
                  href="/movie/now_playing" 
                  className="text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Now Playing
                </Link>
                <Link 
                  href="/movie/upcoming" 
                  className="text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Upcoming
                </Link>
                <Link 
                  href="/movie/top_rated" 
                  className="text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Top Rated
                </Link>
                
                <div className="pt-2">
                  <h4 className="text-gray-400 text-sm font-bold mb-1">Genres</h4>
                  <div className="grid grid-cols-2 gap-2 pl-2">
                    {movieGenres.map((genre) => (
                      <Link
                        key={genre.id}
                        href={`/movie/genre/${createSlug(genre.name)}`}
                        className="text-xs text-gray-300 hover:text-white transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {genre.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* TV Series Mobile */}
            <div className="border-t border-gray-700 pt-3">
              <h3 className="text-white font-bold mb-2">TV Series</h3>
              <div className="flex flex-col space-y-2 pl-4">
                <Link 
                  href="/tv-show/popular" 
                  className="text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Popular
                </Link>
                <Link 
                  href="/tv-show/airing_today" 
                  className="text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Airing Today
                </Link>
                <Link 
                  href="/tv-show/on_the_air" 
                  className="text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  On The Air
                </Link>
                <Link 
                  href="/tv-show/top_rated" 
                  className="text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Top Rated
                </Link>
                
                <div className="pt-2">
                  <h4 className="text-gray-400 text-sm font-bold mb-1">Genres</h4>
                  <div className="grid grid-cols-2 gap-2 pl-2">
                    {tvGenres.map((genre) => (
                      <Link
                        key={genre.id}
                        href={`/tv-show/genre/${createSlug(genre.name)}`}
                        className="text-xs text-gray-300 hover:text-white transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {genre.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* CSS untuk efek rainbow */}
      <style jsx>{`
        .rainbow-text {
          font-size: 1.8rem;
          background-image: linear-gradient(
            to right,
            #ff0000, #ff8000, #ffff00, #80ff00, 
            #00ff00, #00ff80, #00ffff, #0080ff, 
            #0000ff, #8000ff, #ff00ff, #ff0080
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          background-size: 300% 300%;
          animation: rainbow 4s ease infinite;
        }
        
        .rainbow-hover:hover {
          background-image: linear-gradient(
            to right,
            #ff0000, #ff8000, #ffff00, #80ff00, 
            #00ff00, #00ff80, #00ffff, #0080ff, 
            #0000ff, #8000ff, #ff00ff, #ff0080
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          background-size: 300% 300%;
          animation: rainbow 2s ease infinite;
        }
        
        @keyframes rainbow {
          0% { background-position: 0% 50% }
          50% { background-position: 100% 50% }
          100% { background-position: 0% 50% }
        }
      `}</style>
    </nav>
  );
}