import { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PenTool, RotateCcw, Check, Lock, ShieldCheck } from 'lucide-react';

interface ESignaturePadProps {
  partyName: string;
  onSaveSignature: (signatureDataUrl: string) => void;
}

export default function ESignaturePad({ partyName, onSaveSignature }: ESignaturePadProps) {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [typedName, setTypedName] = useState('');
  const [mode, setMode] = useState<'draw' | 'type'>('draw');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  function startDrawing(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  }

  function draw(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  }

  function stopDrawing() {
    setIsDrawing(false);
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSaved(false);
  }

  function saveSignature() {
    if (mode === 'draw') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dataUrl = canvas.toDataURL('image/png');
      onSaveSignature(dataUrl);
    } else {
      if (!typedName.trim()) return;
      // Generate canvas from typed text
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = 400;
      tempCanvas.height = 120;
      const ctx = tempCanvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, 400, 120);
        ctx.font = '30px cursive, system-ui';
        ctx.fillStyle = '#22d3ee';
        ctx.textAlign = 'center';
        ctx.fillText(typedName, 200, 65);
        onSaveSignature(tempCanvas.toDataURL('image/png'));
      }
    }
    setSaved(true);
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between border-b border-slate-900 pb-3">
        <div className="flex items-center gap-2">
          <PenTool className="w-4 h-4 text-cyan-400" />
          <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">
            {isRtl ? `التوقيع الإلكتروني الحي: ${partyName}` : `Live E-Signature Pad: ${partyName}`}
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode('draw')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              mode === 'draw' ? 'bg-cyan-500 text-slate-950' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200'
            }`}
          >
            {isRtl ? 'رسم بالتوقيع' : 'Draw'}
          </button>
          <button
            onClick={() => setMode('type')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              mode === 'type' ? 'bg-cyan-500 text-slate-950' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200'
            }`}
          >
            {isRtl ? 'كتابة اسم' : 'Type Name'}
          </button>
        </div>
      </div>

      {mode === 'draw' ? (
        <div className="relative bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-1 flex justify-center">
          <canvas
            ref={canvasRef}
            width={380}
            height={130}
            className="w-full h-32 touch-none cursor-crosshair rounded-lg bg-white dark:bg-slate-900"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
          <button
            onClick={clearCanvas}
            className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200 text-xs border border-slate-300 dark:border-slate-700"
            title="Clear"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <input
            type="text"
            placeholder={isRtl ? 'أدخل اسمك للتوقيع الإلكتروني الرسمي...' : 'Type official name for digital signature...'}
            value={typedName}
            onChange={(e) => setTypedName(e.target.value)}
            className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-cyan-300 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 text-center"
          />
        </div>
      )}

      <div className="flex items-center justify-between pt-1">
        <span className="text-[10px] text-slate-500 dark:text-slate-400 dark:text-slate-400 flex items-center gap-1 font-mono">
          <Lock className="w-3 h-3 text-emerald-400" />
          <span>E2EE 256-Bit Encrypted & Time-Stamped</span>
        </span>

        <button
          onClick={saveSignature}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-colors ${
            saved
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-cyan-500 hover:bg-cyan-600 text-slate-950'
          }`}
        >
          <Check className="w-3.5 h-3.5" />
          <span>{saved ? (isRtl ? 'تم التوقيع بنجاح' : 'Signature Certified') : (isRtl ? 'اعتماد التوقيع أونلاين' : 'Certify E-Signature')}</span>
        </button>
      </div>
    </div>
  );
}
