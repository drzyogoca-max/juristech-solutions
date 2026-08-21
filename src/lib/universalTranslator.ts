/**
 * src/lib/universalTranslator.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Instantaneous 7-Language Universal Translation & Localization Engine
 * 
 * Supports:
 *   • ar: Arabic (العربية)
 *   • en: English
 *   • de: German (Deutsch)
 *   • fr: French (Français)
 *   • es: Spanish (Español)
 *   • zh: Chinese (中文)
 *   • tr: Turkish (Türkçe)
 */

import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { SupportedLang, normalizeLanguage } from './languageHelper';
export type { SupportedLang };
export { normalizeLanguage };
import { GLOBAL_TRANSLATIONS, GlobalUITexts } from './globalTranslations';


import { legalLexiconEngine } from '../services/legalLexiconEvolutionEngine';

// Universal In-Memory Translation Hash Dictionary (Keyed by English and Arabic lowercase phrases)
const DICTIONARY: Record<string, Record<SupportedLang, string>> = {
  // Navigation & Core Labels
  'dashboard': {
    ar: 'الرئيسية',
    en: 'Dashboard',
    de: 'Dashboard',
    fr: 'Tableau de bord',
    es: 'Panel Principal',
    zh: '控制面板',
    tr: 'Kontrol Paneli',
  },
  'ai legal advisor': {
    ar: 'المستشار القانوني الذكي',
    en: 'AI Legal Advisor',
    de: 'KI-Rechtsberater',
    fr: 'Conseiller Juridique IA',
    es: 'Asesor Legal IA',
    zh: 'AI法律顾问',
    tr: 'Yapay Zeka Hukuk Danışmanı',
  },
  'contract generator': {
    ar: 'صانع ومولد العقود الذكية',
    en: 'Contract Generator',
    de: 'Vertragsgenerator',
    fr: 'Générateur de Contrats',
    es: 'Generador de Contratos',
    zh: '合同生成器',
    tr: 'Sözleşme Oluşturucu',
  },
  'risk radar': {
    ar: 'رادار فحص المخاطر',
    en: 'Risk Radar',
    de: 'Risiko-Radar',
    fr: 'Radar des Risques',
    es: 'Radar de Riesgos',
    zh: '风险雷达',
    tr: 'Risk Radarı',
  },
  'contracts repository': {
    ar: 'مستودع المليون عقد',
    en: 'Contracts Repository',
    de: 'Vertragstresor',
    fr: 'Répertoire de Contrats',
    es: 'Repositorio de Contratos',
    zh: '合同知识库',
    tr: 'Sözleşme Deposu',
  },
  'templates studio': {
    ar: 'استوديو النماذج الجاهزة',
    en: 'Templates Studio',
    de: 'Vorlagen-Studio',
    fr: 'Studio de Modèles',
    es: 'Estudio de Plantillas',
    zh: '模板工作室',
    tr: 'Şablon Stüdyosu',
  },
  'encrypted vault': {
    ar: 'الخزنة المشفرة E2EE',
    en: 'Encrypted Vault',
    de: 'Verschlüsselter Tresor',
    fr: 'Coffre-fort Crypté',
    es: 'Bóveda Cifrada',
    zh: '加密保险库',
    tr: 'Şifreli Kasa',
  },
  'google ai pro': {
    ar: '⭐ محرك Google AI Pro',
    en: '⭐ Google AI Pro',
    de: '⭐ Google AI Pro',
    fr: '⭐ Google AI Pro',
    es: '⭐ Google AI Pro',
    zh: '⭐ Google AI Pro',
    tr: '⭐ Google AI Pro',
  },
  'company formation': {
    ar: 'تأسيس الشركات وحوكمتها',
    en: 'Company Formation',
    de: 'Unternehmensgründung',
    fr: 'Création d’Entreprise',
    es: 'Constitución de Empresas',
    zh: '公司设立',
    tr: 'Şirket Kuruluşu',
  },
  'm&a audit': {
    ar: 'تدقيق الاستحواذ M&A',
    en: 'M&A Audit',
    de: 'M&A-Prüfung',
    fr: 'Audit Fusions-Acquisitions',
    es: 'Auditoría M&A',
    zh: '并购尽调 (M&A)',
    tr: 'Şirket Birleşme Denetimi',
  },
  'ai negotiation': {
    ar: 'محاكي التفاوض الذكي',
    en: 'AI Negotiation',
    de: 'KI-Verhandlung',
    fr: 'Négociation IA',
    es: 'Negociación IA',
    zh: 'AI谈判模拟',
    tr: 'Yapay Zeka Müzakere',
  },
  'pricing & plans': {
    ar: 'باقات الاشتراك والأسعار',
    en: 'Pricing & Plans',
    de: 'Preise & Tarife',
    fr: 'Tarifs & Abonnements',
    es: 'Precios y Planes',
    zh: '价格与方案',
    tr: 'Fiyatlandırma & Paketler',
  },
  'helpdesk & support': {
    ar: 'الدعم الفني والشكاوى',
    en: 'Helpdesk & Support',
    de: 'Helpdesk & Support',
    fr: 'Assistance & Support',
    es: 'Soporte y Ayuda',
    zh: '技术支持',
    tr: 'Destek & Yardım',
  },
  'about us': {
    ar: 'من نحن والاستقلالية',
    en: 'About Us',
    de: 'Über uns',
    fr: 'À Propos',
    es: 'Quiénes Somos',
    zh: '关于我们',
    tr: 'Hakkımızda',
  },
  'legal compliance': {
    ar: 'الامتثال والحوكمة',
    en: 'Legal Compliance',
    de: 'Rechtskonformität & DSGVO',
    fr: 'Conformité & RGPD',
    es: 'Cumplimiento Legal y LOPD',
    zh: '合规与治理',
    tr: 'Uyumluluk & KVKK',
  },
  'admin panel': {
    ar: '👑 لوحة الأدمن',
    en: '👑 Admin Panel',
    de: '👑 Admin-Panel',
    fr: '👑 Panneau Admin',
    es: '👑 Panel de Admin',
    zh: '👑 管理面板',
    tr: '👑 Yönetici Paneli',
  },
  'subscribe': {
    ar: 'الاشتراك',
    en: 'Subscribe',
    de: 'Abonnieren',
    fr: 'S’abonner',
    es: 'Suscribirse',
    zh: '立即订阅',
    tr: 'Abone Ol',
  },

  // Dashboard Section Tabs
  'global saas map': {
    ar: '🗺️ الخريطة التفاعلية والأنظمة',
    en: '🗺️ Global SaaS Map',
    de: '🗺️ Globale SaaS-Karte',
    fr: '🗺️ Carte SaaS Globale',
    es: '🗺️ Mapa SaaS Global',
    zh: '🗺️ 全球SaaS交互地图',
    tr: '🗺️ Küresel SaaS Haritası',
  },
  'contract studio': {
    ar: '⚡ استوديو العقود والتدقيق',
    en: '⚡ Contract Studio',
    de: '⚡ Vertragsstudio',
    fr: '⚡ Studio de Contrats',
    es: '⚡ Estudio de Contratos',
    zh: '⚡ 合同与审计工作室',
    tr: '⚡ Sözleşme Stüdyosu',
  },
  '18 services directory': {
    ar: '🏛️ دليل الخدمات السيادية (18)',
    en: '🏛️ 18 Services Directory',
    de: '🏛️ Verzeichnis (18 Dienste)',
    fr: '🏛️ Répertoire (18 Services)',
    es: '🏛️ Directorio (18 Servicios)',
    zh: '🏛️ 18项主权服务全景目录',
    tr: '🏛️ 18 Egemen Hizmet Dizini',
  },
  'case studies & pricing': {
    ar: '💼 دراسات الحالة والأسعار',
    en: '💼 Case Studies & Pricing',
    de: '💼 Fallstudien & Preise',
    fr: '💼 Études de Cas & Tarifs',
    es: '💼 Casos de Éxito y Precios',
    zh: '💼 案例研究与价格方案',
    tr: '💼 Vaka Çalışmaları ve Fiyatlar',
  },
  'security & governance': {
    ar: '🔐 الأمان والامتثال والتحقق',
    en: '🔐 Security & Governance',
    de: '🔐 Sicherheit & Governance',
    fr: '🔐 Sécurité & Gouvernance',
    es: '🔐 Seguridad y Gobernanza',
    zh: '🔐 安全合规与双重验证',
    tr: '🔐 Güvenlik ve Yönetişim',
  },

  // Telemetry Counters
  'total contracts': {
    ar: 'إجمالي العقود بالنظام',
    en: 'Total Contracts',
    de: 'Gesamtverträge im System',
    fr: 'Contrats au système',
    es: 'Contratos en el sistema',
    zh: '系统合同总数',
    tr: 'Sistemdeki Toplam Sözleşme',
  },
  'real visitors today': {
    ar: 'الزوار الفعليون اليوم',
    en: 'Real Visitors Today',
    de: 'Reale Besucher heute',
    fr: 'Visiteurs réels aujourd’hui',
    es: 'Visitantes reales hoy',
    zh: '今日真实访问量',
    tr: 'Bugünkü Gerçek Ziyaretçiler',
  },
  'active subscribers': {
    ar: 'المشتركون والعملاء',
    en: 'Active Subscribers',
    de: 'Aktive Abonnenten',
    fr: 'Abonnés actifs',
    es: 'Suscriptores activos',
    zh: '活跃订阅用户',
    tr: 'Aktif Aboneler',
  },
  'paying entities': {
    ar: 'العملاء والشركات المرخصة',
    en: 'Paying Entities',
    de: 'Lizenzierte Unternehmen',
    fr: 'Entreprises licenciées',
    es: 'Empresas licenciadas',
    zh: '授权企业客户',
    tr: 'Lisanslı Şirketler',
  },
  'risk reports': {
    ar: 'تقارير المخاطر',
    en: 'Risk Reports',
    de: 'Risikoberichte',
    fr: 'Rapports de risques',
    es: 'Informes de riesgos',
    zh: '已完成风险报告',
    tr: 'Risk Raporları',
  },
  'ai queries': {
    ar: 'استشارات الذكاء الاصطناعي',
    en: 'AI Queries',
    de: 'KI-Rechtsanfragen',
    fr: 'Consultations juridiques IA',
    es: 'Consultas jurídicas IA',
    zh: 'AI法律咨询量',
    tr: 'Yapay Zeka Hukuk Sorguları',
  },

  // Interactive Customer Journey Map
  'stage 1 of 6': {
    ar: 'المحطة 1 من 6: الذكاء الاصطناعي السيادي Pro',
    en: 'Stage 1 of 6: Sovereign AI Engine Pro',
    de: 'Stufe 1 von 6: Souveräne KI-Engine Pro',
    fr: 'Étape 1 sur 6 : Moteur IA Souverain Pro',
    es: 'Etapa 1 de 6: Motor IA Soberano Pro',
    zh: '第1阶段 (共6阶段)：主权AI核心引擎Pro',
    tr: 'Aşama 1 / 6: Egemen Yapay Zeka Motoru Pro',
  },
  'stage 2 of 6': {
    ar: 'المحطة 2 من 6: استوديو صياغة وتوليد العقود',
    en: 'Stage 2 of 6: AI Contract Studio',
    de: 'Stufe 2 von 6: KI-Vertragsstudio',
    fr: 'Étape 2 sur 6 : Studio de Contrats IA',
    es: 'Etapa 2 de 6: Estudio de Contratos IA',
    zh: '第2阶段 (共6阶段)：AI合同生成工作室',
    tr: 'Aşama 2 / 6: Yapay Zeka Sözleşme Stüdyosu',
  },
  'stage 3 of 6': {
    ar: 'المحطة 3 من 6: رادار كشف المخاطر والبنود التعسفية',
    en: 'Stage 3 of 6: Risk & Penalty Radar',
    de: 'Stufe 3 von 6: Risiko- & Klauselradar',
    fr: 'Étape 3 sur 6 : Radar des Risques et Pénalités',
    es: 'Etapa 3 de 6: Radar de Riesgos y Cláusulas',
    zh: '第3阶段 (共6阶段)：合同风险与霸王条款雷达',
    tr: 'Aşama 3 / 6: Risk ve Cezai Şart Radarı',
  },
  'stage 4 of 6': {
    ar: 'المحطة 4 من 6: محاكي التفاوض الآلي وحل النزاعات',
    en: 'Stage 4 of 6: Autonomous AI Negotiation',
    de: 'Stufe 4 von 6: Autonome KI-Verhandlung',
    fr: 'Étape 4 sur 6 : Négociation IA Autonome',
    es: 'Etapa 4 de 6: Negociación IA Autónoma',
    zh: '第4阶段 (共6阶段)：自主AI谈判与争议化解',
    tr: 'Aşama 4 / 6: Otonom Yapay Zeka Müzakere',
  },
  'stage 5 of 6': {
    ar: 'المحطة 5 من 6: التوقيع الرقمي والختم المشفر SHA-256',
    en: 'Stage 5 of 6: Digital Signature & SHA-256 Seal',
    de: 'Stufe 5 von 6: E-Signatur & SHA-256-Siegel',
    fr: 'Étape 5 sur 6 : Signature Électronique & Sceau SHA-256',
    es: 'Etapa 5 de 6: Firma Digital y Sello SHA-256',
    zh: '第5阶段 (共6阶段)：电子签名与SHA-256加密盖印',
    tr: 'Aşama 5 / 6: Dijital İmza ve SHA-256 Mührü',
  },
  'stage 6 of 6': {
    ar: 'المحطة 6 من 6: الخزنة السحابية والحوكمة المستمرة',
    en: 'Stage 6 of 6: Encrypted Vault & Continuous Governance',
    de: 'Stufe 6 von 6: Verschlüsselter Tresor & Governance',
    fr: 'Étape 6 sur 6 : Coffre Crypté & Gouvernance Continue',
    es: 'Etapa 6 de 6: Bóveda Cifrada y Gobernanza Continua',
    zh: '第6阶段 (共6阶段)：加密保险库与持续合规治理',
    tr: 'Aşama 6 / 6: Şifreli Kasa ve Sürekli Yönetişim',
  },

  // Common Actions & CTAs
  'start consultation': {
    ar: 'بدء استشارة فورية 24/7',
    en: 'Start Live Consultation 24/7',
    de: 'Live-Beratung starten 24/7',
    fr: 'Démarrer consultation en direct 24/7',
    es: 'Iniciar consulta en vivo 24/7',
    zh: '开始24/7即时咨询',
    tr: '7/24 Canlı Danışmanlık Başlat',
  },
  'draft contract': {
    ar: 'صياغة عقد تجاري',
    en: 'Draft Commercial Contract',
    de: 'Handelsvertrag erstellen',
    fr: 'Rédiger un contrat commercial',
    es: 'Redactar contrato mercantil',
    zh: '起草商事合同',
    tr: 'Ticari Sözleşme Hazırla',
  },
  'audit risk': {
    ar: 'فحص مخاطر عقدك',
    en: 'Audit Contract Risk',
    de: 'Vertragsrisiko prüfen',
    fr: 'Auditer les risques contractuels',
    es: 'Auditar riesgo contractual',
    zh: '审计合同风险',
    tr: 'Sözleşme Riskini Denetle',
  },
  'export word': {
    ar: 'تصدير Word (.docx)',
    en: 'Export Word (.docx)',
    de: 'Word exportieren (.docx)',
    fr: 'Exporter Word (.docx)',
    es: 'Exportar Word (.docx)',
    zh: '导出Word文档 (.docx)',
    tr: 'Word İndir (.docx)',
  },
  'export pdf': {
    ar: 'تصدير PDF مختوم',
    en: 'Export Sealed PDF',
    de: 'Gesiegeltes PDF exportieren',
    fr: 'Exporter PDF officiel',
    es: 'Exportar PDF sellado',
    zh: '导出官方盖印PDF',
    tr: 'Resmi Mühürlü PDF İndir',
  },
  'view report': {
    ar: 'عرض التقرير التفصيلي',
    en: 'View Full Report',
    de: 'Vollständigen Bericht ansehen',
    fr: 'Voir le rapport complet',
    es: 'Ver informe completo',
    zh: '查看详细报告',
    tr: 'Tam Raporu Görüntüle',
  },
  'clear session': {
    ar: 'تفريغ الجلسة',
    en: 'Clear Session',
    de: 'Sitzung leeren',
    fr: 'Effacer la session',
    es: 'Borrar sesión',
    zh: '清空当前会话',
    tr: 'Oturumu Temizle',
  },
  'auto contract generation': {
    ar: 'توليد العقد الذكي التلقائي والمطابقة التشريعية',
    en: 'Automated Smart Contract Generation & Compliance',
    de: 'Automatische Smart-Contract-Generierung & Compliance',
    fr: 'Génération Automatisée de Contrats Intelligents & Conformité',
    es: 'Generación Automatizada de Contratos Inteligentes y Cumplimiento',
    zh: '智能合约自动生成与合规审查',
    tr: 'Otomatik Akıllı Sözleşme Oluşturma ve Mevzuata Uygunluk',
  },
  'paid corporate sponsor': {
    ar: 'الراعي المعتمد لصفقات الاندماج والاستحواذ',
    en: 'Verified Corporate M&A Sponsor',
    de: 'Verifizierter M&A-Unternehmenssponsor',
    fr: 'Sponsor Entreprise Agréé Fusions & Acquisitions',
    es: 'Patrocinador Corporativo Verificado de M&A',
    zh: '认证企业并购官方赞助商',
    tr: 'Onaylı Kurumsal Birleşme & Devralma Sponsoru',
  },
  'sponsorship slot available': {
    ar: 'مساحة إعلانية ورعاية رسمية متاحة للمؤسسات والشركات',
    en: 'Official Corporate Sponsorship & Ad Slot Available',
    de: 'Offizielle Unternehmenssponsoring-Fläche verfügbar',
    fr: 'Emplacement de sponsoring officiel disponible',
    es: 'Espacio de patrocinio corporativo oficial disponible',
    zh: '官方企业赞助与广告位现已开放',
    tr: 'Resmi Kurumsal Sponsorluk ve Reklam Alanı Müsait',
  },
  'reserve sponsorship slot': {
    ar: 'حجز المساحة والإعلان عبر التحويل البنكي',
    en: 'Reserve Slot via Direct Bank Wire Transfer',
    de: 'Fläche per direkter Banküberweisung reservieren',
    fr: 'Réserver un emplacement par virement bancaire SWIFT',
    es: 'Reservar espacio mediante transferencia bancaria directa',
    zh: '通过银行电汇预订官方赞助席位',
    tr: 'Banka Havalesi / SWIFT ile Alan Rezerve Edin',
  },
  'corporate target wire': {
    ar: 'متاح لجميع الشركات والمؤسسات القانونية والمالية للاستهداف المباشر عبر التحويل البنكي SWIFT',
    en: 'Available for institutional and corporate targeting via SWIFT Bank Wire Remittance',
    de: 'Verfügbar für institutionelles B2B-Targeting per SWIFT-Banküberweisung',
    fr: 'Disponible pour le ciblage institutionnel et B2B par virement bancaire SWIFT',
    es: 'Disponible para segmentación corporativa e institucional mediante transferencia SWIFT',
    zh: '面向所有法律与金融机构开放，支持通过SWIFT银行电汇直接合作',
    tr: 'SWIFT Banka Havalesi ile kurumsal ve kurumsal hedefleme için kullanılabilir',
  },
  'legal disclaimer text': {
    ar: 'يوفر نظام JurisTech AI معلومات وإرشادات قانونية تقنية استرشادية، ولا يُعد بديلاً عن استشارة محامٍ مرخص.',
    en: 'JurisTech AI provides statutory guidance and workflow automation, not direct legal advice. Consult licensed counsel for formal execution.',
    de: 'JurisTech KI bietet gesetzliche Orientierung und Workflow-Automatisierung, keine direkte Rechtsberatung. Konsultieren Sie zugelassene Anwälte.',
    fr: "JurisTech IA fournit des orientations juridiques et l'automatisation des flux, pas de conseil juridique direct. Consultez un avocat agréé.",
    es: 'JurisTech IA proporciona orientación jurídica y automatización de flujos, no asesoramiento legal directo. Consulte a un abogado colegiado.',
    zh: 'JurisTech AI 提供法定指引与自动化流程，不构成直接法律意见。正式签署请咨询执业律师。',
    tr: 'JurisTech AI yasal rehberlik ve iş akışı otomasyonu sunar, doğrudan hukuki tavsiye niteliği taşımaz. Resmi işlemler için lisanslı avukata danışın.',
  },
  'read compliance': {
    ar: 'قراءة مركز الامتثال والاستقلالية القانونية',
    en: 'Read Legal Compliance & Statutory Framework',
    de: 'Rechtskonformität & Gesetzlichen Rahmen lesen',
    fr: 'Consulter la Conformité Juridique et le Cadre Réglementaire',
    es: 'Leer Cumplimiento Legal y Marco Regulatorio',
    zh: '阅读法律合规与监管框架',
    tr: 'Yasal Uyum ve Mevzuat Çerçevesini Okuyun',
  },
  'close': {
    ar: 'إغلاق',
    en: 'Close',
    de: 'Schließen',
    fr: 'Fermer',
    es: 'Cerrar',
    zh: '关闭',
    tr: 'Kapat',
  },
  'visit sponsor': {
    ar: 'زيارة موقع الراعي',
    en: 'Visit Official Sponsor',
    de: 'Offizielle Sponsor-Website besuchen',
    fr: 'Visiter le site officiel du sponsor',
    es: 'Visitar sitio oficial del patrocinador',
    zh: '访问官方赞助商网站',
    tr: 'Resmi Sponsor Sitesini Ziyaret Edin',
  },
  'official sponsor badge': {
    ar: 'راعي رسمي معتمد',
    en: 'Official Corporate Sponsor',
    de: 'Offizieller Unternehmenssponsor',
    fr: 'Sponsor Entreprise Officiel',
    es: 'Patrocinador Corporativo Oficial',
    zh: '官方认证企业赞助商',
    tr: 'Resmi Kurumsal Sponsor',
  },
};

// Pre-indexed reverse lookup map from GLOBAL_TRANSLATIONS for instant O(1) multi-language resolution
const REVERSE_GLOBAL_MAP: Map<string, Record<SupportedLang, string>> = new Map();

// Build reverse index from GLOBAL_TRANSLATIONS at module load
(function initGlobalTranslationIndex() {
  try {
    const allLangs: SupportedLang[] = ['ar', 'en', 'de', 'fr', 'es', 'zh', 'tr'];
    const baseAr = GLOBAL_TRANSLATIONS.ar;
    const baseEn = GLOBAL_TRANSLATIONS.en;

    const traverse = (objAr: any, objEn: any, path: string[] = []) => {
      if (!objAr || typeof objAr !== 'object') return;
      for (const k of Object.keys(objAr)) {
        const valAr = objAr[k];
        const valEn = objEn?.[k];
        if (typeof valAr === 'string') {
          const entry: Record<SupportedLang, string> = {} as any;
          allLangs.forEach(lang => {
            let cur = GLOBAL_TRANSLATIONS[lang];
            for (const p of path) { cur = cur?.[p]; }
            entry[lang] = cur?.[k] || (lang === 'ar' ? valAr : valEn || valAr);
          });

          const normAr = valAr.trim().toLowerCase();
          const normEn = (valEn || '').trim().toLowerCase();
          if (normAr) REVERSE_GLOBAL_MAP.set(normAr, entry);
          if (normEn) REVERSE_GLOBAL_MAP.set(normEn, entry);
        } else if (typeof valAr === 'object') {
          traverse(valAr, objEn?.[k], [...path, k]);
        }
      }
    };
    traverse(baseAr, baseEn, []);
  } catch (e) {
    console.warn('[Translator] Reverse index init bypassed:', e);
  }
})();

/**
 * Universal Dual-String Translation Resolver
 * Dynamically resolves any (Arabic, English) pair into the exact active language:
 * 'ar' | 'en' | 'de' | 'fr' | 'es' | 'zh' | 'tr'
 */
export function loc(arText: string, enText: string, lang?: string): string {
  const targetLang = normalizeLanguage(lang || (typeof window !== 'undefined' ? localStorage.getItem('locale') || 'ar' : 'ar'));

  if (targetLang === 'ar') return arText || enText || '';
  if (targetLang === 'en') return enText || arText || '';

  const cleanEn = (enText || '').trim().toLowerCase();
  const cleanAr = (arText || '').trim().toLowerCase();

  // 1. Check in in-memory UI hash dictionary by English key
  if (cleanEn && DICTIONARY[cleanEn] && DICTIONARY[cleanEn][targetLang]) {
    return DICTIONARY[cleanEn][targetLang];
  }

  // 2. Check in in-memory UI hash dictionary by Arabic key
  if (cleanAr && DICTIONARY[cleanAr] && DICTIONARY[cleanAr][targetLang]) {
    return DICTIONARY[cleanAr][targetLang];
  }

  // 3. Check in Reverse Global Translation Matrix
  if (cleanAr && REVERSE_GLOBAL_MAP.has(cleanAr)) {
    const mapped = REVERSE_GLOBAL_MAP.get(cleanAr);
    if (mapped?.[targetLang]) return mapped[targetLang];
  }
  if (cleanEn && REVERSE_GLOBAL_MAP.has(cleanEn)) {
    const mapped = REVERSE_GLOBAL_MAP.get(cleanEn);
    if (mapped?.[targetLang]) return mapped[targetLang];
  }

  // 4. Check in Dynamic Legal Lexicon & Terminology Engine (Unicode-safe)
  const cleanEnKey = (enText || '').toLowerCase().replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '');
  if (cleanEnKey) {
    const legalTermByEn = legalLexiconEngine.getTerm(cleanEnKey, targetLang);
    if (legalTermByEn && legalTermByEn !== cleanEnKey) {
      return legalTermByEn;
    }
  }

  // 5. Return English fallback if no direct translation exists (never empty)
  return enText || arText || '';
}


/**
 * Universal React Hook for 100% Reactive Multi-Language Support
 */
export function usePlatformLocale() {
  const { i18n, t } = useTranslation();
  const [currentLang, setCurrentLang] = useState<SupportedLang>(normalizeLanguage(i18n.language));

  useEffect(() => {
    setCurrentLang(normalizeLanguage(i18n.language));
  }, [i18n.language]);

  useEffect(() => {
    const onCustomLangChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ lang: string }>;
      if (customEvent.detail?.lang) {
        setCurrentLang(normalizeLanguage(customEvent.detail.lang));
      }
    };
    window.addEventListener('juristech_lang_change', onCustomLangChange);
    return () => window.removeEventListener('juristech_lang_change', onCustomLangChange);
  }, []);

  const isRtl = currentLang === 'ar';
  const gt = GLOBAL_TRANSLATIONS[currentLang] || GLOBAL_TRANSLATIONS.en;

  const l = (arText: string, enText: string): string => {
    return loc(arText, enText, currentLang);
  };

  const lArray = (arArr: string[], enArr: string[]): string[] => {
    if (currentLang === 'ar') return arArr;
    if (currentLang === 'en') return enArr;
    return enArr.map((item, idx) => l(arArr[idx] || item, item));
  };

  /**
   * Feed new client/visitor statutory interactions into legal language self-learning
   */
  const learnFromClientInteraction = (rawQuery: string) => {
    legalLexiconEngine.harvestClientQuery(rawQuery, currentLang);
  };

  return {
    lang: currentLang,
    isRtl,
    gt,
    l,
    lArray,
    t,
    i18n,
    learnFromClientInteraction,
    legalLexiconEngine,
  };
}
