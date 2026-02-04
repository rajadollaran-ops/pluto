import './globals.css';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import AdsterraLayoutWrapper from '../components/layout/AdsterraLayoutWrapper'; // ✅ PATH DIPERBAIKI
import AdBanner from '../components/ads/AdBanner'; // ✅ Komponen baru untuk banner

export const metadata = {
  title: 'Pluto Tv | Watch Movies, Stream TV Series Free - Complete Movie Database',
  description: 'Pluto Tv is your ultimate movie database with 10,000+ movies, 5,000+ TV series, actor profiles, genre pages, and yearly archives. Discover, stream, and enjoy cinematic excellence with our comprehensive entertainment platform.',
  keywords: 'movies, tv series, streaming, movie database, actors, genres, rankings, movie archives',
  openGraph: {
    title: 'Pluto Tv | Complete Movie & TV Series Database',
    description: 'Your ultimate destination for movies, TV series, actor profiles, and streaming information. Explore genres, yearly archives, and top rankings.',
    url: 'https://watchpluto.netlify.app',
    siteName: 'Pluto Tv',
    images: [
      {
        url: 'https://live.staticflickr.com/65535/55076839917_32aed5ec3d_b.jpg',
        width: 1200,
        height: 630,
        alt: 'Pluto Tv - Complete Movie Database',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@WatchStream123',
    creator: '@WatchStream123',
    title: 'Pluto Tv | Complete Movie & TV Series Database',
    description: 'Explore 10,000+ movies, 5,000+ TV series, actor profiles, and streaming guides on Pluto Tv.',
    images: ['https://live.staticflickr.com/65535/55076839917_32aed5ec3d_b.jpg'],
  },
  // Tambahkan tag meta eksplisit untuk Facebook
  other: {
    'fb:app_id': '100074345305108',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
	  <head>
        {/* Tag verifikasi Google Search Console */}
        <meta name="google-site-verification" content="9L7SW88OHdYLNl3-AZq5AHbogE36Q4SDTfDHvKuxq6s" />
        {/* Schema.org markup untuk Movie Database */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MovieDatabase",
              "name": "Pluto Tv",
              "description": "Complete movie and TV series database with streaming information",
              "url": "https://watchpluto.netlify.app",
              "logo": "https://live.staticflickr.com/65535/55076839917_32aed5ec3d_b.jpg",
              "sameAs": [
                "https://watchpluto.netlify.app"
              ]
            })
          }}
        />
      </head>
      <body>
        <AdsterraLayoutWrapper>
          <div className="flex flex-col min-h-screen bg-slate-900">
            <header className="w-full max-w-7xl mx-auto px-4 py-4 sticky top-0 z-50 bg-slate-900 shadow-lg">
              <Navbar />
            </header>
            
            {/* ✅ Banner 728x90 di bawah navbar */}
            <div className="w-full bg-slate-900 py-2">
              <div className="max-w-7xl mx-auto px-4 flex justify-center">
                <AdBanner 
                  adId="728x90_banner_navbar"
                  scriptKey="57ecdde0dd3abf21f7d921b1cf731d89"
                  height={90}
                  width={728}
                  className="rounded-lg overflow-hidden shadow-lg"
                />
              </div>
            </div>
            
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 py-8 mt-2">
              {children}
            </main>
            
            <footer className="w-full max-w-7xl mx-auto px-4 py-8">
              {/* Tempatkan div Native Banner di sini, sebelum Footer */}
              <div id="container-1ca2cd5e57f936d5abb07f32e2abce9f"></div>
              <Footer />
            </footer>
          </div>
        </AdsterraLayoutWrapper>
      </body>
    </html>
  );
}