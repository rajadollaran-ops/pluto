// api.js

const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const apiUrl = process.env.NEXT_PUBLIC_TMDB_API_URL;

// Fungsi helper untuk fetch data
const fetchApi = async (path, options = {}) => {
  if (!apiKey || !apiUrl) {
    throw new Error('API keys are not configured. Please check your .env.local file.');
  }

  // Handle query parameters yang sudah ada di path
  const separator = path.includes('?') ? '&' : '?';
  const url = `${apiUrl}${path}${separator}api_key=${apiKey}&language=en-US`;
  
  const res = await fetch(url, {
    cache: 'no-store',
    ...options,
  });

  if (!res.ok) {
    const errorText = await res.text();
    let errorMessage = `API Error: ${res.status} ${res.statusText}`;
    
    try {
      const errorData = JSON.parse(errorText);
      errorMessage = `API Error: ${errorData.status_message || errorMessage}`;
    } catch {
      // Jika response bukan JSON, gunakan teks biasa
      errorMessage = `API Error: ${res.status} ${res.statusText} - ${errorText}`;
    }
    
    throw new Error(errorMessage);
  }

  return res.json();
};

// Fungsi untuk mendapatkan film berdasarkan ID
export async function getMovieById(movieId) {
  try {
    const data = await fetchApi(`/movie/${movieId}`);
    return data;
  } catch (error) {
    console.error(`Error fetching movie details for ID ${movieId}:`, error.message);
    return null;
  }
}

// Fungsi untuk mendapatkan serial TV berdasarkan ID
export async function getTvSeriesById(tvId) {
  try {
    const data = await fetchApi(`/tv/${tvId}`);
    return data;
  } catch (error) {
    console.error(`Error fetching TV series details for ID ${tvId}:`, error.message);
    return null;
  }
}

// Fungsi untuk mendapatkan video (trailer) film
export async function getMovieVideos(movieId) {
  try {
    const data = await fetchApi(`/movie/${movieId}/videos`);
    return data.results || [];
  } catch (error) {
    console.error(`Error fetching movie videos for ID ${movieId}:`, error.message);
    return [];
  }
}

// Fungsi untuk mendapatkan video (trailer) serial TV
export async function getTvSeriesVideos(tvId) {
  try {
    const data = await fetchApi(`/tv/${tvId}/videos`);
    return data.results || [];
  } catch (error) {
    console.error(`Error fetching TV series videos for ID ${tvId}:`, error.message);
    return [];
  }
}

// Fungsi untuk mendapatkan kredit (aktor dan kru) film
export async function getMovieCredits(movieId) {
  try {
    const data = await fetchApi(`/movie/${movieId}/credits`);
    return data;
  } catch (error) {
    console.error(`Error fetching movie credits for ID ${movieId}:`, error.message);
    return null;
  }
}

// Fungsi untuk mendapatkan ulasan film
export async function getMovieReviews(movieId) {
  try {
    const data = await fetchApi(`/movie/${movieId}/reviews`);
    return data.results || [];
  } catch (error) {
    console.error(`Error fetching movie reviews for ID ${movieId}:`, error.message);
    return [];
  }
}

// Fungsi untuk mendapatkan kredit (aktor dan kru) serial TV
export async function getTvSeriesCredits(tvId) {
  try {
    const data = await fetchApi(`/tv/${tvId}/credits`);
    return data;
  } catch (error) {
    console.error(`Error fetching TV series credits for ID ${tvId}:`, error.message);
    return null;
  }
}

// Fungsi untuk mendapatkan ulasan serial TV
export async function getTvSeriesReviews(tvId) {
  try {
    const data = await fetchApi(`/tv/${tvId}/reviews`);
    return data.results || [];
  } catch (error) {
    console.error(`Error fetching TV series reviews for ID ${tvId}:`, error.message);
    return [];
  }
}

// Fungsi untuk mencari film atau serial TV berdasarkan query
export async function searchMoviesAndTv(query, page = 1) {
  if (!query || query.trim() === '') {
    return [];
  }
  
  try {
    const data = await fetchApi(`/search/multi?query=${encodeURIComponent(query)}&page=${page}`);
    return data.results || [];
  } catch (error) {
    console.error(`Error fetching search results for query '${query}':`, error.message);
    return [];
  }
}

// Fungsi untuk mendapatkan film berdasarkan kategori
export async function getMoviesByCategory(category, page = 1) {
  try {
    const data = await fetchApi(`/movie/${category}?page=${page}`);
    return data.results || [];
  } catch (error) {
    console.error(`Error fetching ${category} movies:`, error.message);
    return [];
  }
}

// Fungsi untuk mendapatkan serial TV berdasarkan kategori
export async function getTvSeriesByCategory(category, page = 1) {
  try {
    const data = await fetchApi(`/tv/${category}?page=${page}`);
    return data.results || [];
  } catch (error) {
    console.error(`Error fetching ${category} TV series:`, error.message);
    return [];
  }
}

// Fungsi untuk mendapatkan film serupa
export async function getSimilarMovies(movieId) {
  try {
    const data = await fetchApi(`/movie/${movieId}/similar`);
    return data.results || [];
  } catch (error) {
    console.error(`Error fetching similar movies for ID ${movieId}:`, error.message);
    return [];
  }
}

// Fungsi untuk mendapatkan serial TV serupa
export async function getSimilarTvSeries(tvId) {
  try {
    const data = await fetchApi(`/tv/${tvId}/similar`);
    return data.results || [];
  } catch (error) {
    console.error(`Error fetching similar TV series for ID ${tvId}:`, error.message);
    return [];
  }
}

// Fungsi untuk mencari film berdasarkan judul
export const getMovieByTitle = async (title) => {
  if (!title || title.trim() === '') {
    return null;
  }
  
  try {
    const data = await fetchApi(`/search/movie?query=${encodeURIComponent(title)}`);
    return data.results && data.results.length > 0 ? data.results : null;
  } catch (error) {
    console.error(`Error fetching movie by title: ${title}`, error.message);
    return null;
  }
};

// Fungsi untuk mencari serial TV berdasarkan judul
export const getTvSeriesByTitle = async (title) => {
  if (!title || title.trim() === '') {
    return null;
  }
  
  try {
    const data = await fetchApi(`/search/tv?query=${encodeURIComponent(title)}`);
    return data.results && data.results.length > 0 ? data.results : null;
  } catch (error) {
    console.error(`Error fetching TV series by title: ${title}`, error.message);
    return null;
  }
};

// Fungsi untuk mendapatkan daftar genre film
export async function getMovieGenres() {
  try {
    const data = await fetchApi('/genre/movie/list');
    return data.genres || [];
  } catch (error) {
    console.error('Error fetching movie genres:', error.message);
    return [];
  }
}

// Fungsi untuk mendapatkan daftar genre serial TV
export async function getTvSeriesGenres() {
  try {
    const data = await fetchApi('/genre/tv/list');
    return data.genres || [];
  } catch (error) {
    console.error('Error fetching TV series genres:', error.message);
    return [];
  }
}

// Fungsi untuk mendapatkan film berdasarkan genre
export async function getMoviesByGenre(genreId, page = 1) {
  try {
    const data = await fetchApi(`/discover/movie?with_genres=${genreId}&page=${page}`);
    return data.results || [];
  } catch (error) {
    console.error(`Error fetching movies by genre ID ${genreId}:`, error.message);
    return [];
  }
}

// Fungsi untuk mendapatkan serial TV berdasarkan genre
export async function getTvSeriesByGenre(genreId, page = 1) {
  try {
    const data = await fetchApi(`/discover/tv?with_genres=${genreId}&page=${page}`);
    return data.results || [];
  } catch (error) {
    console.error(`Error fetching TV series by genre ID ${genreId}:`, error.message);
    return [];
  }
}

// Fungsi untuk mendapatkan film trending harian
export async function getTrendingMoviesDaily(page = 1) {
  try {
    const data = await fetchApi(`/trending/movie/day?page=${page}`);
    return data.results || [];
  } catch (error) {
    console.error('Error fetching daily trending movies:', error.message);
    return [];
  }
}

// Fungsi untuk mendapatkan serial TV trending harian
export async function getTrendingTvSeriesDaily(page = 1) {
  try {
    const data = await fetchApi(`/trending/tv/day?page=${page}`);
    return data.results || [];
  } catch (error) {
    console.error('Error fetching daily trending TV series:', error.message);
    return [];
  }
}

// FUNGSI BARU UNTUK STRATEGI KONTEN

// Fungsi untuk mendapatkan film berdasarkan tahun rilis
export async function getMoviesByYear(year, page = 1) {
  try {
    const data = await fetchApi(`/discover/movie?primary_release_year=${year}&page=${page}`);
    return data.results || [];
  } catch (error) {
    console.error(`Error fetching movies from year ${year}:`, error.message);
    return [];
  }
}

// Fungsi untuk mendapatkan film berdasarkan dekade
export async function getMoviesByDecade(decade, page = 1) {
  try {
    let startYear, endYear;
    
    switch(decade) {
      case '2020s':
        startYear = 2020;
        endYear = 2029;
        break;
      case '2010s':
        startYear = 2010;
        endYear = 2019;
        break;
      case '2000s':
        startYear = 2000;
        endYear = 2009;
        break;
      case '1990s':
        startYear = 1990;
        endYear = 1999;
        break;
      case '1980s':
        startYear = 1980;
        endYear = 1989;
        break;
      default:
        startYear = 2020;
        endYear = 2029;
    }
    
    const data = await fetchApi(`/discover/movie?primary_release_date.gte=${startYear}-01-01&primary_release_date.lte=${endYear}-12-31&page=${page}`);
    return data.results || [];
  } catch (error) {
    console.error(`Error fetching movies from ${decade}:`, error.message);
    return [];
  }
}

// Fungsi untuk mendapatkan detail aktor/people
export async function getPersonById(personId) {
  try {
    const data = await fetchApi(`/person/${personId}`);
    return data;
  } catch (error) {
    console.error(`Error fetching person details for ID ${personId}:`, error.message);
    return null;
  }
}

// Fungsi untuk mendapatkan filmografi aktor
export async function getPersonMovieCredits(personId) {
  try {
    const data = await fetchApi(`/person/${personId}/movie_credits`);
    return data;
  } catch (error) {
    console.error(`Error fetching movie credits for person ID ${personId}:`, error.message);
    return null;
  }
}

// Fungsi untuk mendapatkan kredit TV series aktor
export async function getPersonTvCredits(personId) {
  try {
    const data = await fetchApi(`/person/${personId}/tv_credits`);
    return data;
  } catch (error) {
    console.error(`Error fetching TV credits for person ID ${personId}:`, error.message);
    return null;
  }
}

// Fungsi untuk mencari aktor/people
export async function searchPeople(query, page = 1) {
  if (!query || query.trim() === '') {
    return [];
  }
  
  try {
    const data = await fetchApi(`/search/person?query=${encodeURIComponent(query)}&page=${page}`);
    return data.results || [];
  } catch (error) {
    console.error(`Error searching people for query '${query}':`, error.message);
    return [];
  }
}

// Fungsi untuk mendapatkan aktor populer
export async function getPopularPeople(page = 1) {
  try {
    const data = await fetchApi(`/person/popular?page=${page}`);
    return data.results || [];
  } catch (error) {
    console.error('Error fetching popular people:', error.message);
    return [];
  }
}

// Fungsi untuk mendapatkan film dengan rating tertinggi
export async function getTopRatedMovies(page = 1) {
  try {
    const data = await fetchApi(`/movie/top_rated?page=${page}`);
    return data.results || [];
  } catch (error) {
    console.error('Error fetching top rated movies:', error.message);
    return [];
  }
}

// Fungsi untuk mendapatkan TV series dengan rating tertinggi
export async function getTopRatedTvSeries(page = 1) {
  try {
    const data = await fetchApi(`/tv/top_rated?page=${page}`);
    return data.results || [];
  } catch (error) {
    console.error('Error fetching top rated TV series:', error.message);
    return [];
  }
}

// Fungsi untuk mendapatkan film yang sedang tayang di bioskop
export async function getNowPlayingMovies(page = 1) {
  try {
    const data = await fetchApi(`/movie/now_playing?page=${page}`);
    return data.results || [];
  } catch (error) {
    console.error('Error fetching now playing movies:', error.message);
    return [];
  }
}

// Fungsi untuk mendapatkan film yang akan datang
export async function getUpcomingMovies(page = 1) {
  try {
    const data = await fetchApi(`/movie/upcoming?page=${page}`);
    return data.results || [];
  } catch (error) {
    console.error('Error fetching upcoming movies:', error.message);
    return [];
  }
}

// Fungsi untuk mendapatkan TV series yang sedang tayang
export async function getOnTheAirTvSeries(page = 1) {
  try {
    const data = await fetchApi(`/tv/on_the_air?page=${page}`);
    return data.results || [];
  } catch (error) {
    console.error('Error fetching on the air TV series:', error.message);
    return [];
  }
}

// Fungsi untuk mendapatkan TV series yang akan datang
export async function getAiringTodayTvSeries(page = 1) {
  try {
    const data = await fetchApi(`/tv/airing_today?page=${page}`);
    return data.results || [];
  } catch (error) {
    console.error('Error fetching airing today TV series:', error.message);
    return [];
  }
}

// Fungsi untuk mendapatkan film berdasarkan perusahaan produksi
export async function getMoviesByProductionCompany(companyId, page = 1) {
  try {
    const data = await fetchApi(`/discover/movie?with_companies=${companyId}&page=${page}`);
    return data.results || [];
  } catch (error) {
    console.error(`Error fetching movies by company ID ${companyId}:`, error.message);
    return [];
  }
}

// Fungsi untuk mendapatkan rekomendasi film
export async function getMovieRecommendations(movieId, page = 1) {
  try {
    const data = await fetchApi(`/movie/${movieId}/recommendations?page=${page}`);
    return data.results || [];
  } catch (error) {
    console.error(`Error fetching movie recommendations for ID ${movieId}:`, error.message);
    return [];
  }
}

// Fungsi untuk mendapatkan rekomendasi TV series
export async function getTvSeriesRecommendations(tvId, page = 1) {
  try {
    const data = await fetchApi(`/tv/${tvId}/recommendations?page=${page}`);
    return data.results || [];
  } catch (error) {
    console.error(`Error fetching TV series recommendations for ID ${tvId}:`, error.message);
    return [];
  }
}

// Fungsi untuk membuat slug dari judul
export const createSlug = (title) => {
  if (!title) return '';
  
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // Hapus karakter tidak valid
    .replace(/\s+/g, '-') // Ganti spasi dengan dash
    .replace(/-+/g, '-') // Gabungkan multiple dash
    .trim();
};

// Fungsi untuk mendapatkan film berdasarkan rentang tanggal rilis
export async function getMoviesByReleaseDate(startDate, endDate, page = 1) {
  try {
    const data = await fetchApi(`/discover/movie?primary_release_date.gte=${startDate}&primary_release_date.lte=${endDate}&page=${page}`);
    return {
      results: data.results || [],
      total_pages: data.total_pages || 1,
      total_results: data.total_results || 0
    };
  } catch (error) {
    console.error(`Error fetching movies from ${startDate} to ${endDate}:`, error.message);
    return { results: [], total_pages: 0, total_results: 0 };
  }
}

// Fungsi untuk mendapatkan TV series berdasarkan rentang tanggal tayang pertama
export async function getTvSeriesByFirstAirDate(startDate, endDate, page = 1) {
  try {
    const data = await fetchApi(`/discover/tv?first_air_date.gte=${startDate}&first_air_date.lte=${endDate}&page=${page}`);
    return {
      results: data.results || [],
      total_pages: data.total_pages || 1,
      total_results: data.total_results || 0
    };
  } catch (error) {
    console.error(`Error fetching TV series from ${startDate} to ${endDate}:`, error.message);
    return { results: [], total_pages: 0, total_results: 0 };
  }
}

// Fungsi untuk mendapatkan film dengan rating tertentu
export async function getMoviesByRating(minRating = 7.0, page = 1) {
  try {
    const data = await fetchApi(`/discover/movie?vote_average.gte=${minRating}&vote_count.gte=100&page=${page}`);
    return {
      results: data.results || [],
      total_pages: data.total_pages || 1,
      total_results: data.total_results || 0
    };
  } catch (error) {
    console.error(`Error fetching movies with rating >= ${minRating}:`, error.message);
    return { results: [], total_pages: 0, total_results: 0 };
  }
}

// Fungsi untuk mendapatkan film berdasarkan bahasa
export async function getMoviesByLanguage(language = 'en', page = 1) {
  try {
    const data = await fetchApi(`/discover/movie?with_original_language=${language}&page=${page}`);
    return {
      results: data.results || [],
      total_pages: data.total_pages || 1,
      total_results: data.total_results || 0
    };
  } catch (error) {
    console.error(`Error fetching movies in ${language}:`, error.message);
    return { results: [], total_pages: 0, total_results: 0 };
  }
}

// Fungsi untuk mendapatkan film berdasarkan negara asal
export async function getMoviesByCountry(countryCode = 'US', page = 1) {
  try {
    const data = await fetchApi(`/discover/movie?with_origin_country=${countryCode}&page=${page}`);
    return {
      results: data.results || [],
      total_pages: data.total_pages || 1,
      total_results: data.total_results || 0
    };
  } catch (error) {
    console.error(`Error fetching movies from ${countryCode}:`, error.message);
    return { results: [], total_pages: 0, total_results: 0 };
  }
}

// Fungsi untuk mendapatkan film dengan kata kunci
export async function getMoviesByKeywords(keywordIds, page = 1) {
  try {
    const keywordString = Array.isArray(keywordIds) ? keywordIds.join(',') : keywordIds;
    const data = await fetchApi(`/discover/movie?with_keywords=${keywordString}&page=${page}`);
    return {
      results: data.results || [],
      total_pages: data.total_pages || 1,
      total_results: data.total_results || 0
    };
  } catch (error) {
    console.error(`Error fetching movies with keywords ${keywordIds}:`, error.message);
    return { results: [], total_pages: 0, total_results: 0 };
  }
}

// Fungsi untuk mencari kata kunci
export async function searchKeywords(query, page = 1) {
  if (!query || query.trim() === '') {
    return [];
  }
  
  try {
    const data = await fetchApi(`/search/keyword?query=${encodeURIComponent(query)}&page=${page}`);
    return data.results || [];
  } catch (error) {
    console.error(`Error searching keywords for '${query}':`, error.message);
    return [];
  }
}

// Fungsi untuk mendapatkan koleksi film
export async function getCollectionById(collectionId) {
  try {
    const data = await fetchApi(`/collection/${collectionId}`);
    return data;
  } catch (error) {
    console.error(`Error fetching collection ${collectionId}:`, error.message);
    return null;
  }
}

// Fungsi untuk mendapatkan perusahaan produksi
export async function getProductionCompany(companyId) {
  try {
    const data = await fetchApi(`/company/${companyId}`);
    return data;
  } catch (error) {
    console.error(`Error fetching production company ${companyId}:`, error.message);
    return null;
  }
}

// Fungsi untuk mencari perusahaan produksi
export async function searchProductionCompanies(query, page = 1) {
  if (!query || query.trim() === '') {
    return [];
  }
  
  try {
    const data = await fetchApi(`/search/company?query=${encodeURIComponent(query)}&page=${page}`);
    return data.results || [];
  } catch (error) {
    console.error(`Error searching companies for '${query}':`, error.message);
    return [];
  }
}

// Fungsi untuk mendapatkan film berdasarkan multiple criteria
export async function getAdvancedMovieSearch(params = {}) {
  try {
    const {
      genres = '',
      year = '',
      rating = '',
      keywords = '',
      companies = '',
      sortBy = 'popularity.desc',
      page = 1
    } = params;
    
    let queryString = `?page=${page}&sort_by=${sortBy}`;
    
    if (genres) queryString += `&with_genres=${genres}`;
    if (year) queryString += `&primary_release_year=${year}`;
    if (rating) queryString += `&vote_average.gte=${rating}`;
    if (keywords) queryString += `&with_keywords=${keywords}`;
    if (companies) queryString += `&with_companies=${companies}`;
    
    const data = await fetchApi(`/discover/movie${queryString}`);
    return {
      results: data.results || [],
      total_pages: data.total_pages || 1,
      total_results: data.total_results || 0
    };
  } catch (error) {
    console.error('Error in advanced movie search:', error.message);
    return { results: [], total_pages: 0, total_results: 0 };
  }
}

// Fungsi untuk mendapatkan TV series berdasarkan multiple criteria
export async function getAdvancedTvSearch(params = {}) {
  try {
    const {
      genres = '',
      year = '',
      rating = '',
      networks = '',
      sortBy = 'popularity.desc',
      page = 1
    } = params;
    
    let queryString = `?page=${page}&sort_by=${sortBy}`;
    
    if (genres) queryString += `&with_genres=${genres}`;
    if (year) queryString += `&first_air_date_year=${year}`;
    if (rating) queryString += `&vote_average.gte=${rating}`;
    if (networks) queryString += `&with_networks=${networks}`;
    
    const data = await fetchApi(`/discover/tv${queryString}`);
    return {
      results: data.results || [],
      total_pages: data.total_pages || 1,
      total_results: data.total_results || 0
    };
  } catch (error) {
    console.error('Error in advanced TV search:', error.message);
    return { results: [], total_pages: 0, total_results: 0 };
  }
}

// Fungsi untuk mendapatkan watch providers film
export async function getMovieWatchProviders(movieId) {
  try {
    const data = await fetchApi(`/movie/${movieId}/watch/providers`);
    return data.results || {};
  } catch (error) {
    console.error(`Error fetching watch providers for movie ${movieId}:`, error.message);
    return {};
  }
}

// Fungsi untuk mendapatkan watch providers TV series
export async function getTvSeriesWatchProviders(tvId) {
  try {
    const data = await fetchApi(`/tv/${tvId}/watch/providers`);
    return data.results || {};
  } catch (error) {
    console.error(`Error fetching watch providers for TV series ${tvId}:`, error.message);
    return {};
  }
}

// Fungsi untuk mendapatkan film berdasarkan watch provider
export async function getMoviesByWatchProvider(providerId, page = 1) {
  try {
    const data = await fetchApi(`/discover/movie?with_watch_providers=${providerId}&watch_region=US&page=${page}`);
    return {
      results: data.results || [],
      total_pages: data.total_pages || 1,
      total_results: data.total_results || 0
    };
  } catch (error) {
    console.error(`Error fetching movies for provider ${providerId}:`, error.message);
    return { results: [], total_pages: 0, total_results: 0 };
  }
}

// Fungsi untuk mendapatkan episode details TV series
export async function getTvSeriesEpisodeDetails(tvId, seasonNumber, episodeNumber) {
  try {
    const data = await fetchApi(`/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}`);
    return data;
  } catch (error) {
    console.error(`Error fetching episode details for ${tvId} S${seasonNumber}E${episodeNumber}:`, error.message);
    return null;
  }
}

// Fungsi untuk mendapatkan season details TV series
export async function getTvSeriesSeasonDetails(tvId, seasonNumber) {
  try {
    const data = await fetchApi(`/tv/${tvId}/season/${seasonNumber}`);
    return data;
  } catch (error) {
    console.error(`Error fetching season details for ${tvId} season ${seasonNumber}:`, error.message);
    return null;
  }
}

// Fungsi untuk mendapatkan images film
export async function getMovieImages(movieId) {
  try {
    const data = await fetchApi(`/movie/${movieId}/images`);
    return data;
  } catch (error) {
    console.error(`Error fetching images for movie ${movieId}:`, error.message);
    return null;
  }
}

// Fungsi untuk mendapatkan images TV series
export async function getTvSeriesImages(tvId) {
  try {
    const data = await fetchApi(`/tv/${tvId}/images`);
    return data;
  } catch (error) {
    console.error(`Error fetching images for TV series ${tvId}:`, error.message);
    return null;
  }
}

// Fungsi untuk mendapatkan images person
export async function getPersonImages(personId) {
  try {
    const data = await fetchApi(`/person/${personId}/images`);
    return data;
  } catch (error) {
    console.error(`Error fetching images for person ${personId}:`, error.message);
    return null;
  }
}

// Fungsi untuk mendapatkan external IDs
export async function getMovieExternalIds(movieId) {
  try {
    const data = await fetchApi(`/movie/${movieId}/external_ids`);
    return data;
  } catch (error) {
    console.error(`Error fetching external IDs for movie ${movieId}:`, error.message);
    return null;
  }
}

// Fungsi untuk mendapatkan external IDs TV series
export async function getTvSeriesExternalIds(tvId) {
  try {
    const data = await fetchApi(`/tv/${tvId}/external_ids`);
    return data;
  } catch (error) {
    console.error(`Error fetching external IDs for TV series ${tvId}:`, error.message);
    return null;
  }
}

// Fungsi untuk mendapatkan external IDs person
export async function getPersonExternalIds(personId) {
  try {
    const data = await fetchApi(`/person/${personId}/external_ids`);
    return data;
  } catch (error) {
    console.error(`Error fetching external IDs for person ${personId}:`, error.message);
    return null;
  }
}

// FUNGSI BARU YANG DIPERLUKAN UNTUK RANKINGS

// Fungsi untuk mendapatkan film trending mingguan
export async function getTrendingMoviesWeekly(page = 1) {
  try {
    const data = await fetchApi(`/trending/movie/week?page=${page}`);
    return {
      results: data.results || [],
      total_pages: data.total_pages || 1,
      total_results: data.total_results || 0
    };
  } catch (error) {
    console.error('Error fetching weekly trending movies:', error.message);
    return { results: [], total_pages: 0, total_results: 0 };
  }
}

// Fungsi untuk mendapatkan TV series trending mingguan
export async function getTrendingTvSeriesWeekly(page = 1) {
  try {
    const data = await fetchApi(`/trending/tv/week?page=${page}`);
    return {
      results: data.results || [],
      total_pages: data.total_pages || 1,
      total_results: data.total_results || 0
    };
  } catch (error) {
    console.error('Error fetching weekly trending TV series:', error.message);
    return { results: [], total_pages: 0, total_results: 0 };
  }
}

// Fungsi untuk mendapatkan film populer
export async function getPopularMovies(page = 1) {
  try {
    const data = await fetchApi(`/movie/popular?page=${page}`);
    return {
      results: data.results || [],
      total_pages: data.total_pages || 1,
      total_results: data.total_results || 0
    };
  } catch (error) {
    console.error('Error fetching popular movies:', error.message);
    return { results: [], total_pages: 0, total_results: 0 };
  }
}

// Fungsi untuk mendapatkan TV series populer
export async function getPopularTvSeries(page = 1) {
  try {
    const data = await fetchApi(`/tv/popular?page=${page}`);
    return {
      results: data.results || [],
      total_pages: data.total_pages || 1,
      total_results: data.total_results || 0
    };
  } catch (error) {
    console.error('Error fetching popular TV series:', error.message);
    return { results: [], total_pages: 0, total_results: 0 };
  }
}

// Export default untuk kemudahan import
const apiFunctions = {
  getMovieById,
  getTvSeriesById,
  getMovieVideos,
  getTvSeriesVideos,
  getMovieCredits,
  getMovieReviews,
  getTvSeriesCredits,
  getTvSeriesReviews,
  searchMoviesAndTv,
  getMoviesByCategory,
  getTvSeriesByCategory,
  getSimilarMovies,
  getSimilarTvSeries,
  getMovieByTitle,
  getTvSeriesByTitle,
  getMovieGenres,
  getTvSeriesGenres,
  getMoviesByGenre,
  getTvSeriesByGenre,
  getTrendingMoviesDaily,
  getTrendingTvSeriesDaily,
  getMoviesByYear,
  getMoviesByDecade,
  getPersonById,
  getPersonMovieCredits,
  getPersonTvCredits,
  searchPeople,
  getPopularPeople,
  getTopRatedMovies,
  getTopRatedTvSeries,
  getNowPlayingMovies,
  getUpcomingMovies,
  getOnTheAirTvSeries,
  getAiringTodayTvSeries,
  getMoviesByProductionCompany,
  getMovieRecommendations,
  getTvSeriesRecommendations,
  createSlug,
  getMoviesByReleaseDate,
  getTvSeriesByFirstAirDate,
  getMoviesByRating,
  getMoviesByLanguage,
  getMoviesByCountry,
  getMoviesByKeywords,
  searchKeywords,
  getCollectionById,
  getProductionCompany,
  searchProductionCompanies,
  getAdvancedMovieSearch,
  getAdvancedTvSearch,
  getMovieWatchProviders,
  getTvSeriesWatchProviders,
  getMoviesByWatchProvider,
  getTvSeriesEpisodeDetails,
  getTvSeriesSeasonDetails,
  getMovieImages,
  getTvSeriesImages,
  getPersonImages,
  getMovieExternalIds,
  getTvSeriesExternalIds,
  getPersonExternalIds,
  getTrendingMoviesWeekly,
  getTrendingTvSeriesWeekly,
  getPopularMovies,
  getPopularTvSeries
};

export default apiFunctions;