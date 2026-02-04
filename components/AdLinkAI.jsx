"use client";

import { 
    handleAdsterraAIClick, 
    getAdsterraAIStats 
} from '@/utils/adsterra/adsterra-ai'; // ✅ Gunakan path absolut
import { useState, useEffect, useCallback, useRef } from 'react';

export default function AdLinkAI({ 
    url, 
    children, 
    className = '',
    showIndicator = true,
    onClick = null,
    disabled = false,
    title: customTitle = '',
    showDetails = false,
    indicatorSize = 'md' // sm, md, lg
}) {
    const [adInfo, setAdInfo] = useState({ 
        clicksNeeded: 4, 
        progress: 0, 
        trafficLevel: 'Medium',
        engagement: 'Medium'
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [lastResult, setLastResult] = useState(null);
    const linkRef = useRef(null);
    
    // Update ad info periodically
    useEffect(() => {
        const updateAdInfo = () => {
            const stats = getAdsterraAIStats();
            if (stats) {
                setAdInfo({
                    clicksNeeded: stats.optimizer.clicksToNextAd,
                    progress: Math.min(100, 
                        (stats.session.clicks / stats.optimizer.currentThreshold) * 100
                    ),
                    trafficLevel: stats.optimizer.trafficLevel,
                    engagement: stats.optimizer.userEngagement > 1.5 ? 'High' : 
                               stats.optimizer.userEngagement > 0.8 ? 'Medium' : 'Low',
                    nextAdAt: stats.optimizer.currentThreshold,
                    currentClicks: stats.session.clicks,
                    adsShown: stats.session.adsShown
                });
            }
        };
        
        updateAdInfo();
        const interval = setInterval(updateAdInfo, 2000);
        
        return () => clearInterval(interval);
    }, []);
    
    const handleClick = useCallback((e) => {
        if (disabled || !url || isProcessing) {
            e.preventDefault();
            return;
        }
        
        setIsProcessing(true);
        
        try {
            const result = handleAdsterraAIClick(e, url);
            setLastResult(result);
            
            if (onClick) onClick(e);
        } catch (error) {
            console.error('Error in AdLinkAI:', error);
            // Fallback
            window.open(url, '_blank', 'noopener,noreferrer');
        } finally {
            setTimeout(() => setIsProcessing(false), 500);
        }
    }, [disabled, url, onClick, isProcessing]);
    
    // Get indicator size classes
    const getSizeClasses = () => {
        switch (indicatorSize) {
            case 'sm':
                return 'w-5 h-5 text-xs';
            case 'lg':
                return 'w-8 h-8 text-sm';
            default: // md
                return 'w-6 h-6 text-xs';
        }
    };
    
    // Get indicator color based on progress
    const getIndicatorColor = () => {
        if (adInfo.progress >= 90) return 'from-red-500 to-red-600';
        if (adInfo.progress >= 70) return 'from-orange-500 to-orange-600';
        if (adInfo.progress >= 50) return 'from-yellow-500 to-yellow-600';
        return 'from-green-500 to-emerald-600';
    };
    
    // Generate title tooltip
    const getTitle = () => {
        if (isProcessing) return 'Processing your click...';
        if (disabled) return customTitle || 'Link disabled';
        
        const parts = [];
        if (customTitle) parts.push(customTitle);
        
        parts.push(`Next ad in: ${adInfo.clicksNeeded} clicks`);
        parts.push(`Traffic: ${adInfo.trafficLevel}`);
        parts.push(`Engagement: ${adInfo.engagement}`);
        
        return parts.join(' • ');
    };
    
    return (
        <div className="inline-flex flex-col">
            <a
                ref={linkRef}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClick}
                className={`
                    relative inline-flex items-center gap-3
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-90'}
                    ${isProcessing ? 'animate-pulse' : ''}
                    ${className}
                `}
                title={getTitle()}
                aria-label={`External link${adInfo.clicksNeeded === 0 ? ' (Ad ready)' : ''}`}
                data-ad-clicks-needed={adInfo.clicksNeeded}
                data-ad-progress={adInfo.progress}
            >
                <span className="flex items-center">
                    {children}
                    
                    {!disabled && (
                        <span className="ml-2 text-xs text-gray-400">
                            <svg className="w-3 h-3 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </span>
                    )}
                </span>
                
                {/* AI Indicator */}
                {showIndicator && !disabled && (
                    <div className="relative">
                        <div className={`
                            ${getSizeClasses()} 
                            flex items-center justify-center 
                            font-bold rounded-full text-white
                            bg-gradient-to-br ${getIndicatorColor()}
                            shadow-lg
                        `}>
                            {adInfo.clicksNeeded === 0 ? '🎯' : adInfo.clicksNeeded}
                        </div>
                        
                        {/* Circular progress */}
                        <svg className={`absolute top-0 left-0 ${getSizeClasses()} -rotate-90`}>
                            <circle 
                                cx="50%"  
                                cy="50%"  
                                r="45%"
                                stroke="rgba(255,255,255,0.3)"
                                strokeWidth="2" 
                                fill="none" 
                            />
                            <circle 
                                cx="50%"  
                                cy="50%" 
                                r="45%" 
                                stroke="white" 
                                strokeWidth="2" 
                                fill="none"
                                strokeLinecap="round"
                                strokeDasharray="283"
                                strokeDashoffset={283 * (1 - adInfo.progress / 100)}
                            />
                        </svg>
                        
                        {/* AI badge */}
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-[8px] font-bold">AI</span>
                        </div>
                    </div>
                )}
                
                {isProcessing && (
                    <div className="ml-2">
                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
            </a>
            
            {/* Detailed info (optional) */}
            {showDetails && lastResult && (
                <div className="mt-2 p-2 bg-slate-800/50 rounded-lg text-xs">
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <span className="text-gray-400">Traffic:</span>
                            <span className="ml-1 font-medium">{adInfo.trafficLevel}</span>
                        </div>
                        <div>
                            <span className="text-gray-400">Engagement:</span>
                            <span className="ml-1 font-medium">{adInfo.engagement}</span>
                        </div>
                        <div>
                            <span className="text-gray-400">Clicks to ad:</span>
                            <span className="ml-1 font-medium">{adInfo.clicksNeeded}</span>
                        </div>
                        <div>
                            <span className="text-gray-400">Ads shown:</span>
                            <span className="ml-1 font-medium">{adInfo.adsShown}</span>
                        </div>
                    </div>
                    {lastResult.adShown && (
                        <div className="mt-1 text-green-400 animate-pulse">
                            ✅ Ad shown! Next ad in {adInfo.nextAdAt} clicks
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// Status display component
export function AdAIStatusPanel({ className = '' }) {
    const [stats, setStats] = useState(null);
    const [expanded, setExpanded] = useState(false);
    
    useEffect(() => {
        const updateStats = () => {
            const data = getAdsterraAIStats();
            setStats(data);
        };
        
        updateStats();
        const interval = setInterval(updateStats, 3000);
        
        return () => clearInterval(interval);
    }, []);
    
    if (!stats) return null;
    
    return (
        <div className={`bg-slate-800/70 backdrop-blur-sm rounded-lg p-4 ${className}`}>
            <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                    <span className="font-bold text-sm">Ad AI Status</span>
                    <span className="text-xs px-2 py-1 bg-slate-700 rounded">
                        {stats.optimizer.trafficLevel}
                    </span>
                </div>
                <div className="text-xs text-gray-400">
                    {expanded ? '▲' : '▼'}
                </div>
            </div>
            
            <div className="mt-3 grid grid-cols-3 gap-3">
                <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">
                        {stats.session.adsShown}
                    </div>
                    <div className="text-xs text-gray-400">Ads shown</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">
                        {stats.session.clicks}
                    </div>
                    <div className="text-xs text-gray-400">Session clicks</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">
                        {stats.optimizer.clicksToNextAd}
                    </div>
                    <div className="text-xs text-gray-400">To next ad</div>
                </div>
            </div>
            
            {expanded && (
                <div className="mt-4 pt-4 border-t border-slate-700">
                    <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Engagement:</span>
                            <span className="font-medium">{stats.optimizer.userEngagement}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Clicks per ad:</span>
                            <span className="font-medium">{stats.session.clicksPerAd}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Device:</span>
                            <span className="font-medium">{stats.session.device}</span>
                        </div>
                        {stats.optimizer.lastAdMinutesAgo !== null && (
                            <div className="flex justify-between">
                                <span className="text-gray-400">Last ad:</span>
                                <span className="font-medium">{stats.optimizer.lastAdMinutesAgo} min ago</span>
                            </div>
                        )}
                    </div>
                    
                    <div className="mt-3 text-center">
                        <div className="w-full bg-slate-700 rounded-full h-2">
                            <div 
                                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                                style={{ 
                                    width: `${Math.min(100, 
                                        (stats.session.clicks / stats.optimizer.currentThreshold) * 100
                                    )}%` 
                                }}
                            ></div>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                            Progress to next ad
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}