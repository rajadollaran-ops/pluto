// app/rss/page.js
'use client';

import { useState } from 'react';

export default function RSS() {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const rssFeeds = [
    {
      title: "Latest Movies",
      description: "Get updates on the newest movies added to our database",
      url: "/rss/latest-movies.xml",
      category: "Movies"
    },
    {
      title: "New TV Shows",
      description: "Stay updated with the latest TV shows and episodes",
      url: "/rss/new-tv-shows.xml",
      category: "TV Shows"
    },
    {
      title: "Popular Content",
      description: "Most popular movies and shows based on user ratings",
      url: "/rss/popular.xml",
      category: "Popular"
    },
    {
      title: "Upcoming Releases",
      description: "Get notified about upcoming movie and TV show releases",
      url: "/rss/upcoming.xml",
      category: "Upcoming"
    },
    {
      title: "News & Updates",
      description: "Latest news and updates from 123Movies",
      url: "/rss/news.xml",
      category: "News"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-white mb-6">RSS Feeds</h1>
      
      <div className="bg-slate-800 p-6 rounded-lg text-gray-300 mb-8 text-justify">
        <h2 className="text-xl font-semibold text-white mb-4">What are RSS Feeds?</h2>
        <p className="mb-4">
          RSS (Really Simple Syndication) feeds allow you to stay updated with the latest content from 123Movies 
          without having to visit our website. You can subscribe to these feeds using your favorite RSS reader 
          and receive automatic updates whenever new content is added.
        </p>
        
        <h3 className="font-semibold text-white mb-2">How to Use RSS Feeds:</h3>
        <ol className="list-decimal pl-6 space-y-2 text-justify">
          <li>Copy the RSS feed URL from the list below</li>
          <li>Paste it into your RSS reader application</li>
          <li>Receive automatic updates when new content is available</li>
        </ol>
      </div>

      <div className="grid gap-6">
        {rssFeeds.map((feed, index) => (
          <div key={index} className="bg-slate-800 p-6 rounded-lg">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-semibold text-white">{feed.title}</h3>
                <span className="inline-block bg-blue-600 text-white text-xs px-2 py-1 rounded-full mt-1">
                  {feed.category}
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(feed.url)}
                className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                {copied ? 'Copied!' : 'Copy URL'}
              </button>
            </div>
            
            <p className="text-gray-300 mb-4 text-justify">{feed.description}</p>
            
            <div className="flex items-center justify-between">
              <code className="bg-slate-700 px-3 py-1 rounded text-sm text-blue-300 break-all">
                {feed.url}
              </code>
              <a
                href={feed.url}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Feed
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-slate-800 p-6 rounded-lg text-gray-300 text-justify">
        <h2 className="text-xl font-semibold text-white mb-4">Recommended RSS Readers</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-white mb-2">Desktop Applications</h3>
            <ul className="list-disc pl-6 space-y-1 text-justify">
              <li>Feedly</li>
              <li>Inoreader</li>
              <li>NewsBlur</li>
              <li>The Old Reader</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-2">Browser Extensions</h3>
            <ul className="list-disc pl-6 space-y-1 text-justify">
              <li>RSS Feed Reader (Chrome)</li>
              <li>Feeder (Firefox)</li>
              <li>Brief (Safari)</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-slate-800 p-6 rounded-lg text-gray-300 text-justify">
        <h2 className="text-xl font-semibold text-white mb-4">Need Help?</h2>
        <p>
          If you need assistance with our RSS feeds or have questions about how to use them, 
          please check our <a href="/faq" className="text-blue-400 hover:text-blue-300">FAQ page</a> or 
          contact our <a href="/support" className="text-blue-400 hover:text-blue-300">support team</a>.
        </p>
      </div>
    </div>
  );
}