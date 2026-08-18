/**
 * AnimatedScene.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * HD Dynamic Canvas Video & Visual UI Illustration Animation Component
 * Features:
 *   • Multi-layer Canvas rendering (3D Cyber Grid, Particle Field, HUD Rings)
 *   • Rich Visual UI Illustrations & Diagrams for every scene (Contract, Vault, Brain, Radar, M&A)
 *   • Dynamic color palette mapping per scene theme
 *   • RTL/LTR support & responsive typography
 */
import React, { useEffect, useRef } from 'react';
import { LucideIcon, CheckCircle2, Shield, Lock, FileText, Brain, Search, Users, Globe, BarChart3, Rocket, RefreshCw, Sparkles, Award, Zap, Key, ShieldCheck } from 'lucide-react';

export interface VideoScene {
  id: number;
  durationSec: number;
  titleAr: string;
  titleEn: string;
  scriptAr: string;
  scriptEn: string;
  icon: LucideIcon;
  bgGradient: string;
  accentColor: string;
  features?: { ar: string; en: string }[];
  visualType: 'shield' | 'brain' | 'contract' | 'radar' | 'vault' | 'globe' | 'risk' | 'rocket' | 'search' | 'network' | 'sync' | 'sparkle' | 'workflow' | 'incorporation';
}

interface AnimatedSceneProps {
  scene: VideoScene;
  isActive: boolean;
  isRtl: boolean;
  language: string;
}

export default function AnimatedScene({ scene, isActive, isRtl }: AnimatedSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isActive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const particles: { x: number; y: number; r: number; dx: number; dy: number; opacity: number }[] = [];
    const count = 60;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    window.addEventListener('resize', resize);
    resize();

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 1,
        dx: (Math.random() - 0.5) * 0.7,
        dy: (Math.random() - 0.5) * 0.7,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    const getAccentRGBA = (alpha: number) => {
      if (scene.accentColor.includes('cyan')) return `rgba(34, 211, 238, ${alpha})`;
      if (scene.accentColor.includes('indigo')) return `rgba(129, 140, 248, ${alpha})`;
      if (scene.accentColor.includes('amber')) return `rgba(251, 191, 36, ${alpha})`;
      if (scene.accentColor.includes('emerald')) return `rgba(52, 211, 153, ${alpha})`;
      if (scene.accentColor.includes('purple')) return `rgba(192, 132, 252, ${alpha})`;
      if (scene.accentColor.includes('teal')) return `rgba(45, 212, 191, ${alpha})`;
      if (scene.accentColor.includes('red')) return `rgba(248, 113, 113, ${alpha})`;
      return `rgba(56, 189, 248, ${alpha})`;
    };

    const draw = () => {
      time += 0.015;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);

      // Cyber Grid Lines
      ctx.strokeStyle = getAccentRGBA(0.08);
      ctx.lineWidth = 1;
      const gridStep = 45;
      for (let x = 0; x < w; x += gridStep) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridStep) {
        ctx.beginPath();
        const offsetY = Math.sin(time + y * 0.01) * 5;
        ctx.moveTo(0, y + offsetY);
        ctx.lineTo(w, y + offsetY);
        ctx.stroke();
      }

      // HUD Concentric Rings
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(time * 0.15);
      ctx.strokeStyle = getAccentRGBA(0.15);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, 170, 0, Math.PI * 2);
      ctx.stroke();

      ctx.setLineDash([10, 10]);
      ctx.beginPath();
      ctx.arc(0, 0, 210, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Mesh Particles
      particles.forEach((p, idx) => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > w) p.dx *= -1;
        if (p.y < 0 || p.y > h) p.dy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = getAccentRGBA(p.opacity);
        ctx.fill();

        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = getAccentRGBA((1 - dist / 100) * 0.12);
            ctx.stroke();
          }
        }
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, [isActive, scene]);

  if (!isActive) return null;

  const Icon = scene.icon;

  // Render Scene-specific Visual UI Mockup Picture Illustration
  const renderVisualIllustration = () => {
    switch (scene.visualType) {
      case 'workflow':
        return (
          <div className="w-72 sm:w-96 bg-slate-900/95 border border-cyan-500/40 rounded-2xl p-4 shadow-2xl backdrop-blur-xl space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-cyan-400 font-extrabold flex items-center gap-1.5 text-xs">
                <Rocket className="w-4 h-4" /> 5-STEP END-TO-END PROCESS WORKFLOW
              </span>
              <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full font-bold animate-pulse">
                LIVE ANIMATED PROCESS
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1 pt-1 text-[10px] font-mono text-center">
              <div className="p-1.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto font-black">1</div>
                <span className="text-[9px] text-slate-300 block truncate">Input / Query</span>
              </div>
              <div className="p-1.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto font-black">2</div>
                <span className="text-[9px] text-slate-300 block truncate">AI Audit</span>
              </div>
              <div className="p-1.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto font-black">3</div>
                <span className="text-[9px] text-slate-300 block truncate">Redlines</span>
              </div>
              <div className="p-1.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto font-black">4</div>
                <span className="text-[9px] text-slate-300 block truncate">E-Sign Seal</span>
              </div>
              <div className="p-1.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto font-black">5</div>
                <span className="text-[9px] text-slate-300 block truncate">AES Vault</span>
              </div>
            </div>
          </div>
        );

      case 'incorporation':
        return (
          <div className="w-64 sm:w-80 bg-slate-900/90 border border-purple-500/30 rounded-2xl p-4 shadow-2xl backdrop-blur-xl space-y-2 text-left text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-purple-400 font-bold flex items-center gap-1.5">
                <Globe className="w-4 h-4" /> LLC INCORPORATION SUITE
              </span>
              <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-bold">
                CCD & REGISTRY
              </span>
            </div>
            <div className="space-y-1.5 font-mono text-[10px]">
              <div className="flex justify-between p-1.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-300">🇯🇴 Jordan CCD (Law 22/1997)</span>
                <span className="text-emerald-400 font-bold">✓ Approved</span>
              </div>
              <div className="flex justify-between p-1.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-300">🇸🇦 KSA Ministry (Decree M/132)</span>
                <span className="text-emerald-400 font-bold">✓ Verified</span>
              </div>
              <div className="flex justify-between p-1.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-300">🇦🇪 UAE DED 100% Ownership</span>
                <span className="text-purple-400 font-bold">✓ Active</span>
              </div>
            </div>
          </div>
        );

      case 'contract':
        return (
          <div className="w-64 sm:w-80 bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-4 shadow-2xl backdrop-blur-xl space-y-2 text-left text-xs font-mono animate-pulse-glow">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                <FileText className="w-4 h-4" /> LEGAL_AGREEMENT_v2.pdf
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                ✓ AI VERIFIED
              </span>
            </div>
            <div className="space-y-1.5 text-slate-400 text-[11px]">
              <div className="h-2 bg-slate-800 rounded w-full animate-pulse" />
              <div className="h-2 bg-cyan-500/30 rounded w-4/5" />
              <div className="h-2 bg-slate-800 rounded w-3/4" />
            </div>
            <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-[10px]">
              <span className="text-slate-400">SHA-256 Sealed</span>
              <span className="text-cyan-400 font-bold">100% Compliant</span>
            </div>
          </div>
        );

      case 'vault':
        return (
          <div className="w-64 sm:w-80 bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-4 shadow-2xl backdrop-blur-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5 text-xs">
                <Lock className="w-4 h-4" /> AES-256 ENCRYPTED VAULT
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <div className="space-y-2">
              {['Commercial_Partnership.pdf', 'Shareholder_Agreement.docx', 'IP_Patent_Certificate.pdf'].map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px]">
                  <span className="text-slate-300 font-mono truncate max-w-[160px]">{doc}</span>
                  <Key className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        );

      case 'risk':
      case 'search':
        return (
          <div className="w-64 sm:w-80 bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4 shadow-2xl backdrop-blur-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs">
              <span className="text-amber-400 font-bold flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4" /> M&A RISK AUDIT SCORE
              </span>
              <span className="text-xs font-black text-amber-400">98.4% SAFE</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[11px] text-slate-300">
                <span>Compliance Verification</span>
                <span className="text-emerald-400 font-bold">100% Passed</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-400 h-full w-[98%]" />
              </div>
            </div>
          </div>
        );

      case 'brain':
        return (
          <div className="w-64 sm:w-80 bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-4 shadow-2xl backdrop-blur-xl space-y-3 text-left">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-bold text-indigo-400">
              <Brain className="w-4 h-4 animate-pulse" /> AI LEGAL QUERY ADVISOR
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 space-y-1">
              <p className="text-[10px] text-indigo-400 font-mono">Q: Company Formation Jordan LLC?</p>
              <p className="text-slate-200">A: Governed by Jordanian Companies Law No. 22 of 1997 & CCD registry.</p>
            </div>
          </div>
        );

      case 'globe':
        return (
          <div className="w-64 sm:w-80 bg-slate-900/90 border border-purple-500/30 rounded-2xl p-4 shadow-2xl backdrop-blur-xl flex items-center justify-around">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 mx-auto font-black text-xs">
                🇯🇴 JO
              </div>
              <span className="text-[10px] font-bold text-slate-300">Jordan CCD</span>
            </div>
            <div className="w-px h-10 bg-slate-800" />
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 mx-auto font-black text-xs">
                🇺🇸 US / 🇦🇪 UAE
              </div>
              <span className="text-[10px] font-bold text-slate-300">Global Coverage</span>
            </div>
          </div>
        );

      default:
        return (
          <div className="relative group">
            <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-cyan-500/30 to-indigo-500/30 blur-xl animate-pulse" />
            <div className="relative p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-700/60 backdrop-blur-xl shadow-2xl transition-transform duration-500 hover:scale-110">
              <Icon className={`w-14 h-14 sm:w-20 sm:h-20 ${scene.accentColor} drop-shadow-glow`} />
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`absolute inset-0 transition-all duration-700 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} pointer-events-none`}>
      {/* Dynamic Animated Canvas Background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Dark Ambient Gradient Mask */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/70" />

      {/* Main Content & Visual Visual Core */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 sm:p-10 text-center gap-4">
        
        {/* Render UI Picture / Diagram Mockup Card */}
        {renderVisualIllustration()}

        {/* Scene Title */}
        <h2 className={`text-2xl sm:text-3xl font-black ${scene.accentColor} tracking-tight drop-shadow-md`}>
          {isRtl ? scene.titleAr : scene.titleEn}
        </h2>

        {/* Scene Feature Chips */}
        {scene.features && (
          <div className="flex flex-wrap justify-center gap-2 max-w-xl">
            {scene.features.map((f, i) => (
              <span
                key={i}
                className={`text-xs font-bold px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/60 ${scene.accentColor} backdrop-blur-md shadow-md`}
              >
                ✓ {isRtl ? f.ar : f.en}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
