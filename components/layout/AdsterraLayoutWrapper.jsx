"use client";

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function AdsterraLayoutWrapper({ children }) {
  const pathname = usePathname();
  const scriptsLoaded = useRef(false);
  const POPUNDER_VIEWED_KEY = 'adsterra_pop_history';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let timer;
      scriptsLoaded.current = false; // Reset status setiap kali path berubah

      const scripts = [
        {
          id: 'adsterra-native-banner',
          src: '//fundingfashioned.com/1ca2cd5e57f936d5abb07f32e2abce9f/invoke.js',
          attributes: { 'data-cfasync': 'false' }
        },
        {
          id: 'adsterra-social-bar',
          src: '//fundingfashioned.com/2c/9b/8c/2c9b8c28147bba30feccb90b2f09918a.js'
        },
        {
          id: 'adsterra-popunder',
          src: '//fundingfashioned.com/8a/45/d3/8a45d3fc375af772983e45d599cd3cda.js'
        }
      ];

      const loadScripts = () => {
        if (scriptsLoaded.current) return;

        const isDetailPage = pathname.includes('/movie/') || pathname.includes('/tv-show/');
        const isStreamPage = pathname.includes('/stream');

        let shouldLoadPopunder = true;
        let mediaKey = '';

        if (isDetailPage) {
          const pathParts = pathname.split('/');
          const mediaType = pathParts[1]; 
          const mediaSlug = pathParts[2];
          
          if (mediaSlug) {
            // Key unik: tipe-slug atau tipe-slug-stream
            mediaKey = isStreamPage ? `${mediaType}-${mediaSlug}-stream` : `${mediaType}-${mediaSlug}`;
            
            const history = JSON.parse(localStorage.getItem(POPUNDER_VIEWED_KEY) || '{}');
            const lastShown = history[mediaKey];
            const ONE_DAY = 24 * 60 * 60 * 1000;

            if (lastShown && (Date.now() - lastShown < ONE_DAY)) {
              shouldLoadPopunder = false;
              console.log(`⏭️ Popunder skipped for ${mediaKey}`);
            }
          }
        }

        scripts.forEach(scriptConfig => {
          if (scriptConfig.id === 'adsterra-popunder' && !shouldLoadPopunder) return;
          
          // Hapus script lama jika ada sebelum inject yang baru
          const oldScript = document.getElementById(scriptConfig.id);
          if (oldScript) oldScript.remove();

          const script = document.createElement('script');
          script.id = scriptConfig.id;
          script.src = scriptConfig.src;
          script.async = true;

          if (scriptConfig.attributes) {
            Object.entries(scriptConfig.attributes).forEach(([key, value]) => {
              script.setAttribute(key, value);
            });
          }

          script.onload = () => {
            if (scriptConfig.id === 'adsterra-popunder' && mediaKey) {
              const history = JSON.parse(localStorage.getItem(POPUNDER_VIEWED_KEY) || '{}');
              history[mediaKey] = Date.now();
              localStorage.setItem(POPUNDER_VIEWED_KEY, JSON.stringify(history));
              console.log(`✅ Popunder registered for: ${mediaKey}`);
            }
          };

          document.body.appendChild(script);
        });

        scriptsLoaded.current = true;
      };

      // Delay 1 detik untuk memastikan halaman siap
      timer = setTimeout(loadScripts, 1000);

      const handleInteraction = () => {
        if (!scriptsLoaded.current) loadScripts();
      };

      ['click', 'scroll', 'touchstart'].forEach(event => {
        window.addEventListener(event, handleInteraction, { once: true });
      });

      return () => {
        clearTimeout(timer);
        ['click', 'scroll', 'touchstart'].forEach(event => {
          window.removeEventListener(event, handleInteraction);
        });
        // Cleanup script agar tidak duplikat saat pindah halaman
        scripts.forEach(s => {
          const el = document.getElementById(s.id);
          if (el) el.remove();
        });
      };
    }
  }, [pathname]); // <--- Dependency ini sangat penting agar script refresh tiap ganti judul

  return <>{children}</>;
}