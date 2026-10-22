/**
 * src/lib/universalTranslator.ts
 * ══════════════════════════════════════════════════════════════════════════════
 * Instantaneous 7-Language Universal Translation & Localization Engine
 * 
 * Supports 7 Global Sovereign Languages:
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
import { useLocale } from '../context/LocaleContext';

import enMessages from '../../messages/en.json';
import arMessages from '../../messages/ar.json';
import frMessages from '../../messages/fr.json';
import esMessages from '../../messages/es.json';
import deMessages from '../../messages/de.json';
import trMessages from '../../messages/tr.json';
import zhMessages from '../../messages/zh.json';
import { resources as allI18nResources } from '../i18n/config';

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
  'الرئيسية': {
    ar: 'الرئيسية',
    en: 'Dashboard',
    de: 'Dashboard',
    fr: 'Tableau de bord',
    es: 'Panel Principal',
    zh: '控制面板',
    tr: 'Kontrol Paneli',
  },
  'ai legal advisor': {
    ar: 'المساعد القانوني الذكي',
    en: 'AI Legal Assistant',
    de: 'KI-Rechtsassistent',
    fr: 'Assistant Juridique IA',
    es: 'Asistente Legal IA',
    zh: 'AI法律助手',
    tr: 'Yapay Zeka Hukuk Asistanı',
  },
  'المستشار الذكي': {
    ar: 'المستشار الذكي',
    en: 'AI Advisor',
    de: 'KI-Berater',
    fr: 'Conseiller IA',
    es: 'Asesor IA',
    zh: 'AI顾问',
    tr: 'Yapay Zeka Danışmanı',
  },
  'المساعد القانوني الذكي': {
    ar: 'المساعد القانوني الذكي',
    en: 'AI Legal Assistant',
    de: 'KI-Rechtsassistent',
    fr: 'Assistant Juridique IA',
    es: 'Asistente Legal IA',
    zh: 'AI法律助手',
    tr: 'Yapay Zeka Hukuk Asistanı',
  },
  'contract generator': {
    ar: 'صانع العقود الذكية',
    en: 'Contract Generator',
    de: 'Vertragsgenerator',
    fr: 'Générateur de Contrats',
    es: 'Generador de Contratos',
    zh: '合同生成器',
    tr: 'Sözleşme Oluşturucu',
  },
  'صانع العقود': {
    ar: 'صانع العقود',
    en: 'Contract Generator',
    de: 'Vertragsgenerator',
    fr: 'Générateur de Contrats',
    es: 'Generador de Contratos',
    zh: '合同生成器',
    tr: 'Sözleşme Oluşturucu',
  },
  'risk radar': {
    ar: 'فحص المخاطر',
    en: 'Risk Radar',
    de: 'Risiko-Radar',
    fr: 'Radar des Risques',
    es: 'Radar de Riesgos',
    zh: '风险雷达',
    tr: 'Risk Radarı',
  },
  'فحص المخاطر': {
    ar: 'فحص المخاطر',
    en: 'Risk Audit',
    de: 'Risikoprüfung',
    fr: 'Audit des Risques',
    es: 'Auditoría de Riesgos',
    zh: '风险审计',
    tr: 'Risk Denetimi',
  },
  'contracts repository': {
    ar: 'مستودع العقود',
    en: 'Contracts Repository',
    de: 'Vertragstresor',
    fr: 'Répertoire de Contrats',
    es: 'Repositorio de Contratos',
    zh: '合同知识库',
    tr: 'Sözleşme Deposu',
  },
  'مستودع العقود': {
    ar: 'مستودع العقود',
    en: 'Contracts Repository',
    de: 'Vertragstresor',
    fr: 'Répertoire de Contrats',
    es: 'Repositorio de Contratos',
    zh: '合同知识库',
    tr: 'Sözleşme Deposu',
  },
  'templates studio': {
    ar: 'استوديو النماذج',
    en: 'Templates Studio',
    de: 'Vorlagen-Studio',
    fr: 'Studio de Modèles',
    es: 'Estudio de Plantillas',
    zh: '模板工作室',
    tr: 'Şablon Stüdyosu',
  },
  'استوديو النماذج': {
    ar: 'استوديو النماذج',
    en: 'Templates Studio',
    de: 'Vorlagen-Studio',
    fr: 'Studio de Modèles',
    es: 'Estudio de Plantillas',
    zh: '模板工作室',
    tr: 'Şablon Stüdyosu',
  },
  'النماذج الجاهزة': {
    ar: 'النماذج الجاهزة',
    en: 'Templates Library',
    de: 'Vorlagenbibliothek',
    fr: 'Bibliothèque de Modèles',
    es: 'Biblioteca de Plantillas',
    zh: '模板库',
    tr: 'Şablon Kütüphanesi',
  },
  'encrypted vault': {
    ar: 'الخزنة المشفرة',
    en: 'Encrypted Vault',
    de: 'Verschlüsselter Tresor',
    fr: 'Coffre-fort Crypté',
    es: 'Bóveda Cifrada',
    zh: '加密保险库',
    tr: 'Şifreli Kasa',
  },
  'الخزنة المشفرة': {
    ar: 'الخزنة المشفرة',
    en: 'Encrypted Vault',
    de: 'Verschlüsselter Tresor',
    fr: 'Coffre-fort Crypté',
    es: 'Bóveda Cifrada',
    zh: '加密保险库',
    tr: 'Şifreli Kasa',
  },
  'company formation': {
    ar: 'تأسيس الشركات',
    en: 'Company Formation',
    de: 'Unternehmensgründung',
    fr: 'Création d\'Entreprise',
    es: 'Constitución de Empresas',
    zh: '公司设立',
    tr: 'Şirket Kuruluşu',
  },
  'تأسيس الشركات': {
    ar: 'تأسيس الشركات',
    en: 'Company Formation',
    de: 'Unternehmensgründung',
    fr: 'Création d\'Entreprise',
    es: 'Constitución de Empresas',
    zh: '公司设立',
    tr: 'Şirket Kuruluşu',
  },
  'enterprise audit': {
    ar: 'تدقيق الاستحواذ والشركات',
    en: 'M&A & Enterprise Audit',
    de: 'M&A- und Unternehmensprüfung',
    fr: 'Audit M&A et Entreprises',
    es: 'Auditoría M&A y Empresas',
    zh: '并购与企业审计',
    tr: 'Birleşme ve Şirket Denetimi',
  },
  'negotiation': {
    ar: 'محاكي التفاوض',
    en: 'Negotiation Simulator',
    de: 'Verhandlungssimulator',
    fr: 'Simulateur de Négociation',
    es: 'Simulador de Negociación',
    zh: '谈判模拟器',
    tr: 'Müzakere Simülatörü',
  },
  'pricing': {
    ar: 'باقات الاشتراك',
    en: 'Pricing Plans',
    de: 'Tarife & Preise',
    fr: 'Tarifs & Abonnements',
    es: 'Planes y Precios',
    zh: '价格套餐',
    tr: 'Fiyatlandırma Planları',
  },
  'باقات الاشتراك': {
    ar: 'باقات الاشتراك',
    en: 'Pricing Plans',
    de: 'Tarife & Preise',
    fr: 'Tarifs & Abonnements',
    es: 'Planes y Precios',
    zh: '价格套餐',
    tr: 'Fiyatlandırma Planları',
  },
  'support': {
    ar: 'الدعم الفني',
    en: 'Support',
    de: 'Support',
    fr: 'Support',
    es: 'Soporte',
    zh: '技术支持',
    tr: 'Destek',
  },
  'الدعم الفني': {
    ar: 'الدعم الفني',
    en: 'Support',
    de: 'Support',
    fr: 'Support',
    es: 'Soporte',
    zh: '技术支持',
    tr: 'Destek',
  },
  'about us': {
    ar: 'من نحن',
    en: 'About Us',
    de: 'Über uns',
    fr: 'À propos',
    es: 'Quiénes Somos',
    zh: '关于我们',
    tr: 'Hakkımızda',
  },
  'من نحن': {
    ar: 'من نحن',
    en: 'About Us',
    de: 'Über uns',
    fr: 'À propos',
    es: 'Quiénes Somos',
    zh: '关于我们',
    tr: 'Hakkımızda',
  },
  'legal compliance': {
    ar: 'الامتثال والحوكمة',
    en: 'Legal Compliance',
    de: 'Rechtliche Compliance',
    fr: 'Conformité Juridique',
    es: 'Cumplimiento Legal',
    zh: '法律合规',
    tr: 'Hukuki Uyumluluk',
  },
  'الامتثال والحوكمة': {
    ar: 'الامتثال والحوكمة',
    en: 'Legal Compliance',
    de: 'Rechtliche Compliance',
    fr: 'Conformité Juridique',
    es: 'Cumplimiento Legal',
    zh: '法律合规',
    tr: 'Hukuki Uyumluluk',
  },
  'تسجيل الدخول': {
    ar: 'تسجيل الدخول',
    en: 'Sign In',
    de: 'Anmelden',
    fr: 'Connexion',
    es: 'Iniciar Sesión',
    zh: '登录',
    tr: 'Giriş Yap',
  },
  'sign in': {
    ar: 'تسجيل الدخول',
    en: 'Sign In',
    de: 'Anmelden',
    fr: 'Connexion',
    es: 'Iniciar Sesión',
    zh: '登录',
    tr: 'Giriş Yap',
  },
  'إنشاء حساب': {
    ar: 'إنشاء حساب',
    en: 'Create Account',
    de: 'Konto erstellen',
    fr: 'Créer un Compte',
    es: 'Crear Cuenta',
    zh: '注册账号',
    tr: 'Hesap Oluştur',
  },
  'create account': {
    ar: 'إنشاء حساب',
    en: 'Create Account',
    de: 'Konto erstellen',
    fr: 'Créer un Compte',
    es: 'Crear Cuenta',
    zh: '注册账号',
    tr: 'Hesap Oluştur',
  },
  'تسجيل خروج': {
    ar: 'تسجيل خروج',
    en: 'Sign Out',
    de: 'Abmelden',
    fr: 'Déconnexion',
    es: 'Cerrar Sesión',
    zh: '退出登录',
    tr: 'Çıkış Yap',
  },
  'sign out': {
    ar: 'تسجيل خروج',
    en: 'Sign Out',
    de: 'Abmelden',
    fr: 'Déconnexion',
    es: 'Cerrar Sesión',
    zh: '退出登录',
    tr: 'Çıkış Yap',
  },

  // Hero Section & Realistic Marketing Claims (Without Exaggeration)
  'المنظومة السيادية الأولى للذكاء الاصطناعي القانوني وتدقيق العقود': {
    ar: 'منصة الذكاء الاصطناعي لمراجعة وتدقيق العقود القانونية',
    en: 'AI Legal Intelligence & Enterprise Contract Audit Platform',
    de: 'KI-Plattform für juristische Vertragsprüfung und Auditierung',
    fr: 'Plateforme IA d\'Audit et de Révision de Contrats Juridiques',
    es: 'Plataforma IA de Auditoría y Revisión de Contratos Legales',
    zh: '企业法律合同智能审查与审计平台',
    tr: 'Yapay Zeka Hukuki Sözleşme İnceleme ve Denetim Platformu',
  },
  'sovereign ai legal intelligence & enterprise contract os': {
    ar: 'منصة الذكاء الاصطناعي لمراجعة وتدقيق العقود القانونية',
    en: 'AI Legal Intelligence & Enterprise Contract Audit Platform',
    de: 'KI-Plattform für juristische Vertragsprüfung und Auditierung',
    fr: 'Plateforme IA d\'Audit et de Révision de Contrats Juridiques',
    es: 'Plataforma IA de Auditoría y Revisión de Contratos Legales',
    zh: '企业法律合同智能审查与审计平台',
    tr: 'Yapay Zeka Hukuki Sözleşme İnceleme ve Denetim Platformu',
  },
  '15 ولاية تشريعية (الخليج، مصر، بريطانيا، أمريكا)': {
    ar: '15 نظاماً تشريعياً (السعودية، الخليج، مصر، بريطانيا، أمريكا)',
    en: '15 Statutory Frameworks (GCC, Egypt, UK, US, EU)',
    de: '15 Rechtsordnungen (GCC, Ägypten, UK, USA, EU)',
    fr: '15 Juridictions (CCG, Égypte, Royaume-Uni, États-Unis, UE)',
    es: '15 Jurisdicciones (CCG, Egipto, Reino Unido, EE.UU., UE)',
    zh: '15大司法管辖区（海湾六国、埃及、英美与欧盟）',
    tr: '15 Hukuk Sistemi (KİK, Mısır, İngiltere, ABD, AB)',
  },
  '15 jurisdictions (gcc, uk, us, eu)': {
    ar: '15 نظاماً تشريعياً (السعودية، الخليج، مصر، بريطانيا، أمريكا)',
    en: '15 Statutory Frameworks (GCC, Egypt, UK, US, EU)',
    de: '15 Rechtsordnungen (GCC, Ägypten, UK, USA, EU)',
    fr: '15 Juridictions (CCG, Égypte, Royaume-Uni, États-Unis, UE)',
    es: '15 Jurisdicciones (CCG, Egipto, Reino Unido, EE.UU., UE)',
    zh: '15大司法管辖区（海湾六国、埃及、英美与欧盟）',
    tr: '15 Hukuk Sistemi (KİK, Mısır, İngiltere, ABD, AB)',
  },
  'احمِ استثماراتك وعقودك بالذكاء الاصطناعي ': {
    ar: 'راجع عقودك واحمِ استثماراتك بدقة الذكاء الاصطناعي ',
    en: 'Review Contracts & Safeguard Deals with AI ',
    de: 'Prüfen Sie Verträge & schützen Sie Investitionen mit KI ',
    fr: 'Révisez vos Contrats & Sécurisez vos Investissements avec l\'IA ',
    es: 'Revise Contratos y Proteja Inversiones con IA ',
    zh: '利用人工智能审查合同并保护企业投资 ',
    tr: 'Yapay Zeka ile Sözleşmeleri İnceleyin ve Yatırımları Koruyun ',
  },
  'sovereign legal intelligence for ': {
    ar: 'راجع عقودك واحمِ استثماراتك بدقة الذكاء الاصطناعي ',
    en: 'Review Contracts & Safeguard Deals with AI ',
    de: 'Prüfen Sie Verträge & schützen Sie Investitionen mit KI ',
    fr: 'Révisez vos Contrats & Sécurisez vos Investissements avec l\'IA ',
    es: 'Revise Contratos y Proteja Inversiones con IA ',
    zh: '利用人工智能审查合同并保护企业投资 ',
    tr: 'Yapay Zeka ile Sözleşmeleri İnceleyin ve Yatırımları Koruyun ',
  },
  'السيادي فائق الدقة': {
    ar: 'القانوني عالي الدقة',
    en: 'High-Stakes Contracts',
    de: 'Hochpräzise Vertragsprüfung',
    fr: 'Haute Précision Juridique',
    es: 'Alta Precisión Jurídica',
    zh: '高价值商业协议',
    tr: 'Yüksek Hassasiyetli Sözleşmeler',
  },
  'high-stakes contracts': {
    ar: 'القانوني عالي الدقة',
    en: 'High-Stakes Contracts',
    de: 'Hochpräzise Vertragsprüfung',
    fr: 'Haute Précision Juridique',
    es: 'Alta Precisión Jurídica',
    zh: '高价值商业协议',
    tr: 'Yüksek Hassasiyetli Sözleşmeler',
  },

  // Action Buttons & CTAs
  '⚡ افحص عقدك مجاناً بالذكاء الاصطناعي': {
    ar: '⚡ افحص عقدك مجاناً بالذكاء الاصطناعي',
    en: '⚡ Audit Your Contract Free with AI',
    de: '⚡ Vertrag kostenlos mit KI prüfen',
    fr: '⚡ Auditer votre Contrat Gratuitement avec l\'IA',
    es: '⚡ Audite su Contrato Gratis con IA',
    zh: '⚡ 免费使用AI进行合同审查',
    tr: '⚡ Sözleşmenizi Yapay Zeka ile Ücretsiz İnceleyin',
  },
  '⚡ audit your contract free with ai': {
    ar: '⚡ افحص عقدك مجاناً بالذكاء الاصطناعي',
    en: '⚡ Audit Your Contract Free with AI',
    de: '⚡ Vertrag kostenlos mit KI prüfen',
    fr: '⚡ Auditer votre Contrat Gratuitement avec l\'IA',
    es: '⚡ Audite su Contrato Gratis con IA',
    zh: '⚡ 免费使用AI进行合同审查',
    tr: '⚡ Sözleşmenizi Yapay Zeka ile Ücretsiz İnceleyin',
  },
  'استكشف الخدمات (6 فئات معتمدة)': {
    ar: 'استكشف الخدمات (6 فئات معتمدة)',
    en: 'Explore All Services (6 Categories)',
    de: 'Alle Dienste erkunden (6 Kategorien)',
    fr: 'Explorer les Services (6 Catégories)',
    es: 'Explorar Servicios (6 Categorías)',
    zh: '探索所有法律服务（6大类别）',
    tr: 'Tüm Hizmetleri Keşfedin (6 Kategori)',
  },
  'explore all services (6 categories)': {
    ar: 'استكشف الخدمات (6 فئات معتمدة)',
    en: 'Explore All Services (6 Categories)',
    de: 'Alle Dienste erkunden (6 Kategorien)',
    fr: 'Explorer les Services (6 Catégories)',
    es: 'Explorar Servicios (6 Categorías)',
    zh: '探索所有法律服务（6大类别）',
    tr: 'Tüm Hizmetleri Keşfedin (6 Kategori)',
  },
  'صياغة عقد تجاري': {
    ar: 'صياغة عقد تجاري',
    en: 'Draft Commercial Contract',
    de: 'Gewerblichen Vertrag erstellen',
    fr: 'Rédiger un Contrat Commercial',
    es: 'Redactar Contrato Comercial',
    zh: '起草商业合同',
    tr: 'Ticari Sözleşme Hazırla',
  },
  'فحص مخاطر عقدك': {
    ar: 'فحص مخاطر عقدك',
    en: 'Audit Contract Risk',
    de: 'Vertragsrisiken prüfen',
    fr: 'Auditer les Risques du Contrat',
    es: 'Auditar Riesgos del Contrato',
    zh: '审查合同风险',
    tr: 'Sözleşme Riskini Denetle',
  },
  'تحميل ملف word (.docx)': {
    ar: 'تحميل ملف Word (.docx)',
    en: 'Download Word (.docx)',
    de: 'Word herunterladen (.docx)',
    fr: 'Télécharger Word (.docx)',
    es: 'Descargar Word (.docx)',
    zh: '下载Word文件 (.docx)',
    tr: 'Word Dosyası İndir (.docx)',
  },
  'تحميل ملف word': {
    ar: 'تحميل ملف Word',
    en: 'Download Word',
    de: 'Word herunterladen',
    fr: 'Télécharger Word',
    es: 'Descargar Word',
    zh: '下载Word',
    tr: 'Word İndir',
  },
  'download word (.docx)': {
    ar: 'تحميل ملف Word (.docx)',
    en: 'Download Word (.docx)',
    de: 'Word herunterladen (.docx)',
    fr: 'Télécharger Word (.docx)',
    es: 'Descargar Word (.docx)',
    zh: '下载Word文件 (.docx)',
    tr: 'Word Dosyası İndir (.docx)',
  },
  'معاينة': {
    ar: 'معاينة',
    en: 'Preview',
    de: 'Vorschau',
    fr: 'Aperçu',
    es: 'Vista previa',
    zh: '预览',
    tr: 'Önizleme',
  },
  'preview': {
    ar: 'معاينة',
    en: 'Preview',
    de: 'Vorschau',
    fr: 'Aperçu',
    es: 'Vista previa',
    zh: '预览',
    tr: 'Önizleme',
  },
  'نسخ': {
    ar: 'نسخ',
    en: 'Copy',
    de: 'Kopieren',
    fr: 'Copier',
    es: 'Copiar',
    zh: '复制',
    tr: 'Kopyala',
  },
  'copy': {
    ar: 'نسخ',
    en: 'Copy',
    de: 'Kopieren',
    fr: 'Copier',
    es: 'Copiar',
    zh: '复制',
    tr: 'Kopyala',
  },
  'تم النسخ': {
    ar: 'تم النسخ بنجاح',
    en: 'Copied',
    de: 'Kopiert',
    fr: 'Copié',
    es: 'Copiado',
    zh: '已复制',
    tr: 'Kopyalandı',
  },
  'copied': {
    ar: 'تم النسخ بنجاح',
    en: 'Copied',
    de: 'Kopiert',
    fr: 'Copié',
    es: 'Copiado',
    zh: '已复制',
    tr: 'Kopyalandı',
  },
  'إغلاق': {
    ar: 'إغلاق',
    en: 'Close',
    de: 'Schließen',
    fr: 'Fermer',
    es: 'Cerrar',
    zh: '关闭',
    tr: 'Kapat',
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
  'اشترك الآن': {
    ar: 'اشترك الآن',
    en: 'Subscribe Now',
    de: 'Jetzt abonnieren',
    fr: 'S\'abonner maintenant',
    es: 'Suscribirse ahora',
    zh: '立即订阅',
    tr: 'Şimdi Abone Ol',
  },
  'subscribe now': {
    ar: 'اشترك الآن',
    en: 'Subscribe Now',
    de: 'Jetzt abonnieren',
    fr: 'S\'abonner maintenant',
    es: 'Suscribirse ahora',
    zh: '立即订阅',
    tr: 'Şimdi Abone Ol',
  },
  'اختيار الباقة': {
    ar: 'اختيار الباقة',
    en: 'Select Plan',
    de: 'Tarif wählen',
    fr: 'Choisir le Forfait',
    es: 'Seleccionar Plan',
    zh: '选择套餐',
    tr: 'Planı Seç',
  },
  'select plan': {
    ar: 'اختيار الباقة',
    en: 'Select Plan',
    de: 'Tarif wählen',
    fr: 'Choisir le Forfait',
    es: 'Seleccionar Plan',
    zh: '选择套餐',
    tr: 'Planı Seç',
  },

  // Trust Badges
  'تشفير بنكي aes-256': {
    ar: 'تشفير بنكي AES-256',
    en: 'AES-256 Bank Encryption',
    de: 'AES-256 Bankenverschlüsselung',
    fr: 'Cryptage Bancaire AES-256',
    es: 'Cifrado Bancario AES-256',
    zh: 'AES-256银行级端到端加密',
    tr: 'AES-256 Banka Düzeyi Şifreleme',
  },
  'aes-256 bank-grade e2ee': {
    ar: 'تشفير بنكي AES-256',
    en: 'AES-256 Bank Encryption',
    de: 'AES-256 Bankenverschlüsselung',
    fr: 'Cryptage Bancaire AES-256',
    es: 'Cifrado Bancario AES-256',
    zh: 'AES-256银行级端到端加密',
    tr: 'AES-256 Banka Düzeyi Şifreleme',
  },
  'تغطية 15 ولاية قضائية': {
    ar: 'تغطية 15 نظاماً قانونياً',
    en: '15+ Statutory Frameworks',
    de: '15+ Rechtsordnungen',
    fr: '15+ Juridictions Légales',
    es: '15+ Jurisdicciones Legales',
    zh: '覆盖15+司法管辖区',
    tr: '15+ Hukuk Sistemi Kapsamı',
  },
  '15+ sovereign frameworks': {
    ar: 'تغطية 15 نظاماً قانونياً',
    en: '15+ Statutory Frameworks',
    de: '15+ Rechtsordnungen',
    fr: '15+ Juridictions Légales',
    es: '15+ Jurisdicciones Legales',
    zh: '覆盖15+司法管辖区',
    tr: '15+ Hukuk Sistemi Kapsamı',
  },
  'خصوصية مطلقة للبيانات': {
    ar: 'خصوصية وسرية تامة للبيانات',
    en: 'Zero AI Data Retention',
    de: 'Keine KI-Datenspeicherung',
    fr: 'Confidentialité Totale des Données',
    es: 'Confidencialidad Total de Datos',
    zh: '零公共AI训练与严格数据保密',
    tr: 'Tam Veri Gizliliği ve Güvenliği',
  },
  'zero ai data retention': {
    ar: 'خصوصية وسرية تامة للبيانات',
    en: 'Zero AI Data Retention',
    de: 'Keine KI-Datenspeicherung',
    fr: 'Confidentialité Totale des Données',
    es: 'Confidencialidad Total de Datos',
    zh: '零公共AI训练与严格数据保密',
    tr: 'Tam Veri Gizliliği ve Güvenliği',
  },

  // Risk Severity & Vectors
  'حرج': {
    ar: 'حرج',
    en: 'Critical',
    de: 'Kritisch',
    fr: 'Critique',
    es: 'Crítico',
    zh: '严重',
    tr: 'Kritik',
  },
  'critical': {
    ar: 'حرج',
    en: 'Critical',
    de: 'Kritisch',
    fr: 'Critique',
    es: 'Crítico',
    zh: '严重',
    tr: 'Kritik',
  },
  'مرتفع': {
    ar: 'مرتفع',
    en: 'High',
    de: 'Hoch',
    fr: 'Élevé',
    es: 'Alto',
    zh: '高',
    tr: 'Yüksek',
  },
  'high': {
    ar: 'مرتفع',
    en: 'High',
    de: 'Hoch',
    fr: 'Élevé',
    es: 'Alto',
    zh: '高',
    tr: 'Yüksek',
  },
  'متوسط': {
    ar: 'متوسط',
    en: 'Medium',
    de: 'Mittel',
    fr: 'Moyen',
    es: 'Medio',
    zh: '中',
    tr: 'Orta',
  },
  'medium': {
    ar: 'متوسط',
    en: 'Medium',
    de: 'Mittel',
    fr: 'Moyen',
    es: 'Medio',
    zh: '中',
    tr: 'Orta',
  },
  'منخفض': {
    ar: 'منخفض',
    en: 'Low',
    de: 'Niedrig',
    fr: 'Faible',
    es: 'Bajo',
    zh: '低',
    tr: 'Düşük',
  },
  'low': {
    ar: 'منخفض',
    en: 'Low',
    de: 'Niedrig',
    fr: 'Faible',
    es: 'Bajo',
    zh: '低',
    tr: 'Düşük',
  },
  'مخاطر مالية': {
    ar: 'مخاطر مالية',
    en: 'Financial Risk',
    de: 'Finanzielles Risiko',
    fr: 'Risque Financier',
    es: 'Riesgo Financiero',
    zh: '财务风险',
    tr: 'Finansal Risk',
  },
  'financial': {
    ar: 'مخاطر مالية',
    en: 'Financial Risk',
    de: 'Finanzielles Risiko',
    fr: 'Risque Financier',
    es: 'Riesgo Financiero',
    zh: '财务风险',
    tr: 'Finansal Risk',
  },
  'مخاطر تشغيلية': {
    ar: 'مخاطر تشغيلية',
    en: 'Operational Risk',
    de: 'Operatives Risiko',
    fr: 'Risque Opérationnel',
    es: 'Riesgo Operativo',
    zh: '运营风险',
    tr: 'Operasyonel Risk',
  },
  'operational': {
    ar: 'مخاطر تشغيلية',
    en: 'Operational Risk',
    de: 'Operatives Risiko',
    fr: 'Risque Opérationnel',
    es: 'Riesgo Operativo',
    zh: '运营风险',
    tr: 'Operasyonel Risk',
  },
  'ملكية فكرية': {
    ar: 'ملكية فكرية',
    en: 'Intellectual Property',
    de: 'Geistiges Eigentum',
    fr: 'Propriété Intellectuelle',
    es: 'Propiedad Intelectual',
    zh: '知识产权',
    tr: 'Fikri Mülkiyet',
  },
  'ip': {
    ar: 'ملكية فكرية',
    en: 'Intellectual Property',
    de: 'Geistiges Eigentum',
    fr: 'Propriété Intellectuelle',
    es: 'Propiedad Intelectual',
    zh: '知识产权',
    tr: 'Fikri Mülkiyet',
  },
  'امتثال تنظيمي': {
    ar: 'امتثال تنظيمي',
    en: 'Regulatory Compliance',
    de: 'Regulatorische Compliance',
    fr: 'Conformité Réglementaire',
    es: 'Cumplimiento Regulatorio',
    zh: '法规合规',
    tr: 'Düzenleyici Uyum',
  },
  'regulatory': {
    ar: 'امتثال تنظيمي',
    en: 'Regulatory Compliance',
    de: 'Regulatorische Compliance',
    fr: 'Conformité Réglementaire',
    es: 'Cumplimiento Regulatorio',
    zh: '法规合规',
    tr: 'Düzenleyici Uyum',
  },

  // Pricing Plans Names & Terms
  'باقة الشركات الصغرى والناشئة': {
    ar: 'باقة الشركات الصغرى والناشئة',
    en: 'Micro / Startup Tier',
    de: 'Startup & Kleinunternehmer Paket',
    fr: 'Forfait Startups & TPE',
    es: 'Paquete Startups y Pequeñas Empresas',
    zh: '初创与小微企业套餐',
    tr: 'Girişim ve Küçük İşletme Paketi',
  },
  'micro / startup tier': {
    ar: 'باقة الشركات الصغرى والناشئة',
    en: 'Micro / Startup Tier',
    de: 'Startup & Kleinunternehmer Paket',
    fr: 'Forfait Startups & TPE',
    es: 'Paquete Startups y Pequeñas Empresas',
    zh: '初创与小微企业套餐',
    tr: 'Girişim ve Küçük İşletme Paketi',
  },
  'باقة الشركات المتوسطة والنمو': {
    ar: 'باقة الشركات المتوسطة والنمو',
    en: 'SMEs & Growth Package',
    de: 'KMU & Wachstumspaket',
    fr: 'Forfait PME & Croissance',
    es: 'Paquete PYMES y Crecimiento',
    zh: '中小企业与快速增长套餐',
    tr: 'KOBİ ve Büyüme Paketi',
  },
  'smes & growth package': {
    ar: 'باقة الشركات المتوسطة والنمو',
    en: 'SMEs & Growth Package',
    de: 'KMU & Wachstumspaket',
    fr: 'Forfait PME & Croissance',
    es: 'Paquete PYMES y Crecimiento',
    zh: '中小企业与快速增长套餐',
    tr: 'KOBİ ve Büyüme Paketi',
  },
  'باقة المؤسسات والشركات الكبرى': {
    ar: 'باقة المؤسسات والشركات الكبرى',
    en: 'Enterprise Tier',
    de: 'Unternehmens- & Konzernpaket',
    fr: 'Forfait Grandes Entreprises',
    es: 'Paquete Corporativo y Grandes Empresas',
    zh: '大型企业与集团定制套餐',
    tr: 'Kurumsal ve Büyük Şirketler Paketi',
  },
  'enterprise sovereign tier': {
    ar: 'باقة المؤسسات والشركات الكبرى',
    en: 'Enterprise Tier',
    de: 'Unternehmens- & Konzernpaket',
    fr: 'Forfait Grandes Entreprises',
    es: 'Paquete Corporativo y Grandes Empresas',
    zh: '大型企业与集团定制套餐',
    tr: 'Kurumsal ve Büyük Şirketler Paketi',
  },
  'شهرياً': {
    ar: 'شهرياً',
    en: '/ month',
    de: '/ Monat',
    fr: '/ mois',
    es: '/ mes',
    zh: '/ 月',
    tr: '/ ay',
  },
  '/ month': {
    ar: 'شهرياً',
    en: '/ month',
    de: '/ Monat',
    fr: '/ mois',
    es: '/ mes',
    zh: '/ 月',
    tr: '/ ay',
  },

  // Common UI Strings
  'بحث في الخدمات...': {
    ar: 'بحث في الخدمات...',
    en: 'Search services...',
    de: 'Dienste suchen...',
    fr: 'Rechercher des services...',
    es: 'Buscar servicios...',
    zh: '搜索服务...',
    tr: 'Hizmetlerde ara...',
  },
  'search services...': {
    ar: 'بحث في الخدمات...',
    en: 'Search services...',
    de: 'Dienste suchen...',
    fr: 'Rechercher des services...',
    es: 'Buscar services...',
    zh: '搜索服务...',
    tr: 'Hizmetlerde ara...',
  },
  'جميع الخدمات': {
    ar: 'جميع الخدمات',
    en: 'All Services',
    de: 'Alle Dienste',
    fr: 'Tous les Services',
    es: 'Todos los Servicios',
    zh: '所有服务',
    tr: 'Tüm Hizmetler',
  },
  'all services': {
    ar: 'جميع الخدمات',
    en: 'All Services',
    de: 'Alle Dienste',
    fr: 'Tous les Services',
    es: 'Todos los Servicios',
    zh: '所有服务',
    tr: 'Tüm Hizmetler',
  },
  'إعادة تعيين البحث': {
    ar: 'إعادة تعيين البحث',
    en: 'Reset search filter',
    de: 'Filter zurücksetzen',
    fr: 'Réinitialiser le filtre',
    es: 'Restablecer filtro',
    zh: '重置筛选',
    tr: 'Filtreyi sıfırla',
  },
  'لم يتم العثور على خدمات مطابقة': {
    ar: 'لم يتم العثور على خدمات مطابقة لبحثك',
    en: 'No services found matching your search',
    de: 'Keine passenden Dienste gefunden',
    fr: 'Aucun service trouvé pour votre recherche',
    es: 'No se encontraron servicios que coincidan',
    zh: '未找到匹配的服务',
    tr: 'Aramanızla eşleşen hizmet bulunamadı',
  },
};

// Pre-indexed reverse lookup map from GLOBAL_TRANSLATIONS for instant O(1) multi-language resolution
const REVERSE_GLOBAL_MAP: Map<string, Record<SupportedLang, string>> = new Map();

// Build reverse index from GLOBAL_TRANSLATIONS, root messages, and all 23 localized namespaces at module load
(function initGlobalTranslationIndex() {
  try {
    const allLangs: SupportedLang[] = ['ar', 'en', 'de', 'fr', 'es', 'zh', 'tr'];
    const baseAr = GLOBAL_TRANSLATIONS.ar;
    const baseEn = GLOBAL_TRANSLATIONS.en;

    const allMsgSources: Record<SupportedLang, any> = {
      ar: arMessages.translation || arMessages,
      en: enMessages.translation || enMessages,
      de: deMessages.translation || deMessages,
      fr: frMessages.translation || frMessages,
      es: esMessages.translation || esMessages,
      zh: zhMessages.translation || zhMessages,
      tr: trMessages.translation || trMessages,
    };

    const traverse = (objAr: any, objEn: any, sourceRoot: any, path: string[] = []) => {
      if (!objAr || typeof objAr !== 'object') return;
      for (const k of Object.keys(objAr)) {
        const valAr = objAr[k];
        const valEn = objEn?.[k];
        if (typeof valAr === 'string') {
          const entry: Record<SupportedLang, string> = {} as any;
          allLangs.forEach(lang => {
            let cur = sourceRoot[lang];
            for (const p of path) { cur = cur?.[p]; }
            entry[lang] = cur?.[k] || (lang === 'ar' ? valAr : valEn || valAr);
          });

          const normAr = valAr.trim().toLowerCase();
          const normEn = (valEn || '').trim().toLowerCase();
          if (normAr) REVERSE_GLOBAL_MAP.set(normAr, entry);
          if (normEn) REVERSE_GLOBAL_MAP.set(normEn, entry);
          const normK = k.trim().toLowerCase();
          if (normK && !REVERSE_GLOBAL_MAP.has(normK)) REVERSE_GLOBAL_MAP.set(normK, entry);
        } else if (typeof valAr === 'object') {
          traverse(valAr, objEn?.[k], sourceRoot, [...path, k]);
        }
      }
    };

    traverse(baseAr, baseEn, GLOBAL_TRANSLATIONS, []);
    traverse(allMsgSources.ar, allMsgSources.en, allMsgSources, []);
    if (allI18nResources && allI18nResources.ar && allI18nResources.en) {
      traverse(allI18nResources.ar, allI18nResources.en, allI18nResources, []);
    }
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
  const targetLang = normalizeLanguage(
    lang ||
      (typeof window !== 'undefined'
        ? localStorage.getItem('juristech.locale') || localStorage.getItem('locale') || 'en'
        : 'en')
  );

  if (targetLang === 'ar') return arText || enText || '';
  if (targetLang === 'en') return enText || arText || '';

  const cleanEn = (enText || '').trim().toLowerCase();
  const cleanAr = (arText || '').trim().toLowerCase();

  // 1. Direct In-Memory UI Hash Dictionary lookup
  if (cleanEn && DICTIONARY[cleanEn] && DICTIONARY[cleanEn][targetLang]) {
    return DICTIONARY[cleanEn][targetLang];
  }
  if (cleanAr && DICTIONARY[cleanAr] && DICTIONARY[cleanAr][targetLang]) {
    return DICTIONARY[cleanAr][targetLang];
  }

  // 2. Check in Reverse Global Translation Matrix
  if (cleanAr && REVERSE_GLOBAL_MAP.has(cleanAr)) {
    const mapped = REVERSE_GLOBAL_MAP.get(cleanAr);
    if (mapped?.[targetLang]) return mapped[targetLang];
  }
  if (cleanEn && REVERSE_GLOBAL_MAP.has(cleanEn)) {
    const mapped = REVERSE_GLOBAL_MAP.get(cleanEn);
    if (mapped?.[targetLang]) return mapped[targetLang];
  }

  // 3. Check stripped trailing punctuation
  const strippedEn = cleanEn.replace(/[:.!?⚡*#↗()]+$/, '').trim();
  const strippedAr = cleanAr.replace(/[:.!?⚡*#↗()]+$/, '').trim();
  if (strippedEn && strippedEn !== cleanEn) {
    if (DICTIONARY[strippedEn]?.[targetLang]) return DICTIONARY[strippedEn][targetLang];
    if (REVERSE_GLOBAL_MAP.has(strippedEn) && REVERSE_GLOBAL_MAP.get(strippedEn)?.[targetLang]) {
      return REVERSE_GLOBAL_MAP.get(strippedEn)![targetLang];
    }
  }
  if (strippedAr && strippedAr !== cleanAr) {
    if (DICTIONARY[strippedAr]?.[targetLang]) return DICTIONARY[strippedAr][targetLang];
    if (REVERSE_GLOBAL_MAP.has(strippedAr) && REVERSE_GLOBAL_MAP.get(strippedAr)?.[targetLang]) {
      return REVERSE_GLOBAL_MAP.get(strippedAr)![targetLang];
    }
  }

  // 4. Check Legal Lexicon Engine
  const cleanEnKey = (enText || '').toLowerCase().replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '');
  if (cleanEnKey) {
    const legalTermByEn = legalLexiconEngine.getTerm(cleanEnKey, targetLang);
    if (legalTermByEn && legalTermByEn !== cleanEnKey) {
      return legalTermByEn;
    }
  }

  // 5. Scan i18next resource bundles for exact match in target language
  try {
    if (allI18nResources && allI18nResources[targetLang]) {
      const langBundle = allI18nResources[targetLang];
      const searchValue = (enText || '').trim().toLowerCase();
      if (searchValue) {
        for (const ns of Object.keys(langBundle)) {
          const nsBundle = (langBundle as any)[ns];
          const enBundle = allI18nResources.en?.[ns as keyof typeof allI18nResources.en];
          if (nsBundle && enBundle && typeof enBundle === 'object') {
            for (const key of Object.keys(enBundle)) {
              const enVal = (enBundle as any)[key];
              if (typeof enVal === 'string' && enVal.trim().toLowerCase() === searchValue) {
                const targetVal = (nsBundle as any)[key];
                if (typeof targetVal === 'string' && targetVal) {
                  return targetVal;
                }
              }
            }
          }
        }
      }
    }
  } catch {
    // Silently continue
  }

  // 6. Intelligent Substring & Keyword Localizer for Target Language (Prevents English Leaks)
  const KEYWORD_MAPS: Record<SupportedLang, Array<[RegExp, string]>> = {
    de: [
      [/audit/gi, 'Prüfung'], [/contract/gi, 'Vertrag'], [/contracts/gi, 'Verträge'],
      [/download/gi, 'Herunterladen'], [/preview/gi, 'Vorschau'], [/copy/gi, 'Kopieren'],
      [/risk/gi, 'Risiko'], [/score/gi, 'Bewertung'], [/explore/gi, 'Erkunden'],
      [/free/gi, 'Kostenlos'], [/commercial/gi, 'Gewerblich'], [/company/gi, 'Unternehmen'],
      [/jurisdiction/gi, 'Gerichtsbarkeit'], [/arbitration/gi, 'Schiedsgerichtsbarkeit'],
      [/month/gi, 'Monat'], [/year/gi, 'Jahr'], [/search/gi, 'Suchen'],
      [/close/gi, 'Schließen'], [/save/gi, 'Speichern'], [/cancel/gi, 'Abbrechen'],
    ],
    fr: [
      [/audit/gi, 'Audit'], [/contract/gi, 'Contrat'], [/contracts/gi, 'Contrats'],
      [/download/gi, 'Télécharger'], [/preview/gi, 'Aperçu'], [/copy/gi, 'Copier'],
      [/risk/gi, 'Risque'], [/score/gi, 'Score'], [/explore/gi, 'Explorer'],
      [/free/gi, 'Gratuit'], [/commercial/gi, 'Commercial'], [/company/gi, 'Entreprise'],
      [/jurisdiction/gi, 'Juridiction'], [/arbitration/gi, 'Arbitrage'],
      [/month/gi, 'Mois'], [/year/gi, 'An'], [/search/gi, 'Rechercher'],
      [/close/gi, 'Fermer'], [/save/gi, 'Enregistrer'], [/cancel/gi, 'Annuler'],
    ],
    es: [
      [/audit/gi, 'Auditoría'], [/contract/gi, 'Contrato'], [/contracts/gi, 'Contratos'],
      [/download/gi, 'Descargar'], [/preview/gi, 'Vista previa'], [/copy/gi, 'Copiar'],
      [/risk/gi, 'Riesgo'], [/score/gi, 'Puntuación'], [/explore/gi, 'Explorar'],
      [/free/gi, 'Gratis'], [/commercial/gi, 'Comercial'], [/company/gi, 'Empresa'],
      [/jurisdiction/gi, 'Jurisdicción'], [/arbitration/gi, 'Arbitraje'],
      [/month/gi, 'Mes'], [/year/gi, 'Año'], [/search/gi, 'Buscar'],
      [/close/gi, 'Cerrar'], [/save/gi, 'Guardar'], [/cancel/gi, 'Cancelar'],
    ],
    tr: [
      [/audit/gi, 'Denetim'], [/contract/gi, 'Sözleşme'], [/contracts/gi, 'Sözleşmeler'],
      [/download/gi, 'İndir'], [/preview/gi, 'Önizleme'], [/copy/gi, 'Kopyala'],
      [/risk/gi, 'Risk'], [/score/gi, 'Skor'], [/explore/gi, 'Keşfet'],
      [/free/gi, 'Ücretsiz'], [/commercial/gi, 'Ticari'], [/company/gi, 'Şirket'],
      [/jurisdiction/gi, 'Yargı Alanı'], [/arbitration/gi, 'Tahkim'],
      [/month/gi, 'Ay'], [/year/gi, 'Yıl'], [/search/gi, 'Ara'],
      [/close/gi, 'Kapat'], [/save/gi, 'Kaydet'], [/cancel/gi, 'İptal'],
    ],
    zh: [
      [/audit/gi, '审查'], [/contract/gi, '合同'], [/contracts/gi, '合同'],
      [/download/gi, '下载'], [/preview/gi, '预览'], [/copy/gi, '复制'],
      [/risk/gi, '风险'], [/score/gi, '评分'], [/explore/gi, '探索'],
      [/free/gi, '免费'], [/commercial/gi, '商业'], [/company/gi, '公司'],
      [/jurisdiction/gi, '管辖权'], [/arbitration/gi, '仲裁'],
      [/month/gi, '月'], [/year/gi, '年'], [/search/gi, '搜索'],
      [/close/gi, '关闭'], [/save/gi, '保存'], [/cancel/gi, '取消'],
    ],
    ar: [],
    en: [],
  };

  // If we have keyword mappings for target language, try smart keyword replacement
  if (KEYWORD_MAPS[targetLang] && KEYWORD_MAPS[targetLang].length > 0 && enText) {
    let candidate = enText;
    let replacedAny = false;
    for (const [regex, replacement] of KEYWORD_MAPS[targetLang]) {
      if (regex.test(candidate)) {
        candidate = candidate.replace(regex, replacement);
        replacedAny = true;
      }
    }
    if (replacedAny) return candidate;
  }

  // 7. Ultimate fallback
  return enText || arText || '';
}

const LOCALE_MAP: Record<SupportedLang, string> = {
  ar: 'ar-EG',
  en: 'en-US',
  de: 'de-DE',
  fr: 'fr-FR',
  es: 'es-ES',
  zh: 'zh-CN',
  tr: 'tr-TR',
};

/**
 * Universally formats numbers strictly adapting to active platform language.
 */
export function formatNumber(value: number | string | undefined | null, lang: SupportedLang = 'ar'): string {
  if (value === undefined || value === null || value === '') return '0';
  const num = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : value;
  if (isNaN(num)) return String(value);

  const locale = LOCALE_MAP[lang] || 'en-US';
  return new Intl.NumberFormat(locale).format(num);
}

/**
 * Universally formats currency amounts adapting to active language and currency symbol.
 */
export function formatCurrency(
  amount: number | string | undefined | null,
  currency: string = 'USD',
  lang: SupportedLang = 'ar'
): string {
  if (amount === undefined || amount === null || amount === '') return '$0';
  const num = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.-]/g, '')) : amount;
  if (isNaN(num)) return `${currency} ${amount}`;

  const locale = LOCALE_MAP[lang] || 'en-US';
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency || 'USD',
      maximumFractionDigits: 0,
    }).format(num);
  } catch {
    return `${currency} ${new Intl.NumberFormat(locale).format(num)}`;
  }
}

/**
 * Universal React Hook for 100% Reactive Multi-Language Support
 */
export function usePlatformLocale() {
  const localeCtx = useLocale();
  const { i18n, t } = useTranslation();
  const currentLang = (localeCtx?.currentLocale || normalizeLanguage(i18n.language)) as SupportedLang;
  const isRtl = localeCtx ? localeCtx.isRtl : currentLang === 'ar';
  const gt = GLOBAL_TRANSLATIONS[currentLang] || GLOBAL_TRANSLATIONS.en;

  /**
   * l() — Dual-Language Shorthand resolving to any of the 7 supported languages.
   * For Arabic: returns arText.
   * For English: returns enText.
   * For de, fr, es, zh, tr: resolves via loc() dictionary, global translation matrix, and keyword localizer.
   */
  const l = (arText: string, enText: string): string => {
    if (currentLang === 'ar') return arText || enText || '';
    if (currentLang === 'en') return enText || arText || '';
    return loc(arText, enText, currentLang);
  };

  /**
   * l7() — Full 7-Language Explicit Shorthand
   */
  const l7 = (
    arText: string,
    enText: string,
    frText?: string,
    esText?: string,
    deText?: string,
    trText?: string,
    zhText?: string
  ): string => {
    switch (currentLang) {
      case 'ar': return arText || enText || '';
      case 'en': return enText || arText || '';
      case 'fr': return frText || enText || arText || '';
      case 'es': return esText || enText || arText || '';
      case 'de': return deText || enText || arText || '';
      case 'tr': return trText || enText || arText || '';
      case 'zh': return zhText || enText || arText || '';
      default:   return enText || arText || '';
    }
  };

  const lArray = (arArr: string[], enArr: string[]): string[] => {
    if (currentLang === 'ar') return arArr;
    if (currentLang === 'en') return enArr;
    return enArr.map((item, idx) => l(arArr[idx] || item, item));
  };

  const formatNum = (value: number | string | undefined | null): string => {
    return formatNumber(value, currentLang);
  };

  const formatCurr = (amount: number | string | undefined | null, currency: string = 'USD'): string => {
    return formatCurrency(amount, currency, currentLang);
  };

  const changeLocale = (target: SupportedLang) => {
    if (localeCtx) {
      localeCtx.changeLocale(target as any);
    } else {
      i18n.changeLanguage(target);
    }
  };

  const learnFromClientInteraction = (rawQuery: string) => {
    legalLexiconEngine.harvestClientQuery(rawQuery, currentLang);
  };

  return {
    lang: currentLang,
    currentLocale: currentLang,
    isRtl,
    gt,
    l,
    l7,
    lArray,
    formatNum,
    formatCurr,
    t,
    i18n,
    changeLocale,
    learnFromClientInteraction,
    legalLexiconEngine,
  };
}

export default usePlatformLocale;
