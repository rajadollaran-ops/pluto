export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-950">
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500 mb-4"></div>
        <p className="text-lg">Loading TV show details...</p>
      </div>
    </div>
  );
}
