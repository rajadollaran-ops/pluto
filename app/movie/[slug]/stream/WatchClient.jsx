'use client';

import { useState } from 'react';
import { PlayCircleIcon } from 'lucide-react';
import { notFound } from 'next/navigation';

// ===================================
// UTILITY FUNCTIONS
// ===================================
// Utility function to create a slug from a movie title
const createSlug = (item) => {
    const title = item.title;
    if (!title) return '';
    const baseSlug = title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim();
    
    let year = '';
    if (item.release_date) {
        year = item.release_date.substring(0, 4);
    }
    return `${baseSlug}-${year}`;
};

// Component to display a movie/TV show card
function MediaCard({ media, mediaType }) {
    if (!media) {
        return null;
    }

    const POSTER_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';
    // Use the mediaType passed from the parent component, or use the type from the media object
    const cardMediaType = mediaType || media.media_type;
    const mediaTitle = media.title || media.name;
    
    // Get the release year
    const releaseYear = media.release_date ? media.release_date.substring(0, 4) : 'N/A';

    const posterPath = media.poster_path && media.poster_path !== ""
        ? `${POSTER_IMAGE_URL}${media.poster_path}`
        : 'https://placehold.co/500x750?text=No+Image';

    // Create the new URL format with the title and year slug
    const mediaSlug = createSlug(media);
    const targetUrl = `/${cardMediaType}/${mediaSlug}`;

    // Check if the source is a placeholder URL
    const isPlaceholder = posterPath.includes('placehold.co');

    return (
        <a href={targetUrl}>
            <div className="relative rounded-xl overflow-hidden shadow-md transition-transform duration-300 transform hover:scale-105 hover:shadow-cyan-400/50 cursor-pointer">
                <img
                    src={posterPath}
                    alt={mediaTitle}
                    width={500}
                    height={750}
                    className="w-full h-auto object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gray-900 bg-opacity-75 p-2">
                    <p className="text-sm font-semibold text-center truncate">{mediaTitle}</p>
                    <p className="text-xs text-center text-gray-400">{releaseYear}</p>
                </div>
            </div>
        </a>
    );
}

// ===================================
// CLIENT COMPONENT
// ===================================
// This is a client component for interactive features
export default function WatchClient({ mediaType, id, initialDetails, initialSimilarMedia }) {
    
    // Handle the case where initialDetails is undefined, which can cause the TypeError
    if (!initialDetails) {
        return <div>Error: Movie details not found.</div>;
    }

    const [streamUrl, setStreamUrl] = useState('');
    const [title, setTitle] = useState(initialDetails.title || initialDetails.name);
    const [similarMedia, setSimilarMedia] = useState(initialSimilarMedia?.results || initialSimilarMedia || []);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    // Function to fetch data from the TMDb keyword API
    const getEroticMovies = async (page = 1) => {
        const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY; 
        const keywordId = 190370;
        const url = `https://api.themoviedb.org/3/keyword/${keywordId}/movies?api_key=${API_KEY}&page=${page}`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch erotic movies data');
            }
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error(error);
            return [];
        }
    };
    
    const loadMoreMovies = async () => {
        setIsLoading(true);
        const nextPage = page + 1;
        const newMovies = await getEroticMovies(nextPage);
        setSimilarMedia(prevMovies => [...prevMovies, ...newMovies]);
        setPage(nextPage);
        setIsLoading(false);
    };

    const STREAM_BASE_URL = 'https://vidsrc.me/embed';
    const STREAM_BASE_URL_2 = 'https://vidsrc.to/embed';
    const POSTER_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';
    const BACKDROP_IMAGE_URL = 'https://image.tmdb.org/t/p/original';

    const handleStream = (streamId, streamProvider) => {
        const streamPath = mediaType === 'movie' ? 'movie' : 'tv';
        if (streamProvider === 'stream1') {
            setStreamUrl(`${STREAM_BASE_URL}/${streamPath}/${streamId}`);
        } else if (streamProvider === 'stream2') {
            setStreamUrl(`${STREAM_BASE_URL_2}/${streamPath}/${streamId}`);
        }
    };

    return (
        <main className="min-h-screen bg-gray-950 text-white font-inter">
            <div className="container mx-auto px-4 py-8 relative z-10">
                {/* Backdrop Section */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    {/* The backdrop will now always be shown if available, for both movies and TV shows. */}
                    {initialDetails.backdrop_path && (
                        <img
                            src={`${BACKDROP_IMAGE_URL}${initialDetails.backdrop_path}`}
                            alt={`${title} backdrop`}
                            className="w-full h-full object-cover absolute opacity-30"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent"></div>
                </div>

                {/* Main Content */}
                <div className="relative z-10">
                    {/* Movie/TV Show Details Section */}
                    <div className="flex flex-col md:flex-row items-start md:space-x-8 mb-8">
                        {/* Poster */}
                        {initialDetails.poster_path && (
                            <div className="w-full md:w-1/3 flex-shrink-0 mb-6 md:mb-0">
                                <img
                                    src={`${POSTER_IMAGE_URL}${initialDetails.poster_path}`}
                                    alt={`${title} poster`}
                                    width={500}
                                    height={750}
                                    className="w-full h-auto rounded-xl shadow-2xl"
                                />
                                {/* Streaming Buttons below the poster, not centered */}
                                <div className="mt-4">
                                    <h3 className="text-lg font-semibold mb-2">Select Stream Source</h3>
                                    <div className="flex space-x-4">
                                        <button
                                            onClick={() => handleStream(id, 'stream1')}
                                            className="bg-green-700 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-transform transform hover:scale-105 shadow-lg"
                                        >
                                            Stream 1
                                        </button>
                                        <button
                                            onClick={() => handleStream(id, 'stream2')}
                                            className="bg-red-700 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-transform transform hover:scale-105 shadow-lg"
                                        >
                                            Stream 2
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Synopsis */}
                        <div className="md:w-2/3">
                            <h1 className="text-3xl font-bold mb-4 md:mb-0">{title}</h1>
                            <h2 className="text-xl md:text-2xl font-bold mb-2">Synopsis</h2>
                            <p className="text-sm md:text-base text-gray-300 mb-6">
                                {initialDetails.overview || 'Synopsis not available.'}
                            </p>
                        </div>
                    </div>

                    {/* Video Player Section */}
                    <div className="w-full aspect-video rounded-lg overflow-hidden shadow-2xl bg-gray-900 relative">
                        <div className="w-full h-full">
                            {streamUrl ? (
                                <iframe
                                    src={streamUrl}
                                    title={`${title} Player`}
                                    allowFullScreen
                                    className="absolute top-0 left-0 w-full h-full border-0"
                                ></iframe>
                            ) : (
                                <div className="absolute top-0 left-0 flex flex-col items-center justify-center w-full h-full text-gray-400 bg-gray-900">
                                    <PlayCircleIcon size={64} className="mb-4 text-gray-600" />
                                    Select one of the Stream 1 or Stream 2 buttons
                                </div>
                            )}
                        </div>
                    </div>

                    {/* "You Might Also Like" Section */}
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                            {similarMedia.map((media) => (
                                <MediaCard key={media.id} media={media} mediaType={mediaType} />
                            ))}
                        </div>
                        {/* Load More Button */}
                        <div className="flex justify-center mt-8">
                            <button
                                onClick={loadMoreMovies}
                                disabled={isLoading}
                                className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-red-700 transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Loading...' : 'Load More'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
