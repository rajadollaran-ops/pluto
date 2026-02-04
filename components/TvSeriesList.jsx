// components/TvSeriesList.jsx

import MediaCard from './MediaCard';

export default function TvSeriesList({ series }) {
  if (!series || series.length === 0) {
    return <p className="text-center text-gray-400">No TV Series Found.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {series.map((item) => (
        <MediaCard key={item.id} mediaItem={item} />
      ))}
    </div>
  );
}