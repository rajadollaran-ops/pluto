// app/movie/year/[year]/page.jsx

"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaCalendar, FaFilm, FaStar, FaArrowLeft, FaArrowRight, FaFilter } from 'react-icons/fa';
import { getMoviesByYear, getMovieGenres } from '../../../../lib/api';

export default function YearArchivePage() {
  const params = useParams();
  const year = params.year;
  
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [sortBy, setSortBy] = useState('popularity');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  
  const itemsPerPage = 20;
  const currentYear = new Date().getFullYear();
  const isValidYear = year >= 1900 && year <= currentYear;

  // Generate year navigation
  const years = Array.from({ length: currentYear - 1899 }, (_, i) => currentYear - i);
  const currentYearIndex = years.findIndex(y => y == year);

  useEffect(() => {
    if (isValidYear) {
      fetchMovies();
      fetchGenres();
    }
  }, [year]);

  useEffect(() => {
    filterAndSortMovies();
  }, [movies, selectedGenres, sortBy]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const moviesData = await getMoviesByYear(parseInt(year), 1);
      setMovies(moviesData || []);
    } catch (err) {
      console.error('Error fetching movies:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGenres = async () => {
    try {
      const genresData = await getMovieGenres();
      setGenres(genresData || []);
    } catch (err) {
      console.error('Error fetching genres:', err);
    }
  };

  const filterAndSortMovies = () => {
    let filtered = [...movies];

    // Filter by selected genres
    if (selectedGenres.length > 0) {
      filtered = filtered.filter(movie => 
        movie.genre_ids && selectedGenres.some(genreId => 
          movie.genre_ids.includes(genreId)
        )
      );
    }

    // Sort movies
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.vote_average || 0) - (a.vote_average || 0);
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
        case 'release':
          return new Date(b.release_date || 0) - new Date(a.release_date || 0);
        case 'popularity':
        default:
          return (b.popularity || 0) - (a.popularity || 0);
      }
    });

    setFilteredMovies(filtered);
    setCurrentPage(1);
  };

  const toggleGenre = (genreId) => {
    setSelectedGenres(prev =>
      prev.includes(genreId)
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    );
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setSortBy('popularity');
  };

  const getDisplayedMovies = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredMovies.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);

  const Pagination = () => (
    <div className="flex justify-center items-center space-x-4 mt-8">
      <button
        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
        disabled={currentPage === 1}
        className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors"
      >
        <FaArrowLeft /> Previous
      </button>
      
      <span className="text-gray-300">
        Page {currentPage} of {totalPages}
      </span>
      
      <button
        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
        disabled={currentPage === totalPages}
        className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors"
      >
        Next <FaArrowRight />
      </button>
    </div>
  );

  const MovieCard = ({ movie }) => (
    <div className="bg-slate-800 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 group">
      <Link href={`/movie/${movie.id}`}>
        <div className="relative aspect-[2/3] bg-gray-700">
          {movie.poster_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-600">
              <FaFilm className="text-4xl text-gray-400" />
            </div>
          )}
          <div className="absolute top-2 right-2 bg-black bg-opacity-70 px-2 py-1 rounded">
            <div className="flex items-center gap-1 text-white text-sm">
              <FaStar className="text-yellow-400" />
              <span>{movie.vote_average?.toFixed(1) || 'N/A'}</span>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-bold text-white text-lg mb-2 line-clamp-2 group-hover:text-orange-400 transition-colors">
            {movie.title}
          </h3>
          
          <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
            <span>{new Date(movie.release_date).getFullYear()}</span>
            <span>{movie.vote_count?.toLocaleString() || 0} votes</span>
          </div>

          {movie.overview && (
            <p className="text-gray-300 text-sm line-clamp-3 mb-3">
              {movie.overview}
            </p>
          )}

          {movie.genre_ids && (
            <div className="flex flex-wrap gap-1">
              {movie.genre_ids.slice(0, 3).map(genreId => {
                const genre = genres.find(g => g.id === genreId);
                return genre ? (
                  <span key={genre.id} className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded text-xs">
                    {genre.name}
                  </span>
                ) : null;
              })}
            </div>
          )}
        </div>
      </Link>
    </div>
  );

  if (!isValidYear) {
    return (
      <div className="min-h-screen bg-slate-900 py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl text-white mb-4">Invalid Year</h1>
          <p className="text-gray-400 mb-6">Please select a valid year between 1900 and {currentYear}</p>
          <Link href="/movie/year/2024" className="text-orange-400 hover:text-orange-300">
            Browse Current Year
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
              <FaCalendar className="text-2xl text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              {year} Movies
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Explore {movies.length.toLocaleString()} movies released in {year}
          </p>
        </div>

        {/* Year Navigation */}
        <div className="flex items-center justify-between mb-8">
          {currentYearIndex > 0 && (
            <Link 
              href={`/movie/year/${years[currentYearIndex - 1]}`}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              <FaArrowLeft /> {years[currentYearIndex - 1]}
            </Link>
          )}
          
          <div className="flex-1 text-center">
            <div className="inline-flex items-center gap-4 bg-slate-800 px-6 py-3 rounded-lg">
              {years.slice(
                Math.max(0, currentYearIndex - 2),
                Math.min(years.length, currentYearIndex + 3)
              ).map(y => (
                <Link
                  key={y}
                  href={`/movie/year/${y}`}
                  className={`px-3 py-1 rounded transition-colors ${
                    y == year
                      ? 'bg-orange-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {y}
                </Link>
              ))}
            </div>
          </div>

          {currentYearIndex < years.length - 1 && (
            <Link 
              href={`/movie/year/${years[currentYearIndex + 1]}`}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              {years[currentYearIndex + 1]} <FaArrowRight />
            </Link>
          )}
        </div>

        {/* Filters */}
        <div className="bg-slate-800 rounded-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Genre Filter */}
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <FaFilter className="text-orange-400" />
                Filter by Genre
              </h3>
              <div className="flex flex-wrap gap-2">
                {genres.slice(0, 10).map(genre => (
                  <button
                    key={genre.id}
                    onClick={() => toggleGenre(genre.id)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedGenres.includes(genre.id)
                        ? 'bg-orange-600 text-white'
                        : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    }`}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div className="lg:w-64">
              <h3 className="text-white font-semibold mb-3">Sort By</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-orange-500 focus:outline-none"
              >
                <option value="popularity">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="title">Title A-Z</option>
                <option value="release">Release Date</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="lg:w-auto flex items-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {filteredMovies.length.toLocaleString()} Movies Found
            </h2>
            {selectedGenres.length > 0 && (
              <p className="text-gray-400 text-sm">
                Filtered by {selectedGenres.length} genre{selectedGenres.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          
          <div className="text-gray-400">
            Page {currentPage} of {totalPages}
          </div>
        </div>

        {/* Movies Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array.from({ length: 20 }).map((_, index) => (
              <div key={index} className="bg-slate-800 rounded-lg overflow-hidden animate-pulse">
                <div className="aspect-[2/3] bg-gray-700" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-700 rounded" />
                  <div className="h-3 bg-gray-700 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredMovies.length === 0 ? (
          <div className="text-center py-12">
            <FaFilm className="text-6xl text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl text-white mb-2">No movies found</h3>
            <p className="text-gray-400 mb-6">
              {selectedGenres.length > 0 
                ? 'Try adjusting your genre filters'
                : 'No movies available for this year'
              }
            </p>
            {selectedGenres.length > 0 && (
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {getDisplayedMovies().map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && <Pagination />}
          </>
        )}

        {/* Quick Links */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Explore More Movie Archives
            </h3>
            <p className="text-gray-400 mb-6">
              Discover movies from different decades and time periods.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/movie/decade/2020s" 
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                2020s Movies
              </Link>
              <Link 
                href="/movie/decade/2010s" 
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
              >
                2010s Movies
              </Link>
              <Link 
                href="/movie/popular" 
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold"
              >
                Popular Movies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}