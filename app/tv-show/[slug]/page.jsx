// app/tv-show/[slug]/page.jsx

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FaYoutube, FaUserCircle, FaStar } from 'react-icons/fa';
import {
  getTvSeriesById,
  getTvSeriesVideos,
  getTvSeriesCredits,
  getTvSeriesReviews,
  searchMoviesAndTv,
  getSimilarTvSeries,
  getTvSeriesByCategory,
  getTvSeriesByGenre,
  getTvSeriesGenres,
  createSlug
} from '../../../lib/api';
import TvSeriesList from '../../../components/TvSeriesList';

const CATEGORIES = ['popular', 'top_rated', 'on_the_air', 'airing_today'];

// Utility untuk membuat slug dari nama genre (untuk URL SEO-Friendly)
const createGenreSlug = (name) => {
  if (!name) return '';
  return name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim();
};

// --- METADATA GENERATION ---
export async function generateMetadata({ params }) {
  const { slug } = await params;

  // Cek apakah slug adalah genre atau kategori untuk metadata sederhana
  const genres = await getTvSeriesGenres();
  const genreSlugMap = new Map(
    genres.map(genre => [createGenreSlug(genre.name), { id: genre.id, name: genre.name }])
  );

  const processedSlug = createGenreSlug(slug);

  if (genreSlugMap.has(processedSlug)) {
    const genre = genreSlugMap.get(processedSlug);
    return { title: `FMovies - ${genre.name} TV Series` };
  }

  if (CATEGORIES.includes(slug)) {
    const title = slug.replace(/_/g, ' ').toUpperCase();
    return { title: `FMovies - ${title} TV Series` };
  }

  // Logika untuk mengambil data TV show untuk metadata detail
  let tvShowData = null;
  const id = parseInt(slug, 10);
  const slugParts = slug.split('-');
  const lastPart = slugParts[slugParts.length - 1];
  const slugYear = /^\d{4}$/.test(lastPart) ? lastPart : null;
  const slugTitle = slugYear ? slugParts.slice(0, -1).join('-') : slug;

  if (!isNaN(id) && slugParts.length === 1) {
    tvShowData = await getTvSeriesById(id);
  } else {
    const searchResults = await searchMoviesAndTv(slugTitle.replace(/-/g, ' '));
    const matchingTvShow = searchResults.find(item => {
      const itemName = item.name?.toLowerCase().replace(/[^a-z0-9\s]/g, '');
      if (!itemName) return false;
      const slugTitleClean = slugTitle.toLowerCase().replace(/-/g, '').replace(/[^a-z0-9\s]/g, '');
      const titleMatch = itemName === slugTitleClean || itemName.replace(/\s/g, '') === slugTitleClean;
      const yearMatch = !slugYear || (item.first_air_date && item.first_air_date.substring(0, 4) === slugYear);
      return item.media_type === 'tv' && titleMatch && yearMatch;
    });

    if (matchingTvShow) {
      tvShowData = await getTvSeriesById(matchingTvShow.id);
    }
  }

  if (!tvShowData) {
    return { title: 'Not Found' };
  }

  const posterUrl = tvShowData.poster_path ? `https://image.tmdb.org/t/p/w500${tvShowData.poster_path}` : null;
  const backdropUrl = tvShowData.backdrop_path ? `https://image.tmdb.org/t/p/original${tvShowData.backdrop_path}` : null;
  const socialImage = backdropUrl || posterUrl || `https://placehold.co/1200x630/1f2937/d1d5db?text=${encodeURIComponent(tvShowData.name)}`;
  const socialImageAlt = `${tvShowData.name} poster`;

  return {
    title: `FMovies - ${tvShowData.name}`,
    description: tvShowData.overview,
    openGraph: {
      title: tvShowData.name,
      description: tvShowData.overview,
      url: `https://fmovieswatch.netlify.app/tv-show/${slug}`,
      siteName: 'FMovies',
      images: [{ url: socialImage, width: 1200, height: 630, alt: socialImageAlt }],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: tvShowData.name,
      description: tvShowData.overview,
      creator: '@WatchStream123',
      images: [socialImage],
    },
  };
}

// --- MAIN PAGE COMPONENT ---
export default async function TvShowPage({ params }) {
  const { slug } = await params;

  // Cek jika slug adalah GENRE (berdasarkan nama)
  const genres = await getTvSeriesGenres();
  const genreSlugMap = new Map(
    genres.map(genre => [createGenreSlug(genre.name), { id: genre.id, name: genre.name }])
  );

  const processedSlug = createGenreSlug(slug);

  if (genreSlugMap.has(processedSlug)) {
    const genre = genreSlugMap.get(processedSlug);
    const series = await getTvSeriesByGenre(genre.id);
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-white">
          {genre.name} TV Series
        </h1>
        {series && series.length > 0 ? (
          <TvSeriesList series={series} />
        ) : (
          <p className="text-center text-white">There are no TV series in this genre.</p>
        )}
      </div>
    );
  }

  // Cek jika slug adalah KATEGORI
  if (CATEGORIES.includes(slug)) {
    const series = await getTvSeriesByCategory(slug);
    const title = slug.replace(/_/g, ' ').toUpperCase();
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-white">
          {title} TV Series
        </h1>
        {series && series.length > 0 ? (
          <TvSeriesList series={series} />
        ) : (
          <p className="text-center text-white">There are no TV series in this category.</p>
        )}
      </div>
    );
  }

  // Jika bukan genre atau kategori, maka ini adalah halaman DETAIL TV SHOW
  let tvShowData = null;
  const id = parseInt(slug, 10);
  const slugParts = slug.split('-');
  const lastPart = slugParts[slugParts.length - 1];
  const slugYear = /^\d{4}$/.test(lastPart) ? lastPart : null;
  const slugTitle = slugYear ? slugParts.slice(0, -1).join('-') : slug;

  if (!isNaN(id) && slugParts.length === 1) {
    tvShowData = await getTvSeriesById(id);
  } else {
    const searchResults = await searchMoviesAndTv(slugTitle.replace(/-/g, ' '));
    let matchingTvShow = searchResults.find(item => {
      const itemName = item.name?.toLowerCase().replace(/[^a-z0-9\s]/g, '');
      if (!itemName) return false;
      const slugTitleClean = slugTitle.toLowerCase().replace(/-/g, '').replace(/[^a-z0-9\s]/g, '');
      const titleMatch = itemName === slugTitleClean || itemName.replace(/\s/g, '') === slugTitleClean;
      const yearMatch = !slugYear || (item.first_air_date && item.first_air_date.substring(0, 4) === slugYear);
      return item.media_type === 'tv' && titleMatch && yearMatch;
    });
    if (matchingTvShow) {
      tvShowData = await getTvSeriesById(matchingTvShow.id);
    }
  }

  if (!tvShowData) {
    notFound();
  }

  // ✅ FIX: Deklarasi variables SETELAH tvShowData tersedia
  const backdropUrl = tvShowData.backdrop_path ? `https://image.tmdb.org/t/p/original${tvShowData.backdrop_path}` : null;
  const posterUrl = tvShowData.poster_path ? `https://image.tmdb.org/t/p/w500${tvShowData.poster_path}` : null;
  
  // ✅ FIX: Handle potential null values dengan Promise.allSettled
  const [videosResult, creditsResult, reviewsResult, similarTvSeriesResult] = await Promise.allSettled([
    getTvSeriesVideos(tvShowData.id),
    getTvSeriesCredits(tvShowData.id),
    getTvSeriesReviews(tvShowData.id),
    getSimilarTvSeries(tvShowData.id),
  ]);

  const videos = videosResult.status === 'fulfilled' ? videosResult.value : [];
  const credits = creditsResult.status === 'fulfilled' ? creditsResult.value : { cast: [], crew: [] };
  const reviews = reviewsResult.status === 'fulfilled' ? reviewsResult.value : [];
  const similarTvSeries = similarTvSeriesResult.status === 'fulfilled' ? similarTvSeriesResult.value : [];

  const trailer = videos?.find((video) => video.site === 'YouTube' && video.type === 'Trailer');
  const cast = credits?.cast?.slice(0, 10) || [];
  const crew = credits?.crew?.filter(member => ['Creator', 'Director', 'Writer', 'Screenplay'].includes(member.job)).slice(0, 5) || [];
  const userReviews = reviews ? reviews.slice(0, 5) : [];

  // ✅ FIX: Validasi posterUrl sebelum render
  const validatedPosterUrl = posterUrl || `https://placehold.co/500x750/1f2937/d1d5db?text=No+Poster+Available`;

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-8">
      {backdropUrl && (
        <div className="relative h-64 sm:h-96 md:h-[500px] overflow-hidden">
          <Image 
            src={backdropUrl} 
            alt={`${tvShowData.name} backdrop`} 
            fill 
            style={{ objectFit: 'cover' }} 
            className="w-full h-full object-cover" 
            priority 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
        </div>
      )}

      <div className="p-4 sm:p-8 md:p-12 relative -mt-32 md:-mt-48 z-10">
        <div className="flex flex-col md:flex-row items-start md:space-x-8">
          <div className="w-full md:w-1/3 flex-shrink-0 mb-6 md:mb-0">
            <Image 
              src={validatedPosterUrl} 
              alt={tvShowData.name} 
              width={500} 
              height={750} 
              className="w-full h-auto rounded-lg shadow-xl" 
              priority 
              unoptimized={!tvShowData.poster_path} 
            />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-400 mb-2">
              {tvShowData.name}
            </h1>
            <p className="text-gray-300 text-lg sm:text-xl mb-4 italic">
              {tvShowData.tagline}
            </p>
            <div className="flex items-center space-x-4 mb-4">
              <span className="flex items-center bg-blue-600 rounded-full px-3 py-1 text-sm font-semibold text-white">
                <FaStar className="text-yellow-400 mr-1" />
                {tvShowData.vote_average ? tvShowData.vote_average.toFixed(1) : 'N/A'} / 10
              </span>
              <span className="text-gray-400 text-sm">
                {tvShowData.first_air_date?.substring(0, 4)}
              </span>
              <span className="text-gray-400 text-sm">
                {tvShowData.number_of_seasons ? `${tvShowData.number_of_seasons} Seasons` : 'N/A'}
              </span>
            </div>
            <h2 className="text-2xl font-bold mt-6 mb-2">Synopsis</h2>
            <p className="text-gray-300 text-justify mb-6">
              {tvShowData.overview || 'Synopsis not available.'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-400 mb-6">
              <p><strong>Genre:</strong> {tvShowData.genres?.map((genre) => genre.name).join(', ') || 'N/A'}</p>
              <p><strong>Status:</strong> {tvShowData.status || 'N/A'}</p>
              <p><strong>Creator:</strong> {crew.find(member => member.job === 'Creator')?.name || 'N/A'}</p>
              {tvShowData.homepage && (
                <p><strong>Website:</strong> 
                  <a href={tvShowData.homepage} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline ml-1">
                    Visit Website
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-8 md:px-12">
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

        <div className="mt-8 border-t border-gray-700 pt-8">
          <h2 className="text-2xl font-bold mb-4 text-blue-400">User Reviews</h2>
          {userReviews.length > 0 ? (
            <div className="space-y-4">
              {userReviews.map((review) => (
                <div key={review.id} className="bg-gray-800 p-4 rounded-lg shadow-md">
                  <p className="font-semibold text-white">{review.author}</p>
                  <p className="text-sm text-gray-300 mt-1 text-justify line-clamp-5">{review.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No reviews for this TV show yet.</p>
          )}
        </div>
        
        {similarTvSeries && similarTvSeries.length > 0 && (
          <div className="mt-8 border-t border-gray-700 pt-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">Similar TV Series</h2>
            <TvSeriesList series={similarTvSeries.slice(0, 10)} />
          </div>
        )}

        <div className="mt-12 text-center">
          <Link href={`/tv-show/${slug}/stream`}>
            <button className="bg-blue-700 hover:bg-red-700 text-white font-bold py-4 px-10 rounded-lg text-xl transition-transform transform hover:scale-105 shadow-lg">
              🎬 Stream Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}