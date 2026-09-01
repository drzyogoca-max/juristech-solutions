/**
 * src/pages/WelcomePage.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Post-Checkout Welcome & Onboarding Page
 * Target redirect location after successful Paddle Checkout completion.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, ArrowRight, Zap, Award } from 'lucide-react';
import SEO from '../components/SEO';

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center px-4 py-16">
      <SEO
        title="Welcome to JurisTech — Subscription Active"
        description="Your sovereign legal AI subscription has been activated successfully."
      />

      <div className="max-w-md w-full bg-slate-900/80 border border-emerald-500/30 rounded-2xl p-8 backdrop-blur-xl shadow-2xl text-center">
        <div className="mx-auto w-16 h-16 bg-emerald-500/10 border border-emerald-500/40 rounded-full flex items-center justify-center mb-6 text-emerald-400 animate-pulse">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <ShieldCheck className="w-4 h-4" /> Subscription Confirmed
        </div>

        <h1 className="text-3xl font-extrabold text-white mb-3 tracking-tight">
          Welcome to JurisTech!
        </h1>

        <p className="text-slate-300 text-sm mb-8 leading-relaxed">
          Your payment was processed successfully via Paddle. Your sovereign legal AI features and Pro entitlements are now fully active.
        </p>

        <div className="space-y-3 mb-8 text-left bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Unlimited AI Contract Generation & Risk Analysis</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>M&A Intelligence & Cross-Border RAG Assistant</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Automated E-Signatures & Instant PDF Export</span>
          </div>
        </div>

        <Link
          to="/dashboard"
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition shadow-lg shadow-emerald-500/20 text-sm"
        >
          <span>Go to AI Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
