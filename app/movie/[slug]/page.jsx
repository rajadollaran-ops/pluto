// app/movie/[slug]/page.jsx
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { FaYoutube, FaUserCircle, FaStar, FaInfoCircle } from 'react-icons/fa';
import {
  getMovieById,
  getMovieVideos,
  getMovieCredits,
  getMovieReviews,
  searchMoviesAndTv,
  getSimilarMovies,
  getMoviesByCategory,
  getMovieGenres,
} from '../../../lib/api';
import MovieList from '../../../components/MovieList';
import TvSeriesList from '../../../components/TvSeriesList';

const CATEGORIES = ['now_playing', 'popular', 'top_rated', 'upcoming'];

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

// --- BAGIAN METADATA API ---
export async function generateMetadata({ params }) {
  const { slug } = await params; // PERBAIKAN DI SINI
  let movieData = null;

  // Cek jika slug adalah kategori
  if (CATEGORIES.includes(slug)) {
    const title = slug.replace(/_/g, ' ').toUpperCase();
    return {
      title: `FMovies - ${title} Movies`,
      description: `Explore the ${title} movies collection on FMovies.`,
    };
  }

  // Cek jika slug adalah genre (contoh: "genre-12")
  const genreMatch = slug.match(/^genre-(\d+)$/);
  if (genreMatch) {
    const genreId = genreMatch[1];
    const genres = await getMovieGenres();
    const genreName = genres.find(g => g.id == genreId)?.name || 'Unknown';
    return {
      title: `FMovies - ${genreName} Movies`,
      description: `Discover ${genreName} movies on FMovies.`,
    };
  }

  // Logika untuk halaman detail film
  const id = parseInt(slug, 10);
  const slugParts = slug.split('-');
  const lastPart = slugParts[slugParts.length - 1];
  const slugYear = /^\d{4}$/.test(lastPart) ? lastPart : null;
  const slugTitle = slugYear ? slugParts.slice(0, -1).join('-') : slug;

  if (!isNaN(id) && slugParts.length === 1) {
    movieData = await getMovieById(id);
  } else {
    const searchResults = await searchMoviesAndTv(slugTitle.replace(/-/g, ' '));
    let matchingMovie = searchResults.find(item => {
      const itemName = item.title?.toLowerCase().replace(/[^a-z0-9\s]/g, '');
      if (!itemName) return false;
      const slugTitleClean = slugTitle.toLowerCase().replace(/-/g, '').replace(/[^a-z0-9\s]/g, '');
      const titleMatch = itemName === slugTitleClean || itemName.replace(/\s/g, '') === slugTitleClean;
      const yearMatch = !slugYear || (item.release_date && item.release_date.substring(0, 4) === slugYear);
      return item.media_type === 'movie' && titleMatch && yearMatch;
    });
    if (matchingMovie) {
      movieData = await getMovieById(matchingMovie.id);
    }
  }

  // Jika data tidak ditemukan, kembalikan metadata dasar
  if (!movieData) {
    return {
      title: 'FMovies',
      description: 'Find your favorite movies to stream.',
    };
  }

  const socialImage = movieData.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movieData.backdrop_path}`
    : movieData.poster_path
      ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}`
      : `https://placehold.co/1200x630/1f2937/d1d5db?text=${movieData.title.replace(/\s/g, '+')}`;
  
  const socialImageWidth = movieData.backdrop_path ? 1200 : movieData.poster_path ? 500 : 1200;
  const socialImageHeight = movieData.backdrop_path ? 630 : movieData.poster_path ? 750 : 630;
  const socialImageAlt = `${movieData.title} poster`;

  return {
    title: `FMovies - ${movieData.title}`,
    description: movieData.overview || `Detailed information for movie ${movieData.title}`,
    openGraph: {
      title: movieData.title,
      description: movieData.overview || `Detailed information for movie ${movieData.title}`,
      url: `https://fmovieswatch.netlify.app/movie/${slug}`,
      siteName: 'FMovies',
      images: [
        {
          url: socialImage,
          width: socialImageWidth,
          height: socialImageHeight,
          alt: socialImageAlt,
        },
      ],
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@WatchStream123',
      creator: '@WatchStream123',
      title: movieData.title,
      description: movieData.overview || `Detailed information for movie ${movieData.title}`,
      images: [socialImage],
      imageAlt: socialImageAlt,
    },
  };
}
// --- AKHIR BAGIAN METADATA API ---

// Main component
export default async function MoviePage({ params }) {
  const { slug } = await params; // PERBAIKAN DI SINI

  // Cek jika slug adalah kategori
  if (CATEGORIES.includes(slug)) {
    const movies = await getMoviesByCategory(slug);
    const title = slug.replace(/_/g, ' ').toUpperCase();

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-white">
          {title} Movies
        </h1>
        {movies && movies.length > 0 ? (
          <MovieList movies={movies} />
        ) : (
          <p className="text-center text-white">There are no movies in this category.</p>
        )}
      </div>
    );
  }

  // Cek jika slug adalah genre (contoh: "genre-12")
  const genreMatch = slug.match(/^genre-(\d+)$/);
  if (genreMatch) {
    const genreId = genreMatch[1];
    const movies = await getMovieGenres();
    const genreName = movies.find(g => g.id == genreId)?.name || 'Unknown';
    const moviesByGenre = await getMoviesByGenre(genreId);

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-white">
          {genreName} Movies
        </h1>
        {moviesByGenre && moviesByGenre.length > 0 ? (
          <MovieList movies={moviesByGenre} />
        ) : (
          <p className="text-center text-white">There are no movies in this genre.</p>
        )}
      </div>
    );
  }

  // --- Logika untuk halaman detail film ---
  let movieData = null;
  const id = parseInt(slug, 10);

  const slugParts = slug.split('-');
  const lastPart = slugParts[slugParts.length - 1];
  const slugYear = /^\d{4}$/.test(lastPart) ? lastPart : null;
  const slugTitle = slugYear ? slugParts.slice(0, -1).join('-') : slug;

  if (!isNaN(id) && slugParts.length === 1) {
    movieData = await getMovieById(id);
  } else {
    const searchResults = await searchMoviesAndTv(slugTitle.replace(/-/g, ' '));
    let matchingMovie = searchResults.find(item => {
      const itemName = item.title?.toLowerCase().replace(/[^a-z0-9\s]/g, '');
      if (!itemName) return false;
      const slugTitleClean = slugTitle.toLowerCase().replace(/-/g, '').replace(/[^a-z0-9\s]/g, '');
      const titleMatch = itemName === slugTitleClean || itemName.replace(/\s/g, '') === slugTitleClean;
      const yearMatch = !slugYear || (item.release_date && item.release_date.substring(0, 4) === slugYear);
      return item.media_type === 'movie' && titleMatch && yearMatch;
    });

    if (matchingMovie) {
      movieData = await getMovieById(matchingMovie.id);
    }
  }

  if (!movieData) {
    notFound();
  }

  const [videos, credits, reviews, similarMovies] = await Promise.all([
    getMovieVideos(movieData.id),
    getMovieCredits(movieData.id),
    getMovieReviews(movieData.id),
    getSimilarMovies(movieData.id),
  ]);

  const backdropUrl = movieData.backdrop_path ? `https://image.tmdb.org/t/p/original${movieData.backdrop_path}` : null;
  const posterUrl = movieData.poster_path ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}` : null;

  const trailer = videos && videos.length > 0 ? videos.find((video) => video.site === 'YouTube' && video.type === 'Trailer') : null;
  const cast = credits.cast.slice(0, 10);
  const crew = credits.crew.filter(member => ['Director', 'Writer', 'Screenplay'].includes(member.job)).slice(0, 5);
  const userReviews = reviews ? reviews.slice(0, 5) : [];

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-8">
      {/* Meta OG & Twitter sekarang dikelola oleh generateMetadata */}
      {/* Backdrop Section */}
      {backdropUrl && (
        <div className="relative h-64 sm:h-96 md:h-[500px] overflow-hidden">
          <Image
            src={backdropUrl}
            alt={`${movieData.title} backdrop`}
            fill
            style={{ objectFit: 'cover' }}
            className="w-full h-full object-cover rounded-lg shadow-xl"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
        </div>
      )}

      <div className="p-4 sm:p-8 md:p-12 relative -mt-32 md:-mt-48 z-10">
        <div className="flex flex-col md:flex-row items-start md:space-x-8">
          {/* Poster Section */}
          <div className="w-full md:w-1/3 flex-shrink-0 mb-6 md:mb-0">
            <Image
              src={posterUrl || `https://placehold.co/500x750/1f2937/d1d5db?text=Poster+Not+Available`}
              alt={movieData.title}
              width={500}
              height={750}
              className="w-full h-auto rounded-lg shadow-xl"
              priority
              unoptimized={!posterUrl}
            />
          </div>

          {/* Details Section */}
          <div className="flex-1">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-400 mb-2">
              {movieData.title}
            </h1>
            <p className="text-gray-300 text-lg sm:text-xl mb-4 italic">
              {movieData.tagline}
            </p>
            <div className="flex items-center space-x-4 mb-4">
              <span className="flex items-center bg-blue-600 rounded-full px-3 py-1 text-sm font-semibold text-white">
                <FaStar className="text-yellow-400 mr-1" />
                {movieData.vote_average.toFixed(1)} / 10
              </span>
              <span className="text-gray-400 text-sm">
                {movieData.release_date?.substring(0, 4)}
              </span>
              <span className="text-gray-400 text-sm">
                {movieData.runtime ? `${Math.floor(movieData.runtime / 60)}h ${movieData.runtime % 60}m` : 'N/A'}
              </span>
            </div>

            <h2 className="text-2xl font-bold mt-6 mb-2">Synopsis</h2>
            <p className="text-gray-300 text-justify mb-6">
              {movieData.overview || 'Synopsis not available.'}
            </p>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-400 mb-6">
              <div>
                <p>
                  <strong>Genre:</strong>{' '}
                  {movieData.genres?.map((genre) => genre.name).join(', ')}
                </p>
                <p>
                  <strong>Status:</strong> {movieData.status}
                </p>
              </div>
              <div>
                <p>
                  <strong>Director:</strong>{' '}
                  {crew.find(member => member.job === 'Director')?.name || 'N/A'}
                </p>
                <p>
                  <strong>Website:</strong> <a href={movieData.homepage} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{movieData.homepage}</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-8 md:p-12">
        {/* Cast Section */}
        <div className="mt-8 border-t border-gray-700 pt-8">
          <h2 className="text-2xl font-bold mb-4 text-blue-400">Main Cast</h2>
          {cast.length > 0 ? (
            <div className="flex overflow-x-auto space-x-4 pb-4 no-scrollbar">
              {cast.map((actor) => (
                <div key={actor.id} className="flex-shrink-0 w-24 text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-2 border-2 border-gray-600">
                    {actor.profile_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                        alt={actor.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <FaUserCircle className="text-4xl text-gray-400" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-white truncate">{actor.name}</p>
                  <p className="text-[10px] text-gray-400 truncate">{actor.character}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">Cast information not available.</p>
          )}
        </div>

        {/* Trailer Section */}
        {trailer && (
          <div className="mt-8 border-t border-gray-700 pt-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">Trailer</h2>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                className="w-full aspect-video rounded-xl shadow-lg"
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="mt-8 border-t border-gray-700 pt-8">
          <h2 className="text-2xl font-bold mb-4 text-blue-400">User Reviews</h2>
          {userReviews.length > 0 ? (
            <div className="space-y-4">
              {userReviews.map((review) => (
                <div key={review.id} className="bg-gray-800 p-4 rounded-lg shadow-md">
                  <p className="font-semibold text-white">{review.author}</p>
                  <p className="text-sm text-gray-300 mt-1 text-justify">{review.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No reviews for this movie yet.</p>
          )}
        </div>

        {/* Similar Movies Section */}
        {similarMovies && similarMovies.length > 0 && (
          <div className="mt-8 border-t border-gray-700 pt-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">Similar Movies</h2>
            <div className="flex overflow-x-auto space-x-4 pb-4 no-scrollbar">
              {similarMovies.slice(0, 10).map(item => {
                const itemSlug = createSlug(item);
                const itemUrl = `/movie/${itemSlug}`;

                const getImageUrl = (path) => {
                  if (path) {
                    return `https://image.tmdb.org/t/p/w500${path}`;
                  }
                  return 'https://placehold.co/500x750/1f2937/d1d5db?text=Poster+Not+Available';
                };

                return (
                  <a key={item.id} href={itemUrl} className="flex-shrink-0 w-32 md:w-48 text-center group">
                    <div className="relative w-full h-auto rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 shadow-lg">
                      <Image
                        src={getImageUrl(item.poster_path)}
                        alt={item.title}
                        width={200}
                        height={300}
                        className="w-full h-auto object-cover rounded-lg"
                        unoptimized={!item.poster_path}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <h3 className="text-xs md:text-sm font-semibold text-white truncate mb-1">
                          {item.title}
                        </h3>
                        {item.release_date && (
                          <span className="text-[10px] md:text-xs text-gray-400">
                            ({item.release_date.substring(0, 4)})
                          </span>
                        )}
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        )}
		
		{/* Bottom Stream Button */}
        <div className="mt-12 text-center">
             <a href={`/movie/${slug}/stream`}>
              <button className="bg-blue-700 hover:bg-red-700 text-white font-bold py-4 px-10 rounded-lg text-xl transition-transform transform hover:scale-105 shadow-lg">
                🎬 Stream Now
              </button>
            </a>
        </div>
      </div>
    </div>
  );
}