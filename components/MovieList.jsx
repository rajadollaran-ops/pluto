// components/MovieList.jsx
import MediaCard from './MediaCard';

export default function MovieList({ movies }) {
  if (!movies || movies.length === 0) {
    return <p className="text-center text-gray-400">No Movies Found.</p>;
  }

  // Buat key yang benar-benar unik dengan kombinasi ID dan timestamp
  const generateUniqueKey = (item, index) => {
    return `${item.id}-${index}-${Date.now()}`;
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {movies.map((item, index) => (
        <MediaCard 
          key={generateUniqueKey(item, index)}
          mediaItem={item} 
        />
      ))}
    </div>
  );
}