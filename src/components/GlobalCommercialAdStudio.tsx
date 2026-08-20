import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play, Pause, Download, Volume2, VolumeX, Sparkles,
  Shield, Globe, FileText, CheckCircle, RefreshCw,
  Zap, Star, Lock, Users, Award, ArrowRight
} from 'lucide-react';

interface CommercialScene {
  id: number;
  durationSec: number;
  badge: string;
  headline: string;
  subheadline: string;
  voiceoverText: string;
  visualFocus: 'hero' | 'jurisdictions' | 'workflow' | 'critic' | 'cta';
  accentColor: string;
  diagramSteps?: string[];
  statutoryBadges?: string[];
}

export const COMMERCIAL_SCENES: CommercialScene[] = [
  {
    id: 1,
    durationSec: 18,
    badge: 'ENTERPRISE LEGAL CHALLENGE & THE AI SOLUTION',
    headline: 'Tired of Uncapped Liabilities & Hidden Loopholes?',
    subheadline: 'Meet JurisTech Solutions — The Sovereign AI Platform Transforming Global Corporate Law',
    voiceoverText: "Are hidden liabilities and contract loopholes exposing your enterprise to severe financial risk? Welcome to JurisTech Solutions — the world's leading autonomous Legal-AI Forensic and Smart Contract Intelligence platform.",
    visualFocus: 'hero',
    accentColor: '#06b6d4', // Cyan
  },
  {
    id: 2,
    durationSec: 18,
    badge: '15+ GLOBAL & REGIONAL STATUTORY FRAMEWORKS',
    headline: 'Instant Multi-Jurisdiction Statutory Compliance',
    subheadline: 'US UCC • UK Common Law • EU GDPR • Saudi Civil Code M/191 • UAE DIFC • UN CISG',
    voiceoverText: "Backed by an advanced Vector RAG knowledge base, JurisTech guarantees sub-second compliance across 15 global legal systems — from US New York Law and English Common Law to Saudi Arabia, UAE DIFC, and international UNCITRAL arbitration.",
    visualFocus: 'jurisdictions',
    accentColor: '#f59e0b', // Amber
    statutoryBadges: [
      '🇺🇸 US UCC § 2-302 / NY Law',
      '🇬🇧 UK Common Law / UCTA 1977',
      '🇪🇺 EU GDPR & Civil Codes',
      '🇸🇦 Saudi Civil Code M/191',
      '🇦🇪 UAE / DIFC / ADGM',
      '🌐 UN CISG 1980 & UNCITRAL',
    ],
  },
  {
    id: 3,
    durationSec: 20,
    badge: 'THE 4-STAGE AUTONOMOUS WORKFLOW',
    headline: 'From Raw Document to Certified Fortified Agreement',
    subheadline: 'Upload & OCR ➔ Heatmap Risk Audit ➔ AI Redlines ➔ eIDAS SHA-256 E-Sign',
    voiceoverText: "Our automated 4-stage workflow handles it all: multi-stage OCR extraction, real-time liability heatmap scoring, bilateral protective redlining, and certified eIDAS cryptographic digital signatures.",
    visualFocus: 'workflow',
    accentColor: '#10b981', // Emerald
    diagramSteps: [
      '01. Smart Upload & Multi-Stage Native OCR',
      '02. AI Liability Heatmap & Gap Detection',
      '03. Two-Agent Redline & Critic Loop',
      '04. SHA-256 e-Sign & Bilingual Word/PDF Export',
    ],
  },
  {
    id: 4,
    durationSec: 18,
    badge: 'TWO-AGENT RAG ARCHITECTURE & CRITIC VALIDATION',
    headline: 'Zero-Hallucination Legal Precision',
    subheadline: 'Research Agent ➔ Drafting Agent ➔ Critic Agent Self-Correction Loop',
    voiceoverText: "Eliminate costly legal oversights. Our autonomous Two-Agent architecture combines deep statutory research, precision drafting, and a strict Critic Agent review loop to ensure every clause is airtight.",
    visualFocus: 'critic',
    accentColor: '#6366f1', // Indigo
  },
  {
    id: 5,
    durationSec: 16,
    badge: 'ENTERPRISE ADOPTION & OFFICIAL CONTACT',
    headline: 'Fortify Your Contracts Today — Start Free',
    subheadline: 'Visit: www.juristech.solutions | Enterprise: juristech.solutions@outlook.com',
    voiceoverText: "Empower your corporate legal team today. Visit juristech.solutions for a free AI contract audit trial, or contact our enterprise desk at juristech.solutions@outlook.com. JurisTech Solutions: Global Law, Automated.",
    visualFocus: 'cta',
    accentColor: '#ec4899', // Pink
  },
];

export default function GlobalCommercialAdStudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [sceneProgress, setSceneProgress] = useState(0);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [isRecording, setIsRecording] = useState(false);
  const [recordProgress, setRecordProgress] = useState(0);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [copiedScript, setCopiedScript] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const activeScene = COMMERCIAL_SCENES[currentSceneIdx];
  const totalDurationSec = COMMERCIAL_SCENES.reduce((acc, s) => acc + s.durationSec, 0);

  // Audio Synthesis for Voiceover
  const speakCurrentScene = (text: string) => {
    if (!isAudioEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    // Pick deep corporate English voice if available
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('David') || v.name.includes('Premium')));
    if (englishVoice) utterance.voice = englishVoice;

    window.speechSynthesis.speak(utterance);
  };

  // Play / Pause Cycle
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      speakCurrentScene(activeScene.voiceoverText);
      const sceneDurationMs = activeScene.durationSec * 1000;
      const intervalStepMs = 100;
      let elapsedMs = 0;

      timer = setInterval(() => {
        elapsedMs += intervalStepMs;
        const progress = Math.min(100, (elapsedMs / sceneDurationMs) * 100);
        setSceneProgress(progress);

        if (elapsedMs >= sceneDurationMs) {
          if (currentSceneIdx < COMMERCIAL_SCENES.length - 1) {
            setCurrentSceneIdx((prev) => prev + 1);
            setSceneProgress(0);
          } else {
            // End of commercial video
            setIsPlaying(false);
            setCurrentSceneIdx(0);
            setSceneProgress(0);
            window.speechSynthesis.cancel();
          }
        }
      }, intervalStepMs);
    } else {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }

    return () => {
      clearInterval(timer);
    };
  }, [isPlaying, currentSceneIdx, isAudioEnabled]);

  // Canvas Cinematic 60FPS Video Renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particleAngle = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      particleAngle += 0.02;

      // 1. Dark Futuristic Cyber Gradient Background
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#030712'); // Dark gray / black
      bgGrad.addColorStop(0.5, '#08162b'); // Deep Navy Blue
      bgGrad.addColorStop(1, '#020617'); // Slate 950
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Animated Cyber Grid Lines
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 3. Glowing Ambient Orb in Background
      const orbX = width / 2 + Math.cos(particleAngle) * 60;
      const orbY = height / 2 + Math.sin(particleAngle) * 40;
      const orbGrad = ctx.createRadialGradient(orbX, orbY, 10, orbX, orbY, width * 0.4);
      orbGrad.addColorStop(0, `${activeScene.accentColor}33`);
      orbGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = orbGrad;
      ctx.fillRect(0, 0, width, height);

      // 4. Header Brand Banner
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('⚖️ JURISTECH SOLUTIONS', 40, 50);

      ctx.fillStyle = '#06b6d4';
      ctx.font = 'bold 13px monospace';
      ctx.fillText('GLOBAL LEGAL-AI PLATFORM • www.juristech.solutions', 40, 75);

      // 5. Scene Badge Pill
      ctx.fillStyle = `${activeScene.accentColor}22`;
      ctx.strokeStyle = `${activeScene.accentColor}66`;
      ctx.lineWidth = 1.5;
      const badgeText = `SCENE 0${activeScene.id} // ${activeScene.badge}`;
      ctx.font = 'bold 12px monospace';
      const badgeWidth = ctx.measureText(badgeText).width + 24;
      ctx.beginPath();
      ctx.roundRect(40, 105, badgeWidth, 28, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = activeScene.accentColor;
      ctx.fillText(badgeText, 52, 124);

      // 6. Main Headline (Wrapped)
      ctx.fillStyle = '#ffffff';
      ctx.font = aspectRatio === '16:9' ? 'bold 36px system-ui, sans-serif' : 'bold 28px system-ui, sans-serif';
      ctx.fillText(activeScene.headline, 40, 185);

      // 7. Subheadline
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 16px system-ui, sans-serif';
      ctx.fillText(activeScene.subheadline, 40, 220);

      // 8. Visual Elements by Scene Type
      if (activeScene.visualFocus === 'jurisdictions' && activeScene.statutoryBadges) {
        ctx.font = 'bold 15px system-ui, sans-serif';
        activeScene.statutoryBadges.forEach((badge, idx) => {
          const bx = 40 + (idx % 2) * (width * 0.45);
          const by = 260 + Math.floor(idx / 2) * 55;
          ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
          ctx.beginPath();
          ctx.roundRect(bx, by, width * 0.42, 44, 10);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#fef08a';
          ctx.fillText(badge, bx + 16, by + 28);
        });
      } else if (activeScene.visualFocus === 'workflow' && activeScene.diagramSteps) {
        ctx.font = 'bold 14px system-ui, sans-serif';
        activeScene.diagramSteps.forEach((step, idx) => {
          const sy = 260 + idx * 52;
          ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
          ctx.strokeStyle = idx === 1 ? '#10b981' : 'rgba(16, 185, 129, 0.3)';
          ctx.lineWidth = idx === 1 ? 2 : 1;
          ctx.beginPath();
          ctx.roundRect(40, sy, width - 80, 42, 10);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#6ee7b7';
          ctx.fillText(step, 56, sy + 26);
        });
      } else if (activeScene.visualFocus === 'critic') {
        // Render Two-Agent Flow Diagram
        const boxWidth = (width - 120) / 3;
        const boxY = 270;
        const agents = [
          { name: 'Research Agent', role: 'Vector RAG Query', col: '#06b6d4' },
          { name: 'Drafting Agent', role: 'Protective Redlines', col: '#10b981' },
          { name: 'Critic Agent', role: 'Self-Correction Loop', col: '#6366f1' },
        ];

        agents.forEach((ag, idx) => {
          const ax = 40 + idx * (boxWidth + 20);
          ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
          ctx.strokeStyle = ag.col;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.roundRect(ax, boxY, boxWidth, 100, 12);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 15px system-ui, sans-serif';
          ctx.fillText(ag.name, ax + 14, boxY + 40);

          ctx.fillStyle = ag.col;
          ctx.font = 'bold 12px monospace';
          ctx.fillText(ag.role, ax + 14, boxY + 70);
        });
      } else if (activeScene.visualFocus === 'cta') {
        // Big Verified Badge and Official Email
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.strokeStyle = '#ec4899';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(40, 260, width - 80, 140, 16);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 22px system-ui, sans-serif';
        ctx.fillText('🌐 Official Domain: https://www.juristech.solutions', 60, 305);

        ctx.fillStyle = '#f472b6';
        ctx.font = 'bold 18px system-ui, sans-serif';
        ctx.fillText('📧 Inquiries & Sales: juristech.solutions@outlook.com', 60, 345);

        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 14px monospace';
        ctx.fillText('✓ FREE 1-CONTRACT AI AUDIT TRIAL • SWIFT & INSTAPAY READY', 60, 375);
      } else {
        // Hero visual preview cards
        ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)';
        ctx.beginPath();
        ctx.roundRect(40, 260, width - 80, 130, 12);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 16px system-ui, sans-serif';
        ctx.fillText('🛡️ Autonomous Contract Audit • 90ms Execution • Zero Redline Hallucination', 60, 310);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '14px system-ui, sans-serif';
        ctx.fillText('Protecting Corporate Enterprises across US, Europe, and the Middle East GCC.', 60, 345);
      }

      // 9. Bottom Telemetry Bar & Scene Progress
      const barY = height - 50;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(0, barY, width, 50);

      // Progress Line
      ctx.fillStyle = activeScene.accentColor;
      ctx.fillRect(0, barY, (width * sceneProgress) / 100, 4);

      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(`SCENE ${activeScene.id}/05 • ${Math.round(sceneProgress)}%`, 40, barY + 30);

      ctx.textAlign = 'right';
      ctx.fillText('JURISTECH SOLUTIONS ENTERPRISE AD • 1080P HD', width - 40, barY + 30);
      ctx.textAlign = 'left';

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [activeScene, sceneProgress, aspectRatio]);

  // Video Recording & Direct MP4/WebM Download Generator
  const handleStartRecordingDownload = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      setIsRecording(true);
      setRecordProgress(0);
      recordedChunksRef.current = [];

      // Capture Canvas Stream at 60FPS
      const stream = canvas.captureStream(60);

      // Supported MIME type
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';

      const mediaRecorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 5000000 });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `JurisTech_Solutions_Commercial_Ad_90s_${aspectRatio === '16:9' ? 'Landscape' : 'TikTok_Vertical'}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setIsRecording(false);
        setRecordProgress(100);
      };

      mediaRecorder.start(100);

      // Start automatic playback from scene 0 to end
      setCurrentSceneIdx(0);
      setSceneProgress(0);
      setIsPlaying(true);

      const totalMs = totalDurationSec * 1000;
      let currentMs = 0;
      const recTimer = setInterval(() => {
        currentMs += 500;
        setRecordProgress(Math.min(100, Math.round((currentMs / totalMs) * 100)));

        if (currentMs >= totalMs) {
          clearInterval(recTimer);
          mediaRecorder.stop();
          setIsPlaying(false);
        }
      }, 500);
    } catch (err) {
      console.error('Recording failed:', err);
      setIsRecording(false);
    }
  };

  const copyFullEnglishAdScript = () => {
    const script = `🎬 COMMERCIAL AD SCRIPT FOR JURISTECH SOLUTIONS (90 Seconds)
Target Market: United States (US), European Union (EU), United Kingdom (UK), and Gulf (GCC) Corporate Legal Sectors.
Brand: JurisTech Solutions
Domain: https://www.juristech.solutions
Inquiries: juristech.solutions@outlook.com

=======================================================
[SCENE 01 - 0:00 to 0:18]
Visual: High-tech dark corporate cyber interface with warning liability vectors and instant solution banner.
Voiceover (English):
"Are hidden liabilities and contract loopholes exposing your enterprise to severe financial risk? Welcome to JurisTech Solutions — the world's leading autonomous Legal-AI Forensic and Smart Contract Intelligence platform."
On-Screen Text:
- JurisTech Solutions
- Stop Uncapped Liabilities & Hidden Loopholes
- Autonomous Global Legal-AI Forensic Engine

=======================================================
[SCENE 02 - 0:18 to 0:36]
Visual: 3D Globe with illuminated jurisdiction badges.
Voiceover (English):
"Backed by an advanced Vector RAG knowledge base, JurisTech guarantees sub-second compliance across 15 global legal systems — from US New York Law and English Common Law to Saudi Arabia, UAE DIFC, and international UNCITRAL arbitration."
On-Screen Text:
- 15+ Global & Regional Statutory Frameworks
- US UCC § 2-302 / NY Law • UK Common Law / UCTA 1977
- Saudi Civil Code M/191 • UAE DIFC / ADGM • UN CISG 1980

=======================================================
[SCENE 03 - 0:36 to 0:56]
Visual: 4-Stage Connected Workflow Architecture Diagram.
Voiceover (English):
"Our automated 4-stage workflow handles it all: multi-stage OCR extraction, real-time liability heatmap scoring, bilateral protective redlining, and certified eIDAS cryptographic digital signatures."
On-Screen Text:
- 01. Smart Upload & Multi-Stage Native OCR
- 02. AI Liability Heatmap & Gap Detection
- 03. Two-Agent Redline & Critic Loop
- 04. SHA-256 e-Sign & Bilingual Word/PDF Export

=======================================================
[SCENE 04 - 0:56 to 1:14]
Visual: Two-Agent RAG Critic Loop & Real-Time Redline Diff Screen.
Voiceover (English):
"Eliminate costly legal oversights. Our autonomous Two-Agent architecture combines deep statutory research, precision drafting, and a strict Critic Agent review loop to ensure every clause is airtight."
On-Screen Text:
- Research Agent ➔ Drafting Agent ➔ Critic Agent Loop
- Zero Hallucinations • Statutory Authority Grounding

=======================================================
[SCENE 05 - 1:14 to 1:30]
Visual: Official Certificate, Official Digital Seal, Website URL & Contact Desk.
Voiceover (English):
"Empower your corporate legal team today. Visit juristech.solutions for a free AI contract audit trial, or contact our enterprise desk at juristech.solutions@outlook.com. JurisTech Solutions: Global Law, Automated."
On-Screen Text:
- Official Domain: https://www.juristech.solutions
- Enterprise Sales: juristech.solutions@outlook.com
- Free 1-Contract AI Audit Trial Available Now
=======================================================`;

    navigator.clipboard.writeText(script);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 3000);
  };

  return (
    <div className="bg-slate-950 border border-cyan-500/30 rounded-3xl p-6 space-y-6 shadow-2xl">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold font-mono uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>COMMERCIAL AD STUDIO // 90-SECOND PROMO GENERATOR</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            JurisTech Solutions Commercial Video Generator (US • EU • GCC Markets)
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Full 1:30 min commercial promo with verified corporate English, statutory compliance matrices, and 1-click video export.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Aspect Ratio Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800">
            <button
              onClick={() => setAspectRatio('16:9')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                aspectRatio === '16:9' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>16:9 (YouTube / Ads)</span>
            </button>
            <button
              onClick={() => setAspectRatio('9:16')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                aspectRatio === '9:16' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>9:16 (TikTok / Reels)</span>
            </button>
          </div>

          <button
            onClick={copyFullEnglishAdScript}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
          >
            {copiedScript ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <FileText className="w-3.5 h-3.5" />}
            <span>{copiedScript ? 'Ad Script Copied!' : 'Copy English Ad Script'}</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Video Player */}
      <div className="relative flex flex-col items-center justify-center bg-black/80 rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
        <canvas
          ref={canvasRef}
          width={aspectRatio === '16:9' ? 960 : 540}
          height={aspectRatio === '16:9' ? 540 : 960}
          className={`max-w-full max-h-[540px] object-contain rounded-xl shadow-2xl`}
        />

        {/* Video Overlay Control Bar */}
        <div className="w-full bg-slate-900/90 border-t border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            </button>

            <button
              onClick={() => {
                setCurrentSceneIdx(0);
                setSceneProgress(0);
                setIsPlaying(true);
              }}
              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
              title="Restart Commercial"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsAudioEnabled(!isAudioEnabled)}
              className={`p-3 rounded-xl transition-all cursor-pointer ${
                isAudioEnabled ? 'bg-slate-800 text-cyan-400' : 'bg-slate-800/50 text-slate-500'
              }`}
              title={isAudioEnabled ? 'Voiceover Active' : 'Muted'}
            >
              {isAudioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

          {/* Scene Selectors */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {COMMERCIAL_SCENES.map((scene, idx) => (
              <button
                key={scene.id}
                onClick={() => {
                  setCurrentSceneIdx(idx);
                  setSceneProgress(0);
                  if (!isPlaying) setIsPlaying(true);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                  currentSceneIdx === idx
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white'
                }`}
              >
                0{scene.id} // {scene.visualFocus.toUpperCase()}
              </button>
            ))}
          </div>

          {/* 1-Click Video Download Button */}
          <div>
            <button
              onClick={handleStartRecordingDownload}
              disabled={isRecording}
              className={`px-5 py-3 rounded-xl font-black text-xs flex items-center gap-2 transition-all shadow-xl cursor-pointer ${
                isRecording
                  ? 'bg-amber-500 text-slate-950 animate-pulse'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/20'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>
                {isRecording
                  ? `Rendering 1080p Video (${recordProgress}%)...`
                  : '📥 Download 90s Commercial Video (MP4/WebM)'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Voiceover Live Teleprompter Script */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono text-cyan-400 font-bold">🎙️ LIVE VOICEOVER PROMPTER (ENGLISH)</span>
          <span>{activeScene.durationSec} Seconds Scene</span>
        </div>
        <p className="text-sm font-semibold text-white leading-relaxed font-sans">
          "{activeScene.voiceoverText}"
        </p>
      </div>
    </div>
  );
}
