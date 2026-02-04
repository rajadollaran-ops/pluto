// app/movie/genre/[genreName]/page.jsx

import { notFound } from 'next/navigation';
import { getMoviesByGenre, getMovieGenres } from '../../../../lib/api';
import MovieList from '../../../../components/MovieList';

export async function generateMetadata({ params }) {
  // Await params sebelum mengakses propertinya
  const { genreName } = await params;

  const genres = await getMovieGenres();

  // Mencari genre berdasarkan nama (slug) dari URL
  const genre = genres.find(g => g.name.toLowerCase().replace(/\s/g, '-') === genreName);
  const title = genre?.name || 'Unknown';

  const pageUrl = `https://fmovieswatch.netlify.app/movie/genre/${genreName}`;
  const imageUrl = 'https://live.staticflickr.com/65535/54796154293_fa66ff7825_b.jpg';

  return {
    title: `FMovies - ${title} Movies`,
    description: `Find and watch the best ${title} movies for free on FMovies.`,
    openGraph: {
      title: `FMovies - ${title} Movies`,
      description: `Find and watch the best ${title} movies for free on FMovies.`,
      url: pageUrl,
      siteName: 'FMovies',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${title} genre movie poster`,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@WatchStream123',
      creator: '@WatchStream123',
      title: `FMovies - ${title} Movies`,
      description: `Find and watch the best ${title} movies for free on FMovies.`,
      images: [imageUrl],
    },
    other: {
      'fb:app_id': '100074345305108',
    },
  };
}

export default async function MoviesByGenrePage({ params }) {
  // Await params sebelum mengakses propertinya
  const { genreName } = await params;

  const genres = await getMovieGenres();

  // Mencari ID genre berdasarkan nama (slug) dari URL
  const genre = genres.find(g => g.name.toLowerCase().replace(/\s/g, '-') === genreName);
  const genreId = genre?.id;
  const genreTitle = genre?.name || 'Unknown';

  if (!genreId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-white">Genre not found.</p>
      </div>
    );
  }

  const movies = await getMoviesByGenre(genreId);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-white">
        {genreTitle} Movies
      </h1>
      {movies && movies.length > 0 ? (
        <MovieList movies={movies} />
      ) : (
        <p className="text-center text-white">No movies available in this genre.</p>
      )}
    </div>
  );
}