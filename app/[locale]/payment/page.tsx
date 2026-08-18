'use client';

import { useTranslations } from 'next-intl';
import { DollarSign, Shield, Zap } from 'lucide-react';

export default function PaymentPage() {
  const t = useTranslations('Payment');
  const paypalUsername = process.env.NEXT_PUBLIC_PAYPAL_USERNAME || 'MhammadMustafaMhammad';

  const plans = [
    {
      name: 'Pro',
      price: 49.99,
      description: t('proDesc'),
      features: ['AI Chat', 'Contract Generator', 'Risk Analyzer'],
    },
    {
      name: 'Enterprise',
      price: 499.99,
      description: t('enterpriseDesc'),
      features: ['Everything in Pro', 'Team Accounts', 'API Access'],
    },
  ];

  return (
    <main className="p-8 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
        <p className="text-slate-400 mb-6">{t('subtitle')}</p>

        {/* Binance Pay Box (Official HTML UI) */}
        <div className="binance-pay-box" style={{ border: '2px solid #f0b90b', padding: '20px', borderRadius: '12px', background: '#fafafa', margin: '20px 0', fontFamily: 'sans-serif', color: '#1e2329' }}>
          <h3 style={{ color: '#1e2329', marginBottom: '10px', fontSize: '18px', fontWeight: 'bold' }}>💳 الدفع الفوري عبر Binance Pay</h3>
          <p style={{ color: '#474d57', fontSize: '14px' }}>أتمم اشتراكك أو عقدك القانوني بسهولة وبدون أي رسوم إضافية عبر تحويل المبلغ إلى حسابنا الرسمي في بايننس:</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: '15px 0' }}>
            <li style={{ padding: '8px 0' }}><strong>حساب بايننس (Binance Email):</strong> <code style={{ background: '#eee', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>Drzyogo.ca@gmail.com</code></li>
          </ul>
          <span style={{ fontSize: '12px', color: '#848e9c', display: 'block' }}>* سيتم تفعيل اشتراكك تلقائياً وفوراً بمجرد تأكيد عملية التحويل.</span>
        </div>

        {/* TON DeFi Wallet Box */}
        <div className="ton-pay-box" style={{ border: '2px solid #0088cc', padding: '20px', borderRadius: '12px', background: '#f0f9ff', margin: '20px 0', fontFamily: 'sans-serif', color: '#0f172a' }}>
          <h3 style={{ color: '#0088cc', marginBottom: '10px', fontSize: '18px', fontWeight: 'bold' }}>💎 الدفع عبر شبكة TON / Gram (DeFi Wallet)</h3>
          <p style={{ color: '#334155', fontSize: '14px' }}>أرسل Gram (GRAM) والرموز المميزة لشبكة TON إلى عنوان المحفظة المباشرة:</p>
          <div style={{ marginTop: '10px', padding: '10px', background: '#fff', borderRadius: '8px', border: '1px solid #bae6fd' }}>
            <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>عنوان TON الخاص بك:</span>
            <code style={{ fontSize: '12px', wordBreak: 'break-all', fontWeight: 'bold', color: '#0369a1' }}>UQDK_1mcebs5K2RYB0hD7rFdMY02oAC2CbK2aDWhiWuLJ0H9</code>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {plans.map((plan) => (
            <div key={plan.name} className="bg-slate-900 rounded-2xl p-8 border border-slate-800 hover:border-cyan-500/50 transition-all">
              <div className="flex items-center gap-3 mb-4">
                {plan.name === 'Pro' ? <Zap className="w-6 h-6 text-cyan-400" /> : <Shield className="w-6 h-6 text-amber-400" />}
                <h2 className="text-2xl font-bold">{plan.name}</h2>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-extrabold">${plan.price}</span>
                <span className="text-slate-400 ml-2">/ month</span>
              </div>
              <p className="text-slate-400 mb-4">{plan.description}</p>
              <ul className="space-y-2 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <span className="text-emerald-400">✓</span> {feature}
                  </li>
                ))}
              </ul>
              <a
                href={`https://paypal.me/${paypalUsername}/${plan.price}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block text-center py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90 transition-all font-bold text-white"
              >
                <DollarSign className="inline w-4 h-4 mr-2" />
                {t('payWithPayPal')}
              </a>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-slate-900 rounded-xl border border-slate-800 text-center">
          <p className="text-sm text-slate-400">
            {t('secureNote')}
          </p>
        </div>
      </div>
    </main>
  );
}
