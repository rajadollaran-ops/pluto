import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaFire, FaStar, FaTv, FaFilm, FaUser, FaTrophy, FaQuestionCircle, FaSearch, FaCalendarAlt, FaVideo } from 'react-icons/fa';

// Data genre dari file awal dengan link yang benar
const genres = [
  { name: 'Action', link: '/movie/genre/action', color: 'text-orange-300' },
  { name: 'Adventure', link: '/movie/genre/adventure', color: 'text-blue-300' },
  { name: 'Sci-Fi', link: '/movie/genre/science-fiction', color: 'text-purple-300' },
  { name: 'Anime', link: '/movie/genre/animation', color: 'text-pink-300' },
  { name: 'Crime', link: '/movie/genre/crime', color: 'text-yellow-300' },
  { name: 'Horror', link: '/movie/genre/horror', color: 'text-red-300' },
  { name: 'Comedy', link: '/movie/genre/comedy', color: 'text-green-300' },
  { name: 'Romance', link: '/movie/genre/romance', color: 'text-pink-400' },
  { name: 'Thriller', link: '/movie/genre/thriller', color: 'text-indigo-300' },
  { name: 'Mystery', link: '/movie/genre/mystery', color: 'text-gray-300' },
  { name: 'War', link: '/movie/genre/war', color: 'text-amber-300' },
  { name: 'Fantasy', link: '/movie/genre/fantasy', color: 'text-teal-300' },
];

// API functions
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

async function getTrendingDaily() {
  try {
    const response = await fetch(`${BASE_URL}/trending/all/day?api_key=${API_KEY}&language=en-US&page=1`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching trending content:', error);
    return [];
  }
}

// Utility function untuk membuat slug TANPA ID
const createMovieSlug = (item) => {
  const title = item.title || item.name;
  if (!title) return 'unknown';
  
  const baseSlug = title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  
  const year = item.release_date ? 
    item.release_date.substring(0, 4) : 
    (item.first_air_date ? item.first_air_date.substring(0, 4) : '2024');
  
  return `${baseSlug}-${year}`;
};

// MediaCard component untuk trending content
const MediaCard = ({ item }) => {
  const isTV = item.media_type === 'tv' || item.name;
  const title = item.title || item.name;
  const date = isTV ? item.first_air_date : item.release_date;
  const year = date ? new Date(date).getFullYear() : 'TBA';
  
  const slug = createMovieSlug(item);
  
  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-slate-600 transition-colors" itemScope itemType={isTV ? "https://schema.org/TVSeries" : "https://schema.org/Movie"}>
      <Link href={isTV ? `/tv-show/${slug}` : `/movie/${slug}`} className="block">
        <div className="relative aspect-[2/3] overflow-hidden">
          {item.poster_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
              alt={`${title} poster - ${isTV ? 'TV Series' : 'Movie'} from ${year}`}
              width={500}
              height={750}
              className="object-cover w-full h-full"
              unoptimized={false}
              priority={false}
              itemProp="image"
            />
          ) : (
            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
              {isTV ? <FaTv className="text-4xl text-gray-500" /> : <FaFilm className="text-4xl text-gray-500" />}
            </div>
          )}
          
          {/* Type Badge */}
          <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {isTV ? 'TV' : 'Movie'}
          </div>
          
          {/* Rating */}
          {item.vote_average > 0 && (
            <div className="absolute top-2 right-2 bg-purple-900 text-white text-xs px-2 py-1 rounded font-bold flex items-center gap-1">
              ⭐ {item.vote_average.toFixed(1)}
            </div>
          )}
        </div>
        
        <div className="p-3">
          <h3 className="font-semibold text-white text-sm line-clamp-1 mb-1" itemProp="name">
            {title}
          </h3>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span itemProp="datePublished">{year}</span>
            <span className={`px-2 py-1 rounded ${isTV ? 'bg-blue-500/20 text-blue-300' : 'bg-purple-500/20 text-purple-300'}`}>
              {isTV ? 'TV Series' : 'Movie'}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

// Breadcrumb Component
const Breadcrumb = () => (
  <nav className="container mx-auto px-4 py-2" aria-label="Breadcrumb">
    <ol className="flex items-center space-x-2 text-sm text-gray-400">
      <li>
        <Link href="/" className="hover:text-white transition-colors" itemProp="item">
          <span itemProp="name">Home</span>
        </Link>
        <meta itemProp="position" content="1" />
      </li>
      <li className="flex items-center">
        <span className="mx-2">/</span>
      </li>
      <li className="text-white" aria-current="page">
        <span itemProp="name">Trending Movies & TV Shows</span>
        <meta itemProp="position" content="2" />
      </li>
    </ol>
  </nav>
);

export default async function HomePage() {
  let trendingContent = [];
  let movieCount = 0;
  let tvCount = 0;

  try {
    const trendingData = await getTrendingDaily();
    
    trendingContent = trendingData
      .filter(item => item.poster_path)
      .slice(0, 20);
    
    movieCount = trendingContent.filter(item => item.media_type === 'movie' || item.title).length;
    tvCount = trendingContent.filter(item => item.media_type === 'tv' || item.name).length;
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  // Schema Markup untuk SEO
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://watchpluto.netlify.app/#website",
        "url": "https://watchpluto.netlify.app/",
        "name": "Pluto Tv",
        "description": "Discover trending movies and TV series to stream today across Netflix, Disney+, Prime Video, Hulu, HBO Max and other streaming platforms",
        "potentialAction": [{
          "@type": "SearchAction",
          "target": "https://watchpluto.netlify.app/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }],
        "inLanguage": "en-US"
      },
      {
        "@type": "WebPage",
        "@id": "https://watchpluto.netlify.app/#webpage",
        "url": "https://watchpluto.netlify.app/",
        "name": "Pluto Tv | Trending Movies & TV Shows to Stream Today",
        "description": "Watch trending movies and TV series for free. Discover what's popular today across Netflix, Disney+, Prime Video. Daily updated trending content.",
        "isPartOf": { "@id": "https://watchpluto.netlify.app/#website" },
        "about": "Movie and TV show streaming guide",
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "url": "https://live.staticflickr.com/65535/55076839917_32aed5ec3d_b.jpg",
          "width": 1200,
          "height": 630
        },
        "datePublished": "2024-01-01",
        "dateModified": new Date().toISOString().split('T')[0],
        "breadcrumb": { "@id": "https://watchpluto.netlify.app/#breadcrumb" }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://watchpluto.netlify.app/#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://watchpluto.netlify.app/"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How often is trending content updated on Pluto Tv?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We update trending movies and TV shows daily with the latest data from all major streaming platforms including Netflix, Disney+, Prime Video, Hulu, and HBO Max."
            }
          },
          {
            "@type": "Question",
            "name": "Can I find where to stream movies for free on Pluto Tv?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! Pluto Tv provides information on both free streaming options (ad-supported platforms) and premium subscription services, helping you find the most cost-effective way to watch your favorite content."
            }
          },
          {
            "@type": "Question",
            "name": "Does Pluto Tv cover international movies and TV shows?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Absolutely. We track trending content from Hollywood blockbusters to international cinema, including anime, Korean dramas, European films, and content from around the world."
            }
          },
          {
            "@type": "Question",
            "name": "How does Pluto Tv determine what's trending?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Our algorithm analyzes daily popularity spikes, social media buzz, streaming platform data, and viewer engagement metrics to determine what people are watching right now across all major services."
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* JSON-LD Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
      
      {/* Breadcrumb Navigation */}
      <Breadcrumb />

      {/* Hero Section dengan H1 yang dioptimalkan */}
      <section className="relative bg-gradient-to-r from-purple-900/80 to-slate-900 py-16 lg:py-20" itemScope itemType="https://schema.org/WPHeader">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 text-white" itemProp="headline">
            Pluto Tv | Trending Movies & TV Shows to Stream Today
          </h1>
          <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto" itemProp="description">
            Discover what's trending right now across all streaming platforms. Daily updated with the hottest movies and TV series available to watch online.
          </p>
          
          {/* LSI Keywords Section */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <span className="bg-slate-800/50 text-gray-300 text-sm px-3 py-1 rounded-full flex items-center gap-1">
              <FaVideo className="text-xs" /> binge-watch series
            </span>
            <span className="bg-slate-800/50 text-gray-300 text-sm px-3 py-1 rounded-full flex items-center gap-1">
              <FaSearch className="text-xs" /> movie recommendations
            </span>
            <span className="bg-slate-800/50 text-gray-300 text-sm px-3 py-1 rounded-full flex items-center gap-1">
              <FaCalendarAlt className="text-xs" /> new releases 2024
            </span>
            <span className="bg-slate-800/50 text-gray-300 text-sm px-3 py-1 rounded-full flex items-center gap-1">
              <FaStar className="text-xs" /> top rated shows
            </span>
            <span className="bg-slate-800/50 text-gray-300 text-sm px-3 py-1 rounded-full flex items-center gap-1">
              <FaTv className="text-xs" /> streaming guide
            </span>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Trending Content Section */}
        <section className="mb-16" itemScope itemType="https://schema.org/ItemList">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <FaFire className="text-red-500 text-2xl" />
              Trending Today
              <span className="text-sm bg-blue-800 text-white px-2 py-1 rounded-full">Daily Updates</span>
            </h2>
            <div className="text-sm text-gray-400">
              <span className="text-blue-300">{movieCount} Movies</span> • 
              <span className="text-purple-300 ml-2">{tvCount} TV Shows</span>
            </div>
          </div>
          
          {trendingContent.length > 0 ? (
            <>
              <meta itemProp="name" content="Trending Movies & TV Shows Today" />
              <meta itemProp="description" content="Daily updated list of trending movies and TV series across all streaming platforms" />
              <meta itemProp="numberOfItems" content={trendingContent.length} />
              
              {/* Grid for trending content */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 mb-8">
                {trendingContent.map((item, index) => (
                  <div key={`${item.id}-${item.media_type}`} itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                    <meta itemProp="position" content={index + 1} />
                    <MediaCard item={item} />
                  </div>
                ))}
              </div>
              
              {/* Daily Stats */}
              <div className="bg-slate-800/50 p-6 rounded-xl mb-8">
                <h3 className="text-xl font-semibold mb-4 text-center text-orange-300">Today's Trending Stats</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-slate-700/50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-white">{trendingContent.length}</div>
                    <div className="text-gray-300 text-sm">Total Trending Items</div>
                  </div>
                  <div className="bg-slate-700/50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-300">{movieCount}</div>
                    <div className="text-gray-300 text-sm">Trending Movies</div>
                  </div>
                  <div className="bg-slate-700/50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-300">{tvCount}</div>
                    <div className="text-gray-300 text-sm">Trending TV Shows</div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 bg-slate-800 rounded-lg border border-slate-700">
              <FaFire className="text-4xl text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No trending content available at the moment. Check back soon!</p>
            </div>
          )}
        </section>

        {/* SEO-Optimized About Section dengan LSI Keywords tambahan */}
        <section className="mb-16 bg-slate-800/50 p-6 md:p-8 rounded-xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-orange-300">
            Pluto Tv: Your Ultimate Streaming Discovery Platform
          </h2>
          
          <div className="space-y-6 text-gray-300">
            <h3 className="text-xl md:text-2xl font-semibold text-blue-300 mb-4">What is Pluto Tv?</h3>
            
            <p>
              Pluto Tv is America's premier movie and TV show discovery platform that answers the most common search queries like <strong>"what's trending on Netflix today"</strong>, <strong>"best movies to watch right now"</strong>, <strong>"top TV shows this week"</strong>, and <strong>"where to stream new releases"</strong>. We provide real-time trending data across all major streaming platforms including Netflix, Disney+, Amazon Prime Video, Hulu, HBO Max, Apple TV+, and free streaming services.
            </p>

            <h3 className="text-xl md:text-2xl font-semibold text-blue-300 mb-4">Daily Trending Updates</h3>
            
            <p>
              Unlike traditional movie databases, Pluto Tv focuses on what's trending right now. Our algorithm tracks daily <strong>popularity spikes</strong>, <strong>social media buzz</strong>, and <strong>streaming platform data</strong> to show you exactly what people are watching today. Whether you're searching for <strong>"trending movies 2024"</strong>, <strong>"popular TV series this month"</strong>, or <strong>"what to watch tonight"</strong>, we deliver up-to-the-minute recommendations based on real-world viewing patterns.
            </p>

            <h3 className="text-xl md:text-2xl font-semibold text-blue-300 mb-4">Streaming Availability & Platform Integration</h3>
            
            <p>
              Every trending title on Pluto Tv includes detailed <strong>streaming information</strong> showing exactly where you can watch it. We track availability across Netflix, Disney+, Prime Video, Hulu, HBO Max, Peacock, Paramount+, and free ad-supported platforms. Our platform answers queries like <strong>"where to watch [movie title] free"</strong>, <strong>"is [TV show] on Netflix"</strong>, and <strong>"streaming services with [movie]"</strong>. We also monitor regional availability and subscription requirements.
            </p>

            {/* Popular Genres Section in About */}
            <h3 className="text-xl md:text-2xl font-semibold text-blue-300 mb-4">Explore Popular Genres</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              {genres.map((genre, index) => (
                <Link 
                  key={index} 
                  href={genre.link}
                  className="bg-gray-700/50 p-4 rounded-lg hover:bg-gray-600/50 transition flex flex-col items-center justify-center"
                >
                  <div className={`font-semibold ${genre.color}`}>
                    {genre.name}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Browse {genre.name} →
                  </div>
                </Link>
              ))}
            </div>

            <h3 className="text-xl md:text-2xl font-semibold text-blue-300 mb-4">Comprehensive Content Discovery</h3>
            
            <p>
              Pluto Tv helps you discover content across all genres including <strong>Action</strong>, <strong>Adventure</strong>, <strong>Sci-Fi</strong>, <strong>Anime</strong>, <strong>Crime</strong>, <strong>Horror</strong>, <strong>Comedy</strong>, <strong>Romance</strong>, <strong>Thriller</strong>, <strong>Mystery</strong>, <strong>War</strong>, <strong>Fantasy</strong>, and more. Each trending item includes ratings, reviews, cast information, and similar recommendations. We answer search queries like <strong>"movies like [favorite film]"</strong>, <strong>"best [genre] shows on [platform]"</strong>, and <strong>"top rated [genre] movies 2024"</strong>.
            </p>

            {/* FAQ Section dengan Schema Markup */}
            <div className="bg-slate-900/50 p-6 rounded-lg mt-8">
              <h3 className="text-xl md:text-2xl font-semibold text-orange-300 mb-4 flex items-center gap-2">
                <FaQuestionCircle /> Frequently Asked Questions
              </h3>
              
              <div className="space-y-4">
                <div className="faq-item" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                  <h4 className="font-semibold text-blue-300 mb-2" itemProp="name">How often is trending content updated on Pluto Tv?</h4>
                  <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                    <p className="text-gray-300" itemProp="text">
                      We update trending movies and TV shows daily with the latest data from all major streaming platforms including Netflix, Disney+, Prime Video, Hulu, and HBO Max.
                    </p>
                  </div>
                </div>
                
                <div className="faq-item" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                  <h4 className="font-semibold text-blue-300 mb-2" itemProp="name">Can I find where to stream movies for free on Pluto Tv?</h4>
                  <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                    <p className="text-gray-300" itemProp="text">
                      Yes! Pluto Tv provides information on both free streaming options (ad-supported platforms) and premium subscription services, helping you find the most cost-effective way to watch your favorite content.
                    </p>
                  </div>
                </div>
                
                <div className="faq-item" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                  <h4 className="font-semibold text-blue-300 mb-2" itemProp="name">Does Pluto Tv cover international movies and TV shows?</h4>
                  <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                    <p className="text-gray-300" itemProp="text">
                      Absolutely. We track trending content from Hollywood blockbusters to international cinema, including anime, Korean dramas, European films, and content from around the world.
                    </p>
                  </div>
                </div>
                
                <div className="faq-item" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                  <h4 className="font-semibold text-blue-300 mb-2" itemProp="name">How does Pluto Tv determine what's trending?</h4>
                  <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                    <p className="text-gray-300" itemProp="text">
                      Our algorithm analyzes daily popularity spikes, social media buzz, streaming platform data, and viewer engagement metrics to determine what people are watching right now across all major services.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="text-xl md:text-2xl font-semibold text-blue-300 mb-4">Quality & Viewing Experience</h3>
            
            <p>
              We prioritize viewing quality by highlighting availability in <strong>HD</strong>, <strong>4K</strong>, <strong>HDR</strong>, and <strong>Dolby</strong> formats. Each listing includes content ratings, episode guides for TV series, parental guidance, and accessibility features. Pluto Tv helps users make informed decisions about what to watch based on quality preferences and viewing restrictions.
            </p>

            <h3 className="text-xl md:text-2xl font-semibold text-blue-300 mb-4">Why Choose Pluto Tv Over Other Platforms?</h3>
            
            <p>
              Pluto Tv stands out with its real-time trending algorithm, comprehensive streaming availability data, and user-friendly interface. While other platforms show static ratings or editorial picks, Pluto Tv dynamically updates based on what's actually being watched right now across all major streaming services. We combine critic scores with audience popularity and social buzz to give you the most accurate picture of what's worth your time.
            </p>

            <h3 className="text-xl md:text-2xl font-semibold text-blue-300 mb-4">Mobile-Optimized & Social Features</h3>
            
            <p>
              Our platform is fully optimized for mobile devices, allowing you to discover trending content on the go. Create personalized watchlists, follow specific actors or directors, receive notifications when trending titles become available on your preferred platforms, and share recommendations with friends. Pluto Tv integrates with social media to show you what your friends are watching and discussing.
            </p>

            <h3 className="text-xl md:text-2xl font-semibold text-blue-300 mb-4">Start Your Streaming Journey Today</h3>
            
            <p>
              Join millions of users who trust Pluto Tv to answer their <strong>"what to watch"</strong> questions. Whether you're searching for <strong>"trending Netflix shows today"</strong>, <strong>"popular movies on Prime Video this week"</strong>, <strong>"new releases on Disney+"</strong>, or <strong>"free streaming movies"</strong>, Pluto Tv provides accurate, timely information to enhance your entertainment experience. Our platform continuously monitors streaming trends, new releases, and audience preferences to ensure you never miss out on must-watch content.
            </p>
          </div>
        </section>

        {/* Final Call to Action */}
        <section className="text-center py-12 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-2xl border border-slate-700">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Never Miss What's Trending</h2>
          <p className="text-base md:text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Get daily updates on the hottest movies and TV shows across all streaming platforms. Discover binge-worthy series, movie recommendations, and new releases 2024.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/movie/popular" 
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <FaFilm /> Browse Movies
            </Link>
            <Link 
              href="/tv-show/popular" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <FaTv /> Browse TV Series
            </Link>
            <Link 
              href="/people" 
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <FaUser /> Discover Actors
            </Link>
          </div>
          <p className="mt-8 text-gray-400 max-w-3xl mx-auto text-xs md:text-sm">
            Pluto Tv • Trending Movies & TV Shows • Daily Updates • Streaming Availability • Netflix • Disney+ • Prime Video • Hulu • HBO Max • Free Streaming • HD Quality • What to Watch • Best Movies 2024 • Popular TV Series • Entertainment Guide • Movie Recommendations • Binge-Watch Series • New Releases • Top Rated Shows
          </p>
        </section>
      </div>
    </div>
  );
}

// Metadata untuk SEO
export const metadata = {
  title: 'Pluto Tv | Trending Movies & TV Shows to Stream Today - Daily Updates',
  description: 'Watch trending movies and TV series for free. Discover what\'s popular today across Netflix, Disney+, Prime Video. Daily updated trending content, movie recommendations, and binge-worthy series.',
  keywords: 'trending movies, trending tv shows, watch online free, daily updates, Netflix trending, Disney+ new releases, streaming guide, movie recommendations, binge-watch series, what to watch, new releases 2024, top rated shows, popular TV series',
  openGraph: {
    title: 'Pluto Tv | Trending Movies & TV Shows to Stream Today',
    description: 'Discover what\'s trending today across all streaming platforms. Daily updated with the hottest movies and TV series available to watch online.',
    url: 'https://watchpluto.netlify.app/',
    siteName: 'Pluto Tv',
    images: [
      {
        url: 'https://live.staticflickr.com/65535/55076839917_32aed5ec3d_b.jpg',
        width: 1200,
        height: 630,
        alt: 'Pluto Tv - Trending Movies & TV Series to Stream Today',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@Pluto TvMovies',
    creator: '@Pluto TvMovies',
    title: 'Pluto Tv | Trending Movies & TV Shows to Stream Today',
    description: 'Discover what\'s trending today across all streaming platforms on Pluto Tv.',
    images: ['https://live.staticflickr.com/65535/55076839917_32aed5ec3d_b.jpg'],
  },
  alternates: {
    canonical: 'https://watchpluto.netlify.app/',
  },
};

export const dynamic = 'force-dynamic';