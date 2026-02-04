// app/people/page.jsx - PERBAIKI BAGIAN DATA FETCHING
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaSearch, FaUser, FaFilm, FaTv, FaStar, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { searchPeople, getPopularPeople } from '../../lib/api';

export default function PeoplePage() {
  const [people, setPeople] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPopularPeople();
  }, [currentPage]);

  const fetchPopularPeople = async () => {
    try {
      setLoading(true);
      const data = await getPopularPeople(currentPage);
      console.log('Popular People Data:', data); // DEBUG: lihat struktur data
      
      // PERBAIKAN: Handle berbagai struktur data API
      if (data && data.results) {
        setPeople(data.results);
      } else if (Array.isArray(data)) {
        setPeople(data);
      } else {
        setPeople([]);
      }
      
      setTotalPages(Math.min(10, data?.total_pages || 1));
    } catch (error) {
      console.error('Error fetching popular people:', error);
      setPeople([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      const results = await searchPeople(searchQuery, 1);
      console.log('Search Results:', results); // DEBUG: lihat struktur data
      
      // PERBAIKAN: Handle berbagai struktur data API
      if (results && results.results) {
        setSearchResults(results.results);
      } else if (Array.isArray(results)) {
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching people:', error);
      setSearchResults([]);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
    setCurrentPage(1); // Reset ke page 1 saat clear search
  };

  // PERBAIKAN: Handle displayed people dengan benar
  const displayedPeople = isSearching ? searchResults : people;

  // PersonCard component (sama seperti sebelumnya, tanpa overlay)
  const PersonCard = ({ person }) => (
    <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 group">
      <Link href={`/person/${person.id}`}>
        <div className="relative aspect-[3/4] bg-gray-700">
          {person.profile_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
              alt={person.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-600">
              <FaUser className="text-4xl text-gray-400" />
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-bold text-white text-lg mb-2 line-clamp-2 group-hover:text-orange-400 transition-colors">
            {person.name || 'Unknown Name'}
          </h3>
          
          {person.known_for_department && (
            <p className="text-gray-400 text-sm mb-2">
              {person.known_for_department}
            </p>
          )}
          
          {person.known_for && person.known_for.length > 0 && (
            <div className="mt-3">
              <p className="text-gray-500 text-xs uppercase font-semibold mb-1">
                Known For
              </p>
              <div className="space-y-1">
                {person.known_for.slice(0, 3).map((work, index) => (
                  <p key={index} className="text-gray-300 text-sm line-clamp-1">
                    {work?.title || work?.name || 'Unknown Title'}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </Link>
    </div>
  );

  // ... sisa kode tetap sama ...

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Actors & People
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Discover your favorite actors, directors, and crew members from the world of cinema and television.
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-8">
          <form onSubmit={handleSearch} className="relative">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search actors, directors, crew..."
                className="flex-1 px-4 py-3 bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
              >
                <FaSearch /> Search
              </button>
            </div>
          </form>
          
          {isSearching && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-gray-400">
                {searchResults.length} results for "{searchQuery}"
              </p>
              <button
                onClick={clearSearch}
                className="text-orange-400 hover:text-orange-300 transition-colors"
              >
                Clear search
              </button>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              {isSearching ? 'Search Results' : 'Popular Actors'}
            </h2>
            {!isSearching && (
              <div className="flex items-center gap-2 text-gray-400">
                <FaUser className="text-orange-400" />
                <span>Page {currentPage}</span>
              </div>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="bg-slate-800 rounded-lg shadow-lg overflow-hidden animate-pulse">
                  <div className="aspect-[3/4] bg-gray-700" />
                  <div className="p-4">
                    <div className="h-4 bg-gray-700 rounded mb-2" />
                    <div className="h-3 bg-gray-700 rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : displayedPeople.length === 0 ? (
            <div className="text-center py-12">
              <FaUser className="text-6xl text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl text-white mb-2">No actors found</h3>
              <p className="text-gray-400 mb-4">
                {isSearching 
                  ? 'Try adjusting your search terms'
                  : 'Unable to load popular actors'
                }
              </p>
              {!isSearching && (
                <button
                  onClick={fetchPopularPeople}
                  className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Try Again
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {displayedPeople.map((person) => (
                  <PersonCard key={person.id} person={person} />
                ))}
              </div>

              {/* Pagination - Only show for popular people, not search results */}
              {!isSearching && totalPages > 1 && (
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
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}