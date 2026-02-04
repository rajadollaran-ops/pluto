// components/MediaCard.jsx

"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

// Fungsi utilitas untuk membuat slug dari item media
const createSlug = (item) => {
  const title = item.title || item.name;
  if (!title) return '';

  const baseSlug = title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim();

  let year = '';
  if (item.release_date) {
    year = item.release_date.substring(0, 4);
  } else if (item.first_air_date) {
    year = item.first_air_date.substring(0, 4);
  }
  return `${baseSlug}-${year}`;
};

export default function MediaCard({ mediaItem }) {
  const [isHovered, setIsHovered] = useState(false);

  const posterPath = mediaItem.poster_path;
  const imageUrl = posterPath
    ? `https://image.tmdb.org/t/p/w500${posterPath}`
    : 'https://via.placeholder.com/500x750.png?text=No+Image';

  const isMovie = mediaItem.title !== undefined;
  const title = isMovie ? mediaItem.title : mediaItem.name;
  const mediaType = isMovie ? 'movie' : 'tv-show';

  let year = '';
  if (mediaItem.release_date) {
    year = new Date(mediaItem.release_date).getFullYear();
  } else if (mediaItem.first_air_date) {
    year = new Date(mediaItem.first_air_date).getFullYear();
  } else {
    year = 'N/A';
  }

  const mediaSlug = createSlug(mediaItem);
  const linkHref = `/${mediaType}/${mediaSlug}`;

  return (
    <div
      className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={linkHref} className="block rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="relative w-full h-80 bg-gray-800">
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 600px) 50vw, (max-width: 1200px) 25vw, 15vw"
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-300 transform group-hover:scale-110"
          />

          {/* Overlay dan Teks yang Muncul Saat Hover */}
          <div className={`absolute inset-0 bg-black bg-opacity-70 flex flex-col justify-end p-4 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <h3 className="text-white text-lg font-bold">
              {title}
            </h3>
            <p className="text-gray-300 text-sm font-light">
              ({year})
            </p>
          </div>
        </div>
      </Link>

      {/* Tampilan Judul di Bawah Poster */}
      <div className="mt-2 text-center px-1">
        <h3 className="text-white text-sm font-semibold truncate">
          {title}
        </h3>
        <p className="text-gray-400 text-xs font-light">
          ({year})
        </p>
      </div>
    </div>
  );
}