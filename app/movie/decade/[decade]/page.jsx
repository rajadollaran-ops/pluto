// app/movie/decade/[decade]/page.jsx

"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaCalendar, FaFilm, FaStar, FaHistory, FaArrowLeft, FaArrowRight, FaFilter } from 'react-icons/fa';
import { getMoviesByDecade, getMovieGenres } from '../../../../lib/api';

export default function DecadeArchivePage() {
  const params = useParams();
  const decade = params.decade;
  
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [sortBy, setSortBy] = useState('popularity');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const itemsPerPage = 20;

  // Define decades
  const decades = [
    { id: '2020s', name: '2020s', start: 2020, end: 2029, color: 'from-blue-500 to-purple-600' },
    { id: '2010s', name: '2010s', start: 2010, end: 2019, color: 'from-green-500 to-blue-600' },
    { id: '2000s', name: '2000s', start: 2000, end: 2009, color: 'from-yellow-500 to-orange-600' },
    { id: '1990s', name: '1990s', start: 1990, end: 1999, color: 'from-red-500 to-pink-600' },
    { id: '1980s', name: '1980s', start: 1980, end: 1989, color: 'from-purple-500 to-indigo-600' },
    { id: '1970s', name: '1970s', start: 1970, end: 1979, color: 'from-orange-500 to-red-600' },
    { id: '1960s', name: '1960s', start: 1960, end: 1969, color: 'from-teal-500 to-green-600' },
    { id: '1950s', name: '1950s', start: 1950, end: 1959, color: 'from-indigo-500 to-purple-600' },
  ];

  const currentDecade = decades.find(d => d.id === decade);
  const isValidDecade = !!currentDecade;

  useEffect(() => {
    if (isValidDecade) {
      fetchMovies();
      fetchGenres();
    }
  }, [decade]);

  useEffect(() => {
    filterAndSortMovies();
  }, [movies, selectedGenres, sortBy]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      const moviesData = await getMoviesByDecade(decade, 1);
      setMovies(moviesData || []);
    } catch (err) {
      setError('Failed to load movies for this decade');
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
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 px-2 py-1 rounded">
            <span className="text-white text-sm">
              {new Date(movie.release_date).getFullYear()}
            </span>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-bold text-white text-lg mb-2 line-clamp-2 group-hover:text-orange-400 transition-colors">
            {movie.title}
          </h3>
          
          <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
            <span>{movie.vote_count?.toLocaleString() || 0} votes</span>
            <span>Rating: {movie.vote_average?.toFixed(1) || 'N/A'}</span>
          </div>

          {movie.overview && (
            <p className="text-gray-300 text-sm line-clamp-3">
              {movie.overview}
            </p>
          )}
        </div>
      </Link>
    </div>
  );

  const LoadingSkeleton = () => (
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
  );

  const DecadeStats = () => {
    const averageRating = movies.length > 0 
      ? movies.reduce((acc, movie) => acc + (movie.vote_average || 0), 0) / movies.length 
      : 0;

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-800 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-white mb-2">
            {movies.length.toLocaleString()}
          </div>
          <div className="text-gray-400">Total Movies</div>
        </div>
        
        <div className="bg-slate-800 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-white mb-2">
            {averageRating.toFixed(1)}
          </div>
          <div className="text-gray-400">Average Rating</div>
        </div>
        
        <div className="bg-slate-800 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-white mb-2">
            {currentDecade.start}-{currentDecade.end}
          </div>
          <div className="text-gray-400">Decade Range</div>
        </div>
      </div>
    );
  };

  if (!isValidDecade) {
    return (
      <div className="min-h-screen bg-slate-900 py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl text-white mb-4">Decade Not Found</h1>
          <p className="text-gray-400 mb-6">Please select a valid decade</p>
          <Link href="/movie/decade/2020s" className="text-orange-400 hover:text-orange-300">
            Browse Current Decade
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
            <div className={`p-3 bg-gradient-to-br ${currentDecade.color} rounded-full`}>
              <FaHistory className="text-2xl text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              {currentDecade.name} Movies
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Relive the cinema of the {currentDecade.name} - {movies.length.toLocaleString()} movies from {currentDecade.start} to {currentDecade.end}
          </p>
        </div>

        {/* Decade Navigation */}
        <div className="flex overflow-x-auto gap-2 mb-8 pb-4">
          {decades.map(dec => (
            <Link
              key={dec.id}
              href={`/movie/decade/${dec.id}`}
              className={`flex-shrink-0 px-6 py-3 rounded-lg font-semibold transition-all ${
                dec.id === decade
                  ? `bg-gradient-to-r ${dec.color} text-white shadow-lg`
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
              }`}
            >
              {dec.name}
            </Link>
          ))}
        </div>

        {/* Decade Stats */}
        {!loading && movies.length > 0 && <DecadeStats />}

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
                {genres.slice(0, 8).map(genre => (
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
            <p className="text-gray-400 text-sm">
              {currentDecade.start} - {currentDecade.end}
              {selectedGenres.length > 0 && ` • Filtered by ${selectedGenres.length} genre${selectedGenres.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          
          <div className="text-gray-400">
            Page {currentPage} of {totalPages}
          </div>
        </div>

        {/* Movies Grid */}
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-400 text-xl mb-4">{error}</div>
            <button
              onClick={fetchMovies}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredMovies.length === 0 ? (
          <div className="text-center py-12">
            <FaFilm className="text-6xl text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl text-white mb-2">No movies found</h3>
            <p className="text-gray-400 mb-6">
              {selectedGenres.length > 0 
                ? 'Try adjusting your genre filters'
                : 'No movies available for this decade'
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
              Discover movies from different time periods and categories.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/movie/year/2024" 
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                2024 Movies
              </Link>
              <Link 
                href="/movie/popular" 
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold"
              >
                Popular Movies
              </Link>
              <Link 
                href="/movie/top_rated" 
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
              >
                Top Rated
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}