import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Zap, ShieldCheck, Activity, Cpu, ArrowUpRight, RefreshCw } from 'lucide-react';
import { cdnScalingMicroservice, EdgePoPNode } from '../services/microservices/cdnScalingMicroservice';

export default function GlobalCDNHubWidget() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [nodes, setNodes] = useState<EdgePoPNode[]>(() => cdnScalingMicroservice.getPoPNodes());
  const [bestNode, setBestNode] = useState<EdgePoPNode | null>(null);
  const [avgLatency, setAvgLatency] = useState<number>(16);
  const [benchmarking, setBenchmarking] = useState(false);

  useEffect(() => {
    runBenchmark();
  }, []);

  async function runBenchmark() {
    setBenchmarking(true);
    const res = await cdnScalingMicroservice.benchmarkEdgeNodes();
    setNodes(cdnScalingMicroservice.getPoPNodes());
    setBestNode(res.bestNode);
    setAvgLatency(res.avgLatency);
    setBenchmarking(false);
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-6 shadow-xl" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Globe className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              {isRtl ? 'شبكة توزيع المحتوى العالمية (Cloudflare & Vercel Edge CDN)' : 'Global Edge CDN Acceleration Hub'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isRtl ? 'توزيع المحتوى أوفلاين في 300+ نقطة عابرة للحدود بسرعة فائقة' : 'Sub-50ms latency across 300+ Edge PoP locations worldwide'}
            </p>
          </div>
        </div>

        <button
          onClick={runBenchmark}
          disabled={benchmarking}
          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-cyan-400 border border-slate-300 dark:border-slate-700 font-mono text-xs flex items-center gap-2 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${benchmarking ? 'animate-spin' : ''}`} />
          <span>{isRtl ? 'فحص زمن الاستجابة الحي' : 'Run Live Latency Test'}</span>
        </button>
      </div>

      {/* Latency Telemetry Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-bold">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>{isRtl ? 'متوسط السرعة' : 'Avg Edge Latency'}</span>
          </div>
          <p className="text-xl font-mono font-black text-amber-400">{avgLatency} ms</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-bold">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>{isRtl ? 'أفضل نقطة تجميع' : 'Fastest Edge PoP'}</span>
          </div>
          <p className="text-xl font-mono font-black text-emerald-400 truncate">{bestNode?.id || 'DXB1'}</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-bold">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>{isRtl ? 'ضغط Brotli & Gzip' : 'Compression'}</span>
          </div>
          <p className="text-xl font-mono font-black text-cyan-400">ACTIVE</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-bold">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>{isRtl ? 'جاهزية السيرفرات' : 'Global SLA Uptime'}</span>
          </div>
          <p className="text-xl font-mono font-black text-purple-400">99.99%</p>
        </div>
      </div>

      {/* Edge Nodes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {nodes.map((node) => (
          <div key={node.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {node.locationName}
              </span>
              <span className="text-[10px] font-mono text-cyan-400 font-bold">{node.id}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1 border-t border-slate-850">
              <span>Latency: <strong className="text-emerald-400">{node.latencyMs}ms</strong></span>
              <span>Hit Rate: <strong className="text-purple-400">{node.hitRatePercent}%</strong></span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
