// app/person/[id]/page.jsx

"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FaFilm, FaTv, FaStar, FaCalendar, FaMapMarkerAlt, FaUser } from 'react-icons/fa';
import { getPersonById, getPersonMovieCredits, getPersonTvCredits } from '../../../lib/api';

export default function PersonDetailPage() {
  const params = useParams();
  const personId = params.id;
  
  const [person, setPerson] = useState(null);
  const [movieCredits, setMovieCredits] = useState(null);
  const [tvCredits, setTvCredits] = useState(null);
  const [activeTab, setActiveTab] = useState('movies');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPersonData();
  }, [personId]);

  const fetchPersonData = async () => {
    try {
      setLoading(true);
      const [personData, movieData, tvData] = await Promise.all([
        getPersonById(personId),
        getPersonMovieCredits(personId),
        getPersonTvCredits(personId)
      ]);
      
      setPerson(personData);
      setMovieCredits(movieData);
      setTvCredits(tvData);
    } catch (error) {
      console.error('Error fetching person data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/3 lg:w-1/4">
                <div className="aspect-[3/4] bg-gray-700 rounded-lg" />
              </div>
              <div className="flex-1">
                <div className="h-8 bg-gray-700 rounded w-3/4 mb-4" />
                <div className="h-4 bg-gray-700 rounded w-1/2 mb-2" />
                <div className="h-4 bg-gray-700 rounded w-2/3 mb-6" />
                <div className="h-24 bg-gray-700 rounded mb-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="min-h-screen bg-slate-900 py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl text-white mb-4">Person Not Found</h1>
          <Link href="/people" className="text-orange-400 hover:text-orange-300">
            Back to Actors
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAge = (birthday, deathday) => {
    if (!birthday) return null;
    
    const birth = new Date(birthday);
    const end = deathday ? new Date(deathday) : new Date();
    
    let age = end.getFullYear() - birth.getFullYear();
    const monthDiff = end.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && end.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const CreditItem = ({ credit, type = 'movie' }) => (
    <div className="bg-slate-800 rounded-lg p-4 hover:bg-slate-700 transition-colors">
      <div className="flex gap-4">
        {credit.poster_path ? (
          <div className="relative w-16 h-24 flex-shrink-0">
            <Image
              src={`https://image.tmdb.org/t/p/w200${credit.poster_path}`}
              alt={credit.title || credit.name}
              fill
              className="object-cover rounded"
              sizes="64px"
            />
          </div>
        ) : (
          <div className="w-16 h-24 bg-gray-700 rounded flex items-center justify-center flex-shrink-0">
            <FaFilm className="text-gray-500" />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <Link 
            href={type === 'movie' ? `/movie/${credit.id}` : `/tv-show/${credit.id}`}
            className="font-semibold text-white hover:text-orange-400 transition-colors line-clamp-1"
          >
            {credit.title || credit.name}
          </Link>
          
          {credit.character && (
            <p className="text-gray-400 text-sm mt-1 line-clamp-1">
              as {credit.character}
            </p>
          )}
          
          {credit.job && (
            <p className="text-gray-400 text-sm mt-1 line-clamp-1">
              {credit.job}
            </p>
          )}
          
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            {credit.release_date && (
              <span>{new Date(credit.release_date).getFullYear()}</span>
            )}
            {credit.vote_average > 0 && (
              <div className="flex items-center gap-1">
                <FaStar className="text-yellow-400 text-xs" />
                <span>{credit.vote_average.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link 
          href="/people" 
          className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 mb-6 transition-colors"
        >
          ← Back to Actors
        </Link>

        {/* Person Header */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {/* Profile Image */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            {person.profile_path ? (
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
                <Image
                  src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
                  alt={person.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                  priority
                />
              </div>
            ) : (
              <div className="aspect-[3/4] bg-gray-700 rounded-lg flex items-center justify-center">
                <FaUser className="text-6xl text-gray-500" />
              </div>
            )}
          </div>

          {/* Person Info */}
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {person.name}
            </h1>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {person.known_for_department && (
                <div className="flex items-center gap-2">
                  <FaUser className="text-orange-400" />
                  <span className="text-gray-300">{person.known_for_department}</span>
                </div>
              )}
              
              {person.birthday && (
                <div className="flex items-center gap-2">
                  <FaCalendar className="text-orange-400" />
                  <span className="text-gray-300">
                    {formatDate(person.birthday)}
                    {calculateAge(person.birthday, person.deathday) && (
                      <span className="text-gray-500 ml-1">
                        (Age {calculateAge(person.birthday, person.deathday)})
                      </span>
                    )}
                  </span>
                </div>
              )}
              
              {person.place_of_birth && (
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-orange-400" />
                  <span className="text-gray-300">{person.place_of_birth}</span>
                </div>
              )}
              
              {person.deathday && (
                <div className="flex items-center gap-2">
                  <FaCalendar className="text-red-400" />
                  <span className="text-gray-300">
                    Died: {formatDate(person.deathday)}
                  </span>
                </div>
              )}
            </div>

            {/* Biography */}
            {person.biography && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-3">Biography</h2>
                <p className="text-gray-300 leading-relaxed line-clamp-6 hover:line-clamp-none transition-all cursor-pointer">
                  {person.biography}
                </p>
              </div>
            )}

            {/* Popularity */}
            {person.popularity && (
              <div className="flex items-center gap-2">
                <FaStar className="text-yellow-400" />
                <span className="text-gray-300">Popularity: {person.popularity.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Filmography Tabs */}
        <div className="mb-6">
          <div className="flex border-b border-slate-700">
            <button
              onClick={() => setActiveTab('movies')}
              className={`px-6 py-3 font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'movies'
                  ? 'border-orange-400 text-orange-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <FaFilm /> Movies ({movieCredits?.cast?.length + movieCredits?.crew?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('tv')}
              className={`px-6 py-3 font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'tv'
                  ? 'border-orange-400 text-orange-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <FaTv /> TV Series ({tvCredits?.cast?.length + tvCredits?.crew?.length || 0})
            </button>
          </div>
        </div>

        {/* Filmography Content */}
        <div>
          {activeTab === 'movies' && (
            <div>
              {/* Cast */}
              {movieCredits?.cast && movieCredits.cast.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4">Acting Roles</h3>
                  <div className="grid gap-4">
                    {movieCredits.cast
                      .sort((a, b) => new Date(b.release_date || '1900') - new Date(a.release_date || '1900'))
                      .map((credit) => (
                        <CreditItem key={`cast-${credit.id}-${credit.character}`} credit={credit} type="movie" />
                      ))}
                  </div>
                </div>
              )}

              {/* Crew */}
              {movieCredits?.crew && movieCredits.crew.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Crew Roles</h3>
                  <div className="grid gap-4">
                    {movieCredits.crew
                      .sort((a, b) => new Date(b.release_date || '1900') - new Date(a.release_date || '1900'))
                      .map((credit) => (
                        <CreditItem key={`crew-${credit.id}-${credit.job}`} credit={credit} type="movie" />
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'tv' && (
            <div>
              {/* TV Cast */}
              {tvCredits?.cast && tvCredits.cast.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4">Acting Roles</h3>
                  <div className="grid gap-4">
                    {tvCredits.cast
                      .sort((a, b) => new Date(b.first_air_date || '1900') - new Date(a.first_air_date || '1900'))
                      .map((credit) => (
                        <CreditItem key={`tv-cast-${credit.id}-${credit.character}`} credit={credit} type="tv" />
                      ))}
                  </div>
                </div>
              )}

              {/* TV Crew */}
              {tvCredits?.crew && tvCredits.crew.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Crew Roles</h3>
                  <div className="grid gap-4">
                    {tvCredits.crew
                      .sort((a, b) => new Date(b.first_air_date || '1900') - new Date(a.first_air_date || '1900'))
                      .map((credit) => (
                        <CreditItem key={`tv-crew-${credit.id}-${credit.job}`} credit={credit} type="tv" />
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .line-clamp-1 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }
        .line-clamp-6 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 6;
        }
      `}</style>
    </div>
  );
}