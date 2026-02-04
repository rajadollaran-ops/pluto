// components/MovieCard.jsx
// Komponen ini menampilkan kartu untuk satu film, lengkap dengan poster, judul, dan rating.
import Image from 'next/image';
import Link from 'next/link';

// URL dasar untuk gambar poster dari TMDB
const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export default function MovieCard({ movie }) {
  // Tangkap slug untuk link ke halaman detail
  const slug = encodeURIComponent(movie.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'));

  // Tangkap URL gambar poster
  const posterUrl = movie.poster_path
    ? `${POSTER_BASE_URL}${movie.poster_path}`
    : '/placeholder.jpg'; // Menggunakan gambar placeholder jika tidak ada poster

  return (
    <Link href={`/movie/${slug}?id=${movie.id}`} className="block">
      <div className="relative h-64 w-44 bg-slate-800 rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl">
        <Image
          src={posterUrl}
          alt={movie.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{
            objectFit: 'cover',
          }}
        />
        <div className="p-4">
          <h2 className="text-lg font-semibold text-white mb-2 line-clamp-1">
            {movie.title}
          </h2>
          <p className="text-sm text-gray-400">
            Rating: {movie.vote_average.toFixed(1)} / 10
          </p>
        </div>
      </div>
    </Link>
  );
}