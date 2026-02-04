import { notFound } from 'next/navigation';
import { getMovieById, getMovieByTitle, searchMoviesAndTv } from '../../../../lib/api'; 
import WatchClient from './WatchClient';

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

// Function to fetch data from the TMDb keyword API
const getEroticMovies = async (page = 1) => {
    const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY; 
    const keywordId = 445;

    const url = `https://api.themoviedb.org/3/keyword/${keywordId}/movies?api_key=${API_KEY}&page=${page}`;
    console.log('Fetching from URL:', url); // Log the URL being fetched

    const response = await fetch(url);

    // Add logs for response status and error text
    console.log('Response status:', response.status);
    if (!response.ok) {
        console.error('API Error:', await response.text());
        throw new Error('Failed to fetch erotic movies data');
    }

    const data = await response.json();
    return data.results; // The API returns an array of movies in the 'results' property
};

// ===================================
// MAIN SERVER COMPONENT
// ===================================
// This is a server component that fetches data and passes it to the client component.
export default async function StreamPage({ params }) {
    const { slug } = await params;

    let movieDetails = null;
    const id = parseInt(slug, 10);
  
    // Separate the slug into title and year, if a year exists
    const slugParts = slug.split('-');
    const lastPart = slugParts[slugParts.length - 1];
    const slugYear = /^\d{4}$/.test(lastPart) ? lastPart : null;
    const slugTitle = slugYear ? slugParts.slice(0, -1).join('-') : slug;
  
    // Check if the slug is a numeric ID
    if (!isNaN(id) && slugParts.length === 1) {
      movieDetails = await getMovieById(id);
    } else {
      // Search for the movie based on the title part of the slug
      const searchResults = await searchMoviesAndTv(slugTitle.replace(/-/g, ' '));
      
      let matchingMovie = searchResults.find(item => {
        const itemTitle = item.title?.toLowerCase().replace(/[^a-z0-9\s]/g, '');
        if (!itemTitle) {
          return false;
        }
  
        const slugTitleClean = slugTitle.toLowerCase().replace(/-/g, '').replace(/[^a-z0-9\s]/g, '');
  
        const titleMatch = itemTitle === slugTitleClean ||
                           itemTitle.replace(/\s/g, '') === slugTitleClean;
  
        const yearMatch = !slugYear || (item.release_date && item.release_date.substring(0, 4) === slugYear);
        
        return item.media_type === 'movie' && titleMatch && yearMatch;
      });
  
      if (matchingMovie) {
        movieDetails = await getMovieById(matchingMovie.id);
      }
    }

    // If movie details are still not found, show a 404 page
    if (!movieDetails) {
        notFound();
    }
    
    // Fetch similar movies from the keyword endpoint instead of the original movie ID
    // We start with page 1
    const similarMovies = await getEroticMovies(1);

    // Pass the fetched data and the loading function to the client component
    return (
        <WatchClient
            mediaType="movie"
            id={movieDetails.id}
            initialDetails={movieDetails}
            initialSimilarMedia={similarMovies}
        />
    );
}
