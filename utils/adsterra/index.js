// utils/adsterra/index.js
// Ekspor lengkap untuk compatibility dengan sistem AI

// ======================
// EKSPOR UTAMA DARI AI SYSTEM
// ======================

// Handler untuk klik Adsterra dengan AI optimization
export { 
    handleAdsterraAIClick as handleAdsterraClick,
    handleAdsterraClickThrottled 
} from '../adsterra-ai';

// Fungsi untuk mendapatkan status dan prediksi
export { 
    getAdsterraAIStats as getAdStatus,
    willNextClickShowAd,
    getAdStatus as getAdStatusCompat 
} from '../adsterra-ai';

// Fungsi reset dan optimisasi
export { 
    resetAIOptimizer as resetAdsterraClickCount,
    getOptimizationReport,
    changeRotationStrategy
} from '../adsterra-ai';

// Stats dan monitoring
export { 
    getAdsterraAIStats 
} from '../adsterra-ai';

// ======================
// COMPATIBILITY EXPORTS
// ======================

/**
 * Semua SmartLinks yang tersedia (10 link)
 * Digunakan untuk komponen legacy dan fallback
 */
export const ADSTERRA_DIRECT_LINKS = [
    'https://fundingfashioned.com/yed8kj7bvw?key=b7830767455354f8e097df2a9e0f040c',
    'https://fundingfashioned.com/wdhedf2wx?key=a2c98838af4390b59e8b7aaaea3f1660',
    'https://fundingfashioned.com/nu4ravi1cx?key=4d0556009c2d17968977e235d5de925a',
    'https://fundingfashioned.com/u1ipxidjif?key=bf544685cc418fde38d3de4391de6fee',
    'https://fundingfashioned.com/gh4tkda15?key=080742d09d4b5234a4fdaa773e48ebd4',
    'https://fundingfashioned.com/paij3re0by?key=fa60f72b73c05d987bd978f83a6deaa8',
    'https://fundingfashioned.com/gd8bwkyj?key=d2d35cf16f521bf5e9accfdd865dae8f',
    'https://fundingfashioned.com/x818nj48?key=db0a9d9fa9d81626b459383a7bdc33ee',
    'https://fundingfashioned.com/w2sw8zgx21?key=d34ca1378210247721e98e65d20b3693',
    'https://fundingfashioned.com/qn92sfcb?key=a8333f15c6bba15e367a5456f691547c'
];

/**
 * Konfigurasi Adsterra yang konsisten
 * Digunakan oleh komponen legacy dan sebagai fallback
 */
export const AD_CONFIG = {
    // Legacy config untuk kompatibilitas
    FIRST_AD_AFTER_CLICKS: 3,
    AD_INTERVAL: 6,
    AD_DISPLAY_DELAY: 100,
    CLICK_THROTTLE_DELAY: 500,
    
    // AI system flags
    ENABLE_AI: true,
    AI_VERSION: '1.0.0',
    
    // Fallback behavior
    USE_DIRECT_LINKS_IF_AI_FAILS: true,
    MAX_RETRIES: 2
};

// ======================
// HELPER FUNCTIONS
// ======================

/**
 * Get random direct link (fallback function)
 * @returns {string} Random Adsterra link
 */
export function getRandomDirectLink() {
    const randomIndex = Math.floor(Math.random() * ADSTERRA_DIRECT_LINKS.length);
    return ADSTERRA_DIRECT_LINKS[randomIndex];
}

/**
 * Check if AI system is available
 * @returns {boolean} AI system status
 */
export function isAISystemAvailable() {
    try {
        return typeof window !== 'undefined' && window.adsterraAI !== undefined;
    } catch (error) {
        return false;
    }
}

/**
 * Compatibility wrapper untuk legacy components
 * @param {Event} e - Click event
 * @param {string} targetUrl - Target URL
 * @returns {Object} Result object
 */
export function handleClickLegacy(e, targetUrl) {
    if (isAISystemAvailable()) {
        try {
            return handleAdsterraClick(e, targetUrl);
        } catch (error) {
            console.warn('AI system error, using fallback:', error);
        }
    }
    
    // Fallback ke direct link
    const fallbackUrl = getRandomDirectLink();
    window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
    
    return {
        adShown: true,
        adLink: fallbackUrl,
        usingFallback: true,
        timestamp: Date.now()
    };
}

// ======================
// DEBUG UTILITIES
// ======================

/**
 * Debug function untuk melihat semua exports
 */
export function debugExports() {
    if (typeof window === 'undefined') return;
    
    console.group('📦 Adsterra Module Exports');
    console.log('📍 AI System Available:', isAISystemAvailable());
    console.log('🔗 Direct Links:', ADSTERRA_DIRECT_LINKS.length);
    console.log('⚙️ Config:', AD_CONFIG);
    
    if (window.adsterraAI) {
        console.log('🤖 AI Debug Tools:', Object.keys(window.adsterraAI));
    }
    console.groupEnd();
}

/**
 * Initialize debug mode (optional)
 */
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    setTimeout(() => {
        debugExports();
    }, 1000);
}