import { notFound } from 'next/navigation';
import { getTvSeriesById, getSimilarTvSeries, searchMoviesAndTv } from '../../../../lib/api';
import WatchClient from './WatchClient';

// Fungsi utilitas untuk membuat slug dari judul TV show
const createSlug = (item) => {
  const title = item.name;
  if (!title) return '';
  const baseSlug = title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim();
  
  let year = '';
  if (item.first_air_date) {
    year = item.first_air_date.substring(0, 4);
  }
  return `${baseSlug}-${year}`;
};

// Function to fetch data from the TMDb keyword API
const getEroticMovies = async (page = 1) => {
    const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY; 
    const keywordId = 190370;
    const url = `https://api.themoviedb.org/3/keyword/${keywordId}/movies?api_key=${API_KEY}&page=${page}`;
     
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch erotic movies data');
        }
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error(error);
        return [];
    }
};

// ===================================
// KOMPONEN SERVER UTAMA
// ===================================
// Ini adalah komponen server yang mengambil data dan meneruskannya ke komponen klien.
export default async function StreamPage({ params }) {
    const { slug } = await params;

    let tvDetails = null;
    const id = parseInt(slug, 10);
  
    // Pisahkan slug menjadi judul dan tahun, jika tahun ada
    const slugParts = slug.split('-');
    const lastPart = slugParts[slugParts.length - 1];
    const slugYear = /^\d{4}$/.test(lastPart) ? lastPart : null;
    const slugTitle = slugYear ? slugParts.slice(0, -1).join('-') : slug;
  
    // Periksa apakah slug adalah ID numerik
    if (!isNaN(id) && slugParts.length === 1) {
      tvDetails = await getTvSeriesById(id);
    } else {
      // Cari TV show berdasarkan bagian judul dari slug
      const searchResults = await searchMoviesAndTv(slugTitle.replace(/-/g, ' '));
      
      let matchingTvShow = searchResults.find(item => {
        const itemTitle = item.name?.toLowerCase().replace(/[^a-z0-9\s]/g, '');
        if (!itemTitle) {
          return false;
        }
  
        const slugTitleClean = slugTitle.toLowerCase().replace(/-/g, '').replace(/[^a-z0-9\s]/g, '');
  
        const titleMatch = itemTitle === slugTitleClean ||
                           itemTitle.replace(/\s/g, '') === slugTitleClean;
  
        const yearMatch = !slugYear || (item.first_air_date && item.first_air_date.substring(0, 4) === slugYear);
        
        return item.media_type === 'tv' && titleMatch && yearMatch;
      });
  
      if (matchingTvShow) {
        tvDetails = await getTvSeriesById(matchingTvShow.id);
      }
    }

    // Jika detail TV show masih belum ditemukan, tampilkan halaman 404
    if (!tvDetails) {
        notFound();
    }
    
    // Ambil film-film erotis untuk bagian "You Might Also Like"
    const similarMedia = await getEroticMovies(1);

    // Teruskan data yang diambil sebagai props ke komponen klien
    return (
        <WatchClient
            mediaType="movie"
            id={tvDetails.id}
            initialDetails={tvDetails}
            initialSimilarMedia={similarMedia}
        />
    );
}
