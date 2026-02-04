// utils/adsterra-ai.js
// Sistem Hybrid AI-Powered untuk maximize CPM Adsterra

// Konfigurasi SmartLink
const SMARTLINKS = [
    {
        id: 'sl1',
        url: 'https://fundingfashioned.com/yed8kj7bvw?key=b7830767455354f8e097df2a9e0f040c',
        name: 'Premium Movie Offer',
        category: 'entertainment',
        initialWeight: 1.5
    },
    {
        id: 'sl2',
        url: 'https://fundingfashioned.com/wdhedf2wx?key=a2c98838af4390b59e8b7aaaea3f1660',
        name: 'Streaming Service',
        category: 'entertainment',
        initialWeight: 1.2
    },
    {
        id: 'sl3',
        url: 'https://fundingfashioned.com/nu4ravi1cx?key=4d0556009c2d17968977e235d5de925a',
        name: 'VPN Deal',
        category: 'utility',
        initialWeight: 1.0
    },
    {
        id: 'sl4',
        url: 'https://fundingfashioned.com/u1ipxidjif?key=bf544685cc418fde38d3de4391de6fee',
        name: 'Gaming Offer',
        category: 'gaming',
        initialWeight: 1.0
    },
    {
        id: 'sl5',
        url: 'https://fundingfashioned.com/gh4tkda15?key=080742d09d4b5234a4fdaa773e48ebd4',
        name: 'Software Bundle',
        category: 'software',
        initialWeight: 0.8
    },
    {
        id: 'sl6',
        url: 'https://fundingfashioned.com/paij3re0by?key=fa60f72b73c05d987bd978f83a6deaa8',
        name: 'Mobile App',
        category: 'mobile',
        initialWeight: 1.1
    },
    {
        id: 'sl7',
        url: 'https://fundingfashioned.com/gd8bwkyj?key=d2d35cf16f521bf5e9accfdd865dae8f',
        name: 'E-learning',
        category: 'education',
        initialWeight: 0.9
    },
    {
        id: 'sl8',
        url: 'https://fundingfashioned.com/x818nj48?key=db0a9d9fa9d81626b459383a7bdc33ee',
        name: 'Shopping Deal',
        category: 'shopping',
        initialWeight: 1.0
    },
    {
        id: 'sl9',
        url: 'https://fundingfashioned.com/w2sw8zgx21?key=d34ca1378210247721e98e65d20b3693',
        name: 'Finance Offer',
        category: 'finance',
        initialWeight: 0.7
    },
    {
        id: 'sl10',
        url: 'https://fundingfashioned.com/qn92sfcb?key=a8333f15c6bba15e367a5456f691547c',
        name: 'Travel Deal',
        category: 'travel',
        initialWeight: 0.6
    }
];

// Konfigurasi AI Optimizer
const AI_CONFIG = {
    // Dynamic click threshold
    BASE_CLICKS_FOR_AD: 4,
    MIN_CLICKS_FOR_AD: 2,
    MAX_CLICKS_FOR_AD: 8,
    
    // Traffic-based multipliers
    TRAFFIC_LEVELS: {
        LOW: { multiplier: 1.5, label: 'Low', hours: [0, 1, 2, 3, 4, 5, 13, 14] }, // Night & afternoon
        MEDIUM: { multiplier: 1.0, label: 'Medium', hours: [6, 7, 9, 10, 15, 16, 22, 23] },
        HIGH: { multiplier: 0.7, label: 'High', hours: [8, 11, 12, 17, 18, 19, 20, 21] } // Peak hours
    },
    
    // User engagement scoring
    ENGAGEMENT_THRESHOLDS: {
        HIGH: { threshold: 2.0, multiplier: 0.8 }, // Active user - more ads
        MEDIUM: { threshold: 1.0, multiplier: 1.0 },
        LOW: { threshold: 0.5, multiplier: 1.2 } // Passive user - fewer ads
    },
    
    // Time decay untuk user retention
    TIME_DECAY: {
        ENABLED: true,
        DECAY_RATE: 0.15, // 15% reduction per minute
        MAX_DECAY: 0.6    // Max 60% reduction
    },
    
    // Session management
    SESSION: {
        TARGET_ADS: 4,          // Target 4 ads per session
        TARGET_CLICKS: 20,      // Target 20 clicks per session
        MAX_DURATION: 1800000,  // 30 minutes
        RESET_ON_IDLE: 300000   // Reset after 5 minutes idle
    },
    
    // SmartLink rotation
    ROTATION: {
        STRATEGY: 'performance', // 'performance', 'weighted', 'random'
        MIN_TIME_BETWEEN_SAME_LINK: 30000, // 30 seconds
        PERFORMANCE_WEIGHT_RANGE: [0.3, 3.0],
        LEARNING_RATE: 0.1      // How fast weights adjust
    },
    
    // Geo optimization (dummy data - in real implementation, use IP detection)
    GEO_MULTIPLIERS: {
        'US': 0.75, 'CA': 0.75, 'UK': 0.75, 'AU': 0.75, // Tier 1
        'DE': 0.85, 'FR': 0.85, 'JP': 0.85, 'SG': 0.85, // Tier 2
        'IN': 1.1, 'ID': 1.1, 'VN': 1.1, 'PH': 1.1,    // Tier 3
        'DEFAULT': 1.0
    }
};

class SmartLinkManager {
    constructor() {
        this.links = SMARTLINKS.map(link => ({
            ...link,
            clicks: 0,
            conversions: 0,
            revenue: 0,
            weight: link.initialWeight,
            lastShown: 0,
            ctr: 0,
            epc: 0, // Earnings Per Click
            categories: [link.category],
            performanceScore: 1.0
        }));
        
        this.stats = {
            totalClicks: 0,
            totalConversions: 0,
            totalRevenue: 0,
            sessionStart: Date.now(),
            lastUpdated: Date.now()
        };
        
        this.loadFromStorage();
        this.initializeLinkPerformance();
    }
    
    initializeLinkPerformance() {
        // Initialize dengan asumsi berdasarkan kategori
        const categoryEPC = {
            'entertainment': 0.15,
            'software': 0.12,
            'gaming': 0.10,
            'mobile': 0.08,
            'shopping': 0.07,
            'education': 0.05,
            'finance': 0.20,
            'travel': 0.18,
            'utility': 0.09
        };
        
        this.links.forEach(link => {
            link.epc = categoryEPC[link.category] || 0.10;
            link.performanceScore = link.initialWeight * (0.8 + Math.random() * 0.4);
        });
    }
    
    getNextLink() {
        const now = Date.now();
        
        // Filter links yang belum ditampilkan dalam waktu tertentu
        const availableLinks = this.links.filter(link => 
            now - link.lastShown > AI_CONFIG.ROTATION.MIN_TIME_BETWEEN_SAME_LINK
        );
        
        if (availableLinks.length === 0) {
            // Jika semua baru ditampilkan, reset dan pilih yang paling lama
            return this.links.sort((a, b) => a.lastShown - b.lastShown)[0];
        }
        
        // Pilih berdasarkan strategi rotation
        switch (AI_CONFIG.ROTATION.STRATEGY) {
            case 'performance':
                return this.selectByPerformance(availableLinks);
            case 'weighted':
                return this.selectByWeight(availableLinks);
            default:
                return this.selectRandom(availableLinks);
        }
    }
    
    selectByPerformance(links) {
        // Calculate total performance score
        const totalScore = links.reduce((sum, link) => sum + link.performanceScore, 0);
        let random = Math.random() * totalScore;
        
        for (const link of links) {
            if (random < link.performanceScore) {
                link.lastShown = Date.now();
                return link;
            }
            random -= link.performanceScore;
        }
        
        return links[0];
    }
    
    selectByWeight(links) {
        // Weighted random selection
        const totalWeight = links.reduce((sum, link) => sum + link.weight, 0);
        let random = Math.random() * totalWeight;
        
        for (const link of links) {
            if (random < link.weight) {
                link.lastShown = Date.now();
                return link;
            }
            random -= link.weight;
        }
        
        return links[0];
    }
    
    selectRandom(links) {
        const link = links[Math.floor(Math.random() * links.length)];
        link.lastShown = Date.now();
        return link;
    }
    
    trackClick(linkId, conversion = false, revenue = 0) {
        const link = this.links.find(l => l.id === linkId);
        if (!link) return;
        
        link.clicks++;
        this.stats.totalClicks++;
        
        if (conversion) {
            link.conversions++;
            link.revenue += revenue;
            this.stats.totalConversions++;
            this.stats.totalRevenue += revenue;
            
            // Update metrics
            link.ctr = (link.conversions / link.clicks) * 100;
            link.epc = link.revenue / link.clicks;
            
            // Boost performance score untuk link yang menghasilkan conversion
            link.performanceScore = Math.min(
                AI_CONFIG.ROTATION.PERFORMANCE_WEIGHT_RANGE[1],
                link.performanceScore * (1 + AI_CONFIG.ROTATION.LEARNING_RATE * 3)
            );
            
            // Boost weight juga
            link.weight = Math.min(
                AI_CONFIG.ROTATION.PERFORMANCE_WEIGHT_RANGE[1],
                link.weight * (1 + AI_CONFIG.ROTATION.LEARNING_RATE * 2)
            );
            
            console.log(`💰 Conversion tracked: ${link.name} | Revenue: $${revenue.toFixed(2)}`);
        } else {
            // Slight penalty for no conversion (but less than boost for conversion)
            link.performanceScore = Math.max(
                AI_CONFIG.ROTATION.PERFORMANCE_WEIGHT_RANGE[0],
                link.performanceScore * (1 - AI_CONFIG.ROTATION.LEARNING_RATE * 0.1)
            );
        }
        
        this.saveToStorage();
        return link;
    }
    
    getPerformanceReport() {
        const sortedLinks = [...this.links].sort((a, b) => b.performanceScore - a.performanceScore);
        
        return {
            summary: {
                totalClicks: this.stats.totalClicks,
                totalConversions: this.stats.totalConversions,
                totalRevenue: this.stats.totalRevenue.toFixed(2),
                overallCTR: this.stats.totalClicks > 0 
                    ? ((this.stats.totalConversions / this.stats.totalClicks) * 100).toFixed(2)
                    : '0.00',
                overallEPC: this.stats.totalClicks > 0 
                    ? (this.stats.totalRevenue / this.stats.totalClicks).toFixed(3)
                    : '0.000',
                sessionDuration: Math.floor((Date.now() - this.stats.sessionStart) / 60000) + ' minutes'
            },
            topPerformers: sortedLinks.slice(0, 5).map(link => ({
                name: link.name,
                category: link.category,
                clicks: link.clicks,
                conversions: link.conversions,
                ctr: link.ctr.toFixed(2),
                epc: link.epc.toFixed(3),
                performanceScore: link.performanceScore.toFixed(2),
                weight: link.weight.toFixed(2)
            })),
            rotationStrategy: AI_CONFIG.ROTATION.STRATEGY
        };
    }
    
    saveToStorage() {
        if (typeof localStorage !== 'undefined') {
            try {
                const data = {
                    links: this.links,
                    stats: this.stats,
                    savedAt: Date.now()
                };
                localStorage.setItem('adsterraAIStats', JSON.stringify(data));
            } catch (error) {
                console.error('Error saving to storage:', error);
            }
        }
    }
    
    loadFromStorage() {
        if (typeof localStorage !== 'undefined') {
            try {
                const saved = localStorage.getItem('adsterraAIStats');
                if (saved) {
                    const data = JSON.parse(saved);
                    // Load jika data tidak lebih dari 7 hari
                    if (Date.now() - data.savedAt < 7 * 24 * 60 * 60 * 1000) {
                        this.links = data.links;
                        this.stats = data.stats;
                        console.log('📊 Loaded AI stats from storage');
                    }
                }
            } catch (error) {
                console.error('Error loading from storage:', error);
            }
        }
    }
    
    resetStats() {
        this.links.forEach(link => {
            link.clicks = 0;
            link.conversions = 0;
            link.revenue = 0;
            link.performanceScore = link.initialWeight;
            link.weight = link.initialWeight;
        });
        
        this.stats = {
            totalClicks: 0,
            totalConversions: 0,
            totalRevenue: 0,
            sessionStart: Date.now(),
            lastUpdated: Date.now()
        };
        
        localStorage.removeItem('adsterraAIStats');
        console.log('🔄 AI stats reset');
    }
}

class AIOptimizer {
    constructor() {
        this.linkManager = new SmartLinkManager();
        this.session = this.initializeSession();
        this.userEngagement = 1.0;
        this.trafficLevel = this.detectTrafficLevel();
        this.lastActivityTime = Date.now();
        this.lastAdTime = 0;
        this.currentThreshold = this.calculateThreshold();
        
        this.startActivityTracking();
        console.log('🤖 AI Optimizer initialized');
    }
    
    initializeSession() {
        const sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        return {
            id: sessionId,
            startTime: Date.now(),
            clicks: 0,
            adsShown: 0,
            lastClickTime: Date.now(),
            geo: this.detectGeo(),
            device: this.detectDevice()
        };
    }
    
    detectTrafficLevel() {
        const hour = new Date().getHours();
        
        for (const [level, config] of Object.entries(AI_CONFIG.TRAFFIC_LEVELS)) {
            if (config.hours.includes(hour)) {
                console.log(`🌐 Traffic level: ${config.label} (${hour}:00)`);
                return {
                    level: level,
                    multiplier: config.multiplier,
                    label: config.label
                };
            }
        }
        
        return {
            level: 'MEDIUM',
            multiplier: 1.0,
            label: 'Medium'
        };
    }
    
    detectGeo() {
        // In real implementation, use IP detection service
        // For now, return default
        return 'DEFAULT';
    }
    
    detectDevice() {
        const ua = navigator.userAgent;
        if (/Mobile|Android|iPhone|iPad|iPod/i.test(ua)) {
            return 'mobile';
        } else if (/Tablet|iPad/i.test(ua)) {
            return 'tablet';
        }
        return 'desktop';
    }
    
    calculateThreshold() {
        let threshold = AI_CONFIG.BASE_CLICKS_FOR_AD;
        
        // 1. Apply traffic multiplier
        threshold *= this.trafficLevel.multiplier;
        
        // 2. Apply time decay if enabled
        if (AI_CONFIG.TIME_DECAY.ENABLED && this.lastAdTime > 0) {
            const minutesSinceLastAd = (Date.now() - this.lastAdTime) / 60000;
            const decay = Math.min(
                AI_CONFIG.TIME_DECAY.MAX_DECAY,
                minutesSinceLastAd * AI_CONFIG.TIME_DECAY.DECAY_RATE
            );
            threshold = Math.max(AI_CONFIG.MIN_CLICKS_FOR_AD, threshold * (1 - decay));
        }
        
        // 3. Apply user engagement
        threshold *= this.userEngagement;
        
        // 4. Apply session-based adjustment
        const sessionAdsPerClick = this.session.adsShown / Math.max(1, this.session.clicks);
        const targetAdsPerClick = AI_CONFIG.SESSION.TARGET_ADS / AI_CONFIG.SESSION.TARGET_CLICKS;
        
        if (sessionAdsPerClick < targetAdsPerClick * 0.7) {
            // Kurang dari 70% target, lebih agresif
            threshold *= 0.8;
        } else if (sessionAdsPerClick > targetAdsPerClick * 1.3) {
            // Lebih dari 130% target, kurang agresif
            threshold *= 1.2;
        }
        
        // 5. Apply geo multiplier
        const geoMultiplier = AI_CONFIG.GEO_MULTIPLIERS[this.session.geo] || AI_CONFIG.GEO_MULTIPLIERS.DEFAULT;
        threshold *= geoMultiplier;
        
        // 6. Apply device adjustment (mobile lebih sensitif)
        if (this.session.device === 'mobile') {
            threshold *= 1.1; // Sedikit lebih jarang di mobile
        }
        
        // Clamp to min/max
        threshold = Math.max(AI_CONFIG.MIN_CLICKS_FOR_AD, 
                           Math.min(AI_CONFIG.MAX_CLICKS_FOR_AD, Math.round(threshold)));
        
        return threshold;
    }
    
    updateUserEngagement() {
        const now = Date.now();
        const sessionDuration = (now - this.session.startTime) / 60000; // minutes
        const clicksPerMinute = sessionDuration > 0 ? this.session.clicks / sessionDuration : 0;
        
        // Determine engagement level
        let engagementLevel;
        if (clicksPerMinute >= AI_CONFIG.ENGAGEMENT_THRESHOLDS.HIGH.threshold) {
            engagementLevel = 'HIGH';
        } else if (clicksPerMinute >= AI_CONFIG.ENGAGEMENT_THRESHOLDS.MEDIUM.threshold) {
            engagementLevel = 'MEDIUM';
        } else {
            engagementLevel = 'LOW';
        }
        
        this.userEngagement = AI_CONFIG.ENGAGEMENT_THRESHOLDS[engagementLevel].multiplier;
        
        // Check for session reset due to idle
        const idleTime = now - this.session.lastClickTime;
        if (idleTime > AI_CONFIG.SESSION.RESET_ON_IDLE) {
            this.resetSession();
        }
        
        return engagementLevel;
    }
    
    startActivityTracking() {
        // Track user activity
        const activities = ['click', 'mousemove', 'scroll', 'keydown', 'touchstart'];
        
        const trackActivity = () => {
            this.lastActivityTime = Date.now();
            this.session.lastClickTime = Date.now();
        };
        
        activities.forEach(activity => {
            window.addEventListener(activity, trackActivity, { passive: true });
        });
        
        // Update traffic level periodically
        setInterval(() => {
            this.trafficLevel = this.detectTrafficLevel();
        }, 300000); // Every 5 minutes
    }
    
    shouldShowAd() {
        // Update engagement first
        this.updateUserEngagement();
        
        // Recalculate threshold
        this.currentThreshold = this.calculateThreshold();
        
        // Check if enough clicks
        const shouldShow = this.session.clicks >= this.currentThreshold;
        
        return {
            shouldShow,
            clicksNeeded: Math.max(0, this.currentThreshold - this.session.clicks),
            progress: Math.min(100, (this.session.clicks / this.currentThreshold) * 100),
            nextAdAt: this.currentThreshold
        };
    }
    
    handleUserClick(targetUrl) {
        // Update session
        this.session.clicks++;
        this.session.lastClickTime = Date.now();
        
        // Check if should show ad
        const adDecision = this.shouldShowAd();
        
        let adShown = false;
        let adLink = null;
        
        if (adDecision.shouldShow) {
            // Get next smartlink
            const smartlink = this.linkManager.getNextLink();
            adLink = smartlink.url;
            
            // Show the ad
            this.showAd(smartlink);
            
            // Update session
            this.session.adsShown++;
            this.session.clicks = 0; // Reset click counter after ad
            this.lastAdTime = Date.now();
            
            adShown = true;
            
            // Simulate conversion tracking (in real implementation, this would be from Adsterra callback)
            setTimeout(() => {
                this.simulateConversionTracking(smartlink);
            }, 2000 + Math.random() * 5000);
        }
        
        return {
            adShown,
            adLink,
            decision: adDecision,
            session: { ...this.session },
            stats: this.getCurrentStats()
        };
    }
    
    showAd(smartlink) {
        // Open ad in popup
        const popup = window.open('', '_blank', 
            `width=${Math.min(800, screen.width * 0.8)},` +
            `height=${Math.min(600, screen.height * 0.8)},` +
            `left=${(screen.width - Math.min(800, screen.width * 0.8)) / 2},` +
            `top=${(screen.height - Math.min(600, screen.height * 0.8)) / 2},` +
            'scrollbars=yes,resizable=yes'
        );
        
        if (popup) {
            // Track click
            this.linkManager.trackClick(smartlink.id, false, 0);
            
            // Redirect to smartlink
            try {
                popup.location.href = smartlink.url;
                console.log(`📢 Ad shown: ${smartlink.name} | Category: ${smartlink.category}`);
                
                // Analytics tracking
                if (typeof window.gtag !== 'undefined') {
                    window.gtag('event', 'ad_impression', {
                        ad_category: smartlink.category,
                        ad_name: smartlink.name,
                        traffic_level: this.trafficLevel.label,
                        user_engagement: this.userEngagement.toFixed(2)
                    });
                }
            } catch (error) {
                console.error('Error redirecting popup:', error);
            }
        } else {
            console.warn('Popup blocked. Opening in new tab.');
            window.open(smartlink.url, '_blank', 'noopener,noreferrer');
        }
    }
    
    simulateConversionTracking(smartlink) {
        // Simulate conversion with probability based on link performance
        const conversionProbability = smartlink.epc * 10; // Higher EPC = higher conversion probability
        const random = Math.random() * 100;
        
        if (random < conversionProbability) {
            // Simulate revenue (higher for certain categories)
            const revenueRange = {
                'entertainment': [0.10, 0.50],
                'finance': [0.20, 1.00],
                'travel': [0.15, 0.80],
                'software': [0.08, 0.40],
                'gaming': [0.05, 0.30],
                'shopping': [0.03, 0.25],
                'mobile': [0.02, 0.20],
                'education': [0.01, 0.15],
                'utility': [0.04, 0.35]
            };
            
            const range = revenueRange[smartlink.category] || [0.05, 0.25];
            const revenue = range[0] + Math.random() * (range[1] - range[0]);
            
            // Track conversion
            this.linkManager.trackClick(smartlink.id, true, revenue);
            
            console.log(`💰 Simulated conversion: $${revenue.toFixed(2)} from ${smartlink.name}`);
            
            // Analytics
            if (typeof window.gtag !== 'undefined') {
                window.gtag('event', 'conversion', {
                    value: revenue,
                    currency: 'USD',
                    ad_category: smartlink.category,
                    ad_name: smartlink.name
                });
            }
        }
    }
    
    resetSession() {
        console.log('🔄 Session reset due to inactivity');
        this.session = this.initializeSession();
        this.lastAdTime = 0;
        this.currentThreshold = this.calculateThreshold();
    }
    
    getCurrentStats() {
        const now = Date.now();
        const sessionDuration = Math.floor((now - this.session.startTime) / 1000);
        
        return {
            session: {
                id: this.session.id,
                duration: sessionDuration,
                clicks: this.session.clicks,
                adsShown: this.session.adsShown,
                clicksPerAd: this.session.adsShown > 0 
                    ? (this.session.clicks / this.session.adsShown).toFixed(2)
                    : '0.00',
                geo: this.session.geo,
                device: this.session.device
            },
            optimizer: {
                trafficLevel: this.trafficLevel.label,
                userEngagement: this.userEngagement.toFixed(2),
                currentThreshold: this.currentThreshold,
                clicksToNextAd: Math.max(0, this.currentThreshold - this.session.clicks),
                lastAdMinutesAgo: this.lastAdTime > 0 
                    ? Math.floor((now - this.lastAdTime) / 60000)
                    : null
            },
            smartlinks: this.linkManager.getPerformanceReport()
        };
    }
    
    getOptimizationSettings() {
        return {
            aiConfig: AI_CONFIG,
            currentRotationStrategy: AI_CONFIG.ROTATION.STRATEGY,
            availableSmartlinks: this.linkManager.links.length,
            sessionSettings: {
                targetAds: AI_CONFIG.SESSION.TARGET_ADS,
                targetClicks: AI_CONFIG.SESSION.TARGET_CLICKS,
                maxDuration: AI_CONFIG.SESSION.MAX_DURATION / 60000 + ' minutes'
            }
        };
    }
}

// Singleton instance
let aiOptimizerInstance = null;

export function getAIOptimizer() {
    if (!aiOptimizerInstance && typeof window !== 'undefined') {
        aiOptimizerInstance = new AIOptimizer();
    }
    return aiOptimizerInstance;
}

// Export main function
export function handleAdsterraAIClick(e, targetUrl) {
    e.preventDefault();
    
    const optimizer = getAIOptimizer();
    if (!optimizer) {
        // Fallback to direct open
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
        return;
    }
    
    const result = optimizer.handleUserClick(targetUrl);
    
    // Always open target URL
    setTimeout(() => {
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }, result.adShown ? 300 : 0);
    
    return result;
}

// Export utilities for monitoring
export function getAdsterraAIStats() {
    const optimizer = getAIOptimizer();
    return optimizer ? optimizer.getCurrentStats() : null;
}

export function getOptimizationReport() {
    const optimizer = getAIOptimizer();
    if (!optimizer) return null;
    
    return {
        performance: optimizer.linkManager.getPerformanceReport(),
        currentStats: optimizer.getCurrentStats(),
        settings: optimizer.getOptimizationSettings()
    };
}

export function resetAIOptimizer() {
    if (aiOptimizerInstance) {
        aiOptimizerInstance.linkManager.resetStats();
        aiOptimizerInstance.resetSession();
        console.log('🤖 AI Optimizer reset');
    }
}

export function changeRotationStrategy(strategy) {
    if (['performance', 'weighted', 'random'].includes(strategy)) {
        AI_CONFIG.ROTATION.STRATEGY = strategy;
        console.log(`🔄 Rotation strategy changed to: ${strategy}`);
        return true;
    }
    return false;
}

export function willNextClickShowAd() {
    const optimizer = getAIOptimizer();
    if (!optimizer) return false;
    
    const decision = optimizer.shouldShowAd();
    return decision.shouldShow;
}

/**
 * Compatibility function untuk AdLink.jsx lama
 */
export function getAdStatus() {
    const stats = getAdsterraAIStats();
    if (!stats) return { clicksToNextAd: 0, progress: 0 };
    
    return {
        currentCount: stats.session.clicks,
        willShowAdOnNextClick: stats.optimizer.clicksToNextAd === 0,
        clicksToNextAd: stats.optimizer.clicksToNextAd,
        nextAdAtClick: stats.optimizer.currentThreshold,
        progress: Math.min(100, 
            (stats.session.clicks / stats.optimizer.currentThreshold) * 100
        ),
        minutesToNextAd: Math.floor(stats.optimizer.clicksToNextAd / 4), // Estimasi
        secondsToNextAd: 0,
        isUserActive: true,
        isTimerActive: true
    };
}

/**
 * Compatibility function untuk AdLink.jsx lama
 */
export function handleAdsterraClickThrottled(e, targetUrl) {
    return handleAdsterraAIClick(e, targetUrl);
}

/**
 * Compatibility function untuk AdLink.jsx lama
 */
export function resetAdsterraClickCount() {
    return resetAIOptimizer();
}

// Export for debugging
if (typeof window !== 'undefined') {
    window.adsterraAI = {
        getStats: getAdsterraAIStats,
        getReport: getOptimizationReport,
        reset: resetAIOptimizer,
        changeStrategy: changeRotationStrategy,
        getOptimizer: getAIOptimizer
    };
}