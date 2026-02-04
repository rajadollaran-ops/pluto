// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://watchpluto.netlify.app'
  const isProduction = process.env.NODE_ENV === 'production'
  
  return {
    rules: [
      // Global rules for all crawlers
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/private/',
          '/_next/static/',
          '/_next/data/',
          '/node_modules/',
          // Block common tracking parameters
          '/*?*utm_',
          '/*?*fbclid=',
          '/*?*gclid=',
          '/*?*ref=',
        ],
      },
      
      // Googlebot specific rules (more permissive)
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/private/',
          // Allow Google to crawl pagination/sort for better indexing
          // '/*?*sort=',  // Comment out: allow Google to index sorted pages
          // '/*?*page=',  // Comment out: allow pagination indexing
          '/*?*filter=', // Still block filters (can create duplicate content)
        ],
        // Optional: crawl delay for Googlebot
        crawlDelay: isProduction ? 0.5 : 1,
      },
      
      // Bingbot
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/private/'],
        crawlDelay: isProduction ? 0.5 : 1,
      },
      
      // Block SEO spam bots
      {
        userAgent: [
          'AhrefsBot',
          'SEMrushBot', 
          'MJ12bot',
          'DotBot',
          'MauiBot',
          'PetalBot',
          'Bytespider', // TikTok bot
        ],
        disallow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}