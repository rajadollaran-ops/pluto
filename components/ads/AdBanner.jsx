"use client";

import { useEffect, useRef } from 'react';

export default function AdBanner({ 
  adId, 
  scriptKey, 
  height = 90, 
  width = 728, 
  className = '',
  showLabel = true
}) {
  const bannerRef = useRef(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const loadBannerScript = () => {
      if (scriptLoaded.current) return;
      
      // Cek jika script sudah ada
      if (document.getElementById(`script_${adId}`)) return;
      
      // Buat elemen script untuk konfigurasi
      const configScript = document.createElement('script');
      configScript.innerHTML = `
        atOptions = {
          'key' : '${scriptKey}',
          'format' : 'iframe',
          'height' : ${height},
          'width' : ${width},
          'params' : {}
        };
      `;
      configScript.id = `config_${adId}`;
      
      // Buat elemen script untuk invoke
      const invokeScript = document.createElement('script');
      invokeScript.src = `https://fundingfashioned.com/${scriptKey}/invoke.js`;
      invokeScript.id = `script_${adId}`;
      invokeScript.async = true;
      invokeScript.setAttribute('data-cfasync', 'false');
      
      // Tambahkan ke dalam container
      if (bannerRef.current) {
        bannerRef.current.innerHTML = ''; // Clear existing content
        bannerRef.current.appendChild(configScript);
        bannerRef.current.appendChild(invokeScript);
      }
      
      scriptLoaded.current = true;
      console.log(`✅ Banner ${adId} loaded`);
    };
    
    // Delay sedikit untuk memastikan DOM siap
    const timer = setTimeout(loadBannerScript, 500);
    
    // Load saat user berinteraksi (untuk menghindari adblock detection)
    const handleInteraction = () => {
      if (!scriptLoaded.current) {
        loadBannerScript();
      }
    };
    
    ['click', 'scroll', 'touchstart', 'mousemove'].forEach(event => {
      window.addEventListener(event, handleInteraction, { once: true });
    });
    
    return () => {
      clearTimeout(timer);
      
      // Cleanup listeners
      ['click', 'scroll', 'touchstart', 'mousemove'].forEach(event => {
        window.removeEventListener(event, handleInteraction);
      });
      
      // Cleanup scripts
      const configScript = document.getElementById(`config_${adId}`);
      const invokeScript = document.getElementById(`script_${adId}`);
      
      if (configScript?.parentNode) configScript.parentNode.removeChild(configScript);
      if (invokeScript?.parentNode) invokeScript.parentNode.removeChild(invokeScript);
      
      scriptLoaded.current = false;
    };
  }, [adId, scriptKey, height, width]);

  return (
    <div className={`ad-banner-container ${className}`}>
      {showLabel && (
        <div className="text-xs text-gray-400 text-center mb-1">
          <span className="bg-slate-700 px-2 py-1 rounded">Advertisement</span>
        </div>
      )}
      <div 
        ref={bannerRef}
        className="banner-728x90 flex justify-center items-center min-h-[90px] bg-slate-800/50"
        style={{ minWidth: `${width}px`, minHeight: `${height}px` }}
        data-ad-format="728x90"
        data-ad-status="loading"
      >
        {/* Loading placeholder */}
        <div className="text-gray-500 text-sm animate-pulse">
          Loading advertisement...
        </div>
      </div>
    </div>
  );
}