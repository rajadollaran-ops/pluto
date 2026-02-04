// app/tv-show/genre/[genreName]/page.jsx
import { notFound } from 'next/navigation';
import {
  getTvSeriesByGenre,
  getTvSeriesGenres,
} from '../../../../lib/api';
import TvSeriesList from '../../../../components/TvSeriesList';
import Link from 'next/link';

// Utility untuk membuat slug dari nama genre yang SEO-Friendly.
const createGenreSlug = (name) => {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Hapus karakter khusus
    .replace(/\s+/g, '-') // Ganti spasi dengan dash
    .replace(/-+/g, '-') // Hapus multiple dash berturut-turut
    .trim();
};

// Utility untuk decode URL parameter dengan benar
const decodeUrlSlug = (slug) => {
  if (!slug) return '';
  // Decode URI component terlebih dahulu (mengubah %26 kembali menjadi &)
  const decoded = decodeURIComponent(slug);
  // Kemudian proses dengan createGenreSlug untuk konsistensi
  return createGenreSlug(decoded);
};

export async function generateMetadata({ params }) {
  const { genreName } = await params;
  
  const genres = await getTvSeriesGenres();
  
  // Decode URL slug dengan benar
  const processedSlug = decodeUrlSlug(genreName);
  
  // Mencari genre berdasarkan slug yang sudah diproses
  const genre = genres.find(g => createGenreSlug(g.name) === processedSlug);

  const title = genre?.name || 'Unknown';
  
  const pageUrl = `https://fmovieswatch.netlify.app/tv-show/genre/${genreName}`;
  const imageUrl = 'https://live.staticflickr.com/65535/54796154293_fa66ff7825_b.jpg';

  return {
    title: `FMovies - ${title} TV Series`,
    description: `Find and watch the best ${title} TV series for free on FMovies.`,
    openGraph: {
      title: `FMovies - ${title} TV Series`,
      description: `Find and watch the best ${title} TV series for free on FMovies.`,
      url: pageUrl,
      siteName: 'FMovies',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${title} genre TV series poster`,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@WatchStream123',
      creator: '@WatchStream123',
      title: `FMovies - ${title} TV Series`,
      description: `Find and watch the best ${title} TV series for free on FMovies.`,
      images: [imageUrl],
    },
    other: {
      'fb:app_id': '100074345305108',
    },
  };
}

export default async function TvSeriesByGenrePage({ params }) {
  const { genreName } = await params;
  
  const genres = await getTvSeriesGenres();
  
  // Decode URL slug dengan benar
  const processedSlug = decodeUrlSlug(genreName);
  
  console.log('Original URL Slug:', genreName);
  console.log('Processed Slug:', processedSlug);
  console.log('Available genre slugs:', genres.map(g => createGenreSlug(g.name)));
  
  // Mencari genre berdasarkan slug yang sudah diproses
  const genre = genres.find(g => createGenreSlug(g.name) === processedSlug);
  
  const genreId = genre?.id;
  const genreTitle = genre?.name || 'Unknown';

  if (!genreId) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-white">
        <h1 className="text-3xl sm:text-4xl font-bold text-red-400 mb-4">Genre not found.</h1>
        <p className="text-lg">The requested TV series genre "{genreName}" could not be found.</p>
        <p className="text-sm text-gray-400 mt-2">
          Processed slug: {processedSlug}
        </p>
        <Link href="/tv-show">
          <button className="mt-6 bg-blue-700 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors">
            Back to TV Shows
          </button>
        </Link>
      </div>
    );
  }

  const series = await getTvSeriesByGenre(genreId);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-white">
        {genreTitle} TV Series
      </h1>
      {series && series.length > 0 ? (
        <TvSeriesList series={series} />
      ) : (
        <p className="text-center text-white">No TV series available in this genre.</p>
      )}
    </div>
  );
}