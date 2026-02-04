// app/search/page.jsx

"use client";

import { searchMoviesAndTv } from '../../lib/api.jsx';
import MovieList from '../../components/MovieList.jsx';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useState, useEffect, use } from 'react'; // Import 'use'

export default function SearchPage({ searchParams }) {
  // **Unwrap searchParams using React.use()**
  const unwrappedSearchParams = use(searchParams); 
  const query = unwrappedSearchParams.query;

  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (!query) return;

    const fetchInitialData = async () => {
      setIsLoading(true);
      // Assuming searchMoviesAndTv is correctly implemented to fetch data
      const initialMovies = await searchMoviesAndTv(query, 1); 
      setMovies(initialMovies);
      setIsLoading(false);
      setHasMore(initialMovies.length > 0);
    };

    fetchInitialData();
  }, [query]);

  const handleLoadMore = async () => {
    setIsLoading(true);
    const nextPage = page + 1;
    // Assuming searchMoviesAndTv is correctly implemented to fetch data
    const newMovies = await searchMoviesAndTv(query, nextPage); 
    setMovies(prevMovies => [...prevMovies, ...newMovies]);
    setPage(nextPage);
    setIsLoading(false);
    setHasMore(newMovies.length > 0);
  };

  if (!query) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white p-8 bg-slate-900">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Search Movies</h1>
        <p className="text-lg text-gray-400 text-center mb-8">
          Please enter the name of the movie you want to search for in the search box.
        </p>
        <Link href="/">
          <span className="text-blue-400 hover:text-blue-600 transition-colors duration-300">
            Back to Home
          </span>
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-slate-900 text-white">
      <h1 className="text-4xl font-bold mb-2 text-center">
        Search Results for &quot;{query}&quot;
      </h1>
      {movies.length > 0 && (
        <p className="text-center text-gray-400 mb-8">
          Found {movies.length} results.
        </p>
      )}

      <MovieList movies={movies} />

      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="px-6 py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </main>
  );
}