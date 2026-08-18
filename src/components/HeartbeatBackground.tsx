import React, { useEffect, useState } from 'react';

export default function HeartbeatBackground() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Slow breathing gradient */}
      <div className={`absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-slate-950 to-slate-950 ${!reducedMotion ? 'animate-breathe' : ''}`} />
      
      {/* Animated dot grid */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.15) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        opacity: reducedMotion ? 0.3 : 0.6,
        maskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)',
        WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)'
      }} />

      {/* ECG Lines */}
      {!reducedMotion && (
        <svg className="absolute w-full h-full opacity-20 mix-blend-screen" preserveAspectRatio="none">
          <path
            d="M 0 500 L 200 500 L 220 450 L 240 550 L 260 480 L 280 500 L 1000 500"
            fill="none"
            stroke="url(#ecg-gradient)"
            strokeWidth="2"
            strokeDasharray="600"
            className="animate-ecg"
            style={{ animationIterationCount: 'infinite' }}
          />
          <defs>
            <linearGradient id="ecg-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(6, 182, 212, 0)" />
              <stop offset="50%" stopColor="rgba(6, 182, 212, 1)" />
              <stop offset="100%" stopColor="rgba(6, 182, 212, 0)" />
            </linearGradient>
          </defs>
        </svg>
      )}

      {/* Floating particles */}
      {!reducedMotion && (
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-cyan-500/40 blur-[1px]"
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${10 + Math.random() * 80}%`,
                animation: `float-particle ${4 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
