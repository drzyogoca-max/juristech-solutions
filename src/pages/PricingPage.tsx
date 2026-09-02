/**
 * src/pages/PricingPage.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — 3-Tier Country-Localized Pricing Page
 * Integrates @paddle/paddle-js with PricePreview() and one-page overlay Checkout.
 */

import React, { useEffect, useState } from 'react';
import { CheckCircle2, ShieldCheck, Zap, Globe, Lock, ArrowRight, Info, AlertTriangle, Loader2 } from 'lucide-react';
import { PRICING_TIERS, Tier } from '../config/tiers';
import { PADDLE_ENV } from '../config/paddle';
import { fetchPricePreviews, openPaddleCheckout, PricePreviewMap } from '../lib/paddle';
import { useAuth } from '../lib/authContext';
import SEO from '../components/SEO';

export default function PricingPage() {
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'month' | 'year'>('month');
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [pricePreviews, setPricePreviews] = useState<PricePreviewMap>({});
  const [isLoadingPrices, setIsLoadingPrices] = useState<boolean>(true);
  const [checkoutLoadingTier, setCheckoutLoadingTier] = useState<string | null>(null);

  // 1. Detect visitor country server-side via /api/country
  useEffect(() => {
    async function detectCountry() {
      try {
        const res = await fetch('/api/country');
        if (res.ok) {
          const data = await res.json();
          // Keep null if header absent or unknown sentinel
          if (data.country && /^[A-Z]{2}$/i.test(data.country) && data.country.toUpperCase() !== 'OTHERS') {
            setCountryCode(data.country.toUpperCase());
          } else {
            setCountryCode(null);
          }
        }
      } catch (err) {
        console.warn('[Country Detection]: Header detection fallback to Paddle IP auto-detection.', err);
        setCountryCode(null);
      }
    }
    detectCountry();
  }, []);

  // 2. Fetch country-localized prices from Paddle.PricePreview()
  useEffect(() => {
    let isMounted = true;
    async function loadPrices() {
      setIsLoadingPrices(true);
      const activePriceIds = PRICING_TIERS.map((tier) => tier.priceId[billingCycle]);
      
      const previews = await fetchPricePreviews(activePriceIds, countryCode);
      if (isMounted) {
        setPricePreviews(previews);
        setIsLoadingPrices(false);
      }
    }
    loadPrices();
    return () => {
      isMounted = false;
    };
  }, [billingCycle, countryCode]);

  // 3. Handle Subscribe action (Opens Paddle.Checkout.open as one-page overlay)
  const handleSubscribe = async (tier: Tier) => {
    const selectedPriceId = tier.priceId[billingCycle];
    setCheckoutLoadingTier(tier.name);

    try {
      await openPaddleCheckout({
        priceId: selectedPriceId,
        userEmail: user?.email || undefined,
        planName: tier.name,
      });
    } catch (err) {
      console.error('[Checkout Open Error]:', err);
    } finally {
      setCheckoutLoadingTier(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <SEO
        title="Pricing & Sovereign Plans — JurisTech Solutions"
        description="Choose the right sovereign legal AI tier. Localized pricing with Paddle Checkout."
      />

      <div className="max-w-7xl mx-auto">


        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Globe className="w-3.5 h-3.5" /> Localized Sovereign Pricing
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Simple, Transparent Plans for Every Team
          </h1>

          <p className="text-slate-400 text-base sm:text-lg">
            Empower your legal operations with 2026 sovereign AI intelligence.
            {countryCode ? ` Showing localized prices for country code [${countryCode}].` : ' Prices auto-localized to your region via IP.'}
          </p>

          {/* Billing Cycle Toggle */}
          <div className="mt-8 inline-flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              onClick={() => setBillingCycle('month')}
              className={`px-5 py-2.5 text-xs font-bold rounded-lg transition-all ${
                billingCycle === 'month'
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('year')}
              className={`px-5 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                billingCycle === 'year'
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Annual Billing</span>
              <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded text-[10px]">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* 3-Tier Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-16">
          {PRICING_TIERS.map((tier) => {
            const selectedPriceId = tier.priceId[billingCycle];
            const formattedTotal = pricePreviews[selectedPriceId];

            return (
              <div
                key={tier.name}
                className={`relative bg-slate-900/60 border rounded-2xl p-8 flex flex-col justify-between backdrop-blur-xl transition-all duration-300 hover:border-slate-700 ${
                  tier.highlight
                    ? 'border-cyan-500/50 shadow-2xl shadow-cyan-500/10 ring-1 ring-cyan-500/30'
                    : 'border-slate-800/80'
                }`}
              >
                {tier.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-cyan-500 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider rounded-full shadow-md">
                    {tier.badge}
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed mb-6 min-h-[36px]">
                    {tier.description}
                  </p>

                  {/* Price Display: Displays ONLY Paddle's returned formattedTotals */}
                  <div className="mb-6 pb-6 border-b border-slate-800/80">
                    <div className="flex items-baseline gap-1">
                      {isLoadingPrices ? (
                        <div className="flex items-center gap-2 text-slate-400 text-sm py-2">
                          <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                          <span>Fetching localized price...</span>
                        </div>
                      ) : formattedTotal ? (
                        <>
                          <span className="text-4xl font-extrabold text-white tracking-tight">
                            {formattedTotal}
                          </span>
                          <span className="text-slate-400 text-xs">
                            / {billingCycle === 'month' ? 'month' : 'year'}
                          </span>
                        </>
                      ) : (
                        <span className="text-slate-400 text-sm italic">
                          Contact Sales for Pricing
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Subscribe Button */}
                <div>
                  <button
                    onClick={() => handleSubscribe(tier)}
                    disabled={checkoutLoadingTier === tier.name}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                      tier.highlight
                        ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20'
                        : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                    }`}
                  >
                    {checkoutLoadingTier === tier.name ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Opening Paddle Checkout...</span>
                      </>
                    ) : (
                      <>
                        <span>Subscribe to {tier.name}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {user?.email && (
                    <p className="mt-2 text-[10px] text-slate-500 text-center truncate">
                      Prefilling: {user.email}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Security & Guarantee Note */}
        <div className="max-w-2xl mx-auto text-center border-t border-slate-800/80 pt-8 text-xs text-slate-400 flex items-center justify-center gap-6">
          <div className="flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>256-bit Encrypted Checkout</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Paddle Merchant of Record</span>
          </div>
        </div>
      </div>
    </div>
  );
}
