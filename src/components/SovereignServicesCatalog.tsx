import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePlatformLocale } from '../lib/universalTranslator';
import {
  Search,
  ArrowRight,
  Sparkles,
  Layers
} from 'lucide-react';
import {
  SERVICE_CATEGORIES,
  ALL_SERVICES_FLAT,
  ServiceItem
} from '../data/serviceTaxonomy';

export default function SovereignServicesCatalog() {
  const { l, isRtl } = usePlatformLocale();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredServices = ALL_SERVICES_FLAT.filter((service: ServiceItem) => {
    const matchesCategory = selectedCategory === 'all' || service.categoryId === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      service.titleAr.toLowerCase().includes(q) ||
      service.titleEn.toLowerCase().includes(q) ||
      service.descAr.toLowerCase().includes(q) ||
      service.descEn.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="services" className="rounded-3xl p-6 sm:p-8 border border-white/10 dark:border-white/10 bg-gradient-to-b from-[#0D1F3C]/90 via-[#071629]/95 to-[#020B1A] shadow-2xl space-y-6 font-sans backdrop-blur-2xl">
      
      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sparkles className="w-5 h-5" />
            </span>
            <span className="text-xs font-black uppercase tracking-widest text-amber-400">
              {l('دليل الخدمات والحلول القانونية الشامل (6 فئات رئيسية)', 'Comprehensive Legal Solutions Directory (6 Core Categories)')}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            {l('استعرض وتصفح جميع خدمات ومنصات الذكاء الاصطناعي', 'Explore All Sovereign Legal Services & AI Engines')}
          </h2>
          <p className="text-xs text-slate-300">
            {l('مصنفة في 6 فئات متخصصة لسهولة الوصول وحماية عقودك وشركتك.', 'Structured across 6 dedicated categories for rapid discovery and full deal protection.')}
          </p>
        </div>

        {/* Live Search Input */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={l('ابحث في الخدمات...', 'Search services...')}
            className="w-full py-2.5 px-4 ps-10 pe-4 rounded-2xl bg-slate-900/90 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-all shadow-inner"
          />
          <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3 pointer-events-none" />
        </div>
      </div>

      {/* 6 Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border ${
            selectedCategory === 'all'
              ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 border-amber-300 font-black shadow-md scale-105'
              : 'bg-slate-900/80 text-slate-300 border-white/10 hover:text-white hover:border-amber-400/30'
          }`}
        >
          {l(`جميع الخدمات (${ALL_SERVICES_FLAT.length})`, `All Services (${ALL_SERVICES_FLAT.length})`)}
        </button>
        {SERVICE_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border ${
              selectedCategory === cat.id
                ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 border-amber-300 font-black shadow-md scale-105'
                : 'bg-slate-900/80 text-slate-300 border-white/10 hover:text-white hover:border-amber-400/30'
            }`}
          >
            {l(cat.titleAr, cat.titleEn)} ({cat.services.length})
          </button>
        ))}
      </div>

      {/* Services Grid (3 Columns on Desktop, 2 on Tablet, 1 on Mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map((service) => {
          const Icon = service.icon;
          return (
            <Link
              key={service.id}
              to={service.route}
              className="bg-slate-900/80 hover:bg-[#0B1528]/90 rounded-2xl p-5 border border-white/10 hover:border-amber-400/40 transition-all duration-200 flex flex-col justify-between space-y-4 group no-underline shadow-md hover:shadow-xl hover:scale-[1.01] backdrop-blur-xl"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl border ${service.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 text-slate-300 border border-slate-800 group-hover:border-amber-500/30">
                    {l(service.badgeAr, service.badgeEn)}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                    {l(service.titleAr, service.titleEn)}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                    {l(service.descAr, service.descEn)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[11px] font-bold text-amber-400 group-hover:text-amber-300">
                <span>{l('بدء الاستخدام الفوري', 'Launch Service')}</span>
                <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''} group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform`} />
              </div>
            </Link>
          );
        })}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12 text-slate-400 space-y-2">
          <p className="text-sm font-bold">{l('لا توجد خدمات مطابقة لبحثك.', 'No services found matching your search.')}</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
            className="text-xs font-bold text-sky-400 hover:underline cursor-pointer"
          >
            {l('إعادة ضبط البحث', 'Reset search filter')}
          </button>
        </div>
      )}
    </div>
  );
}
