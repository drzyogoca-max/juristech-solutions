import React, { useState } from 'react';
import { trackBinancePayEvent } from '../lib/marketingTracker';

export interface BinancePayBoxProps {
  showTonWallet?: boolean;
}

export const BinancePayBox: React.FC<BinancePayBoxProps> = ({ showTonWallet = true }) => {
  const [copiedUid, setCopiedUid] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedTon, setCopiedTon] = useState(false);

  const binanceUid = '557019549';
  const merchantEmail = 'Drzyogo.ca@gmail.com';
  const tonAddress = 'UQDK_1mcebs5K2RYB0hD7rFdMY02oAC2CbK2aDWhiWuLJ0H9';

  const copyToClipboard = (text: string, type: 'uid' | 'email' | 'ton') => {
    navigator.clipboard.writeText(text);
    if (type === 'uid') {
      setCopiedUid(true);
      trackBinancePayEvent('qr_scanned', { target: 'uid', value: binanceUid });
      setTimeout(() => setCopiedUid(false), 2500);
    } else if (type === 'email') {
      setCopiedEmail(true);
      trackBinancePayEvent('qr_scanned', { target: 'email', value: merchantEmail });
      setTimeout(() => setCopiedEmail(false), 2500);
    } else {
      setCopiedTon(true);
      trackBinancePayEvent('qr_scanned', { target: 'ton', value: tonAddress });
      setTimeout(() => setCopiedTon(false), 2500);
    }
  };

  return (
    <div className="binance-pay-wrapper space-y-4 my-6 font-sans">
      {/* 1. Official Binance Pay Box (User HTML Compliant) */}
      <div
        className="binance-pay-box"
        style={{
          border: '2px solid #f0b90b',
          padding: '20px',
          borderRadius: '12px',
          background: '#fafafa',
          margin: '20px 0',
          fontFamily: 'sans-serif',
          color: '#1e2329',
        }}
      >
        <h3 style={{ color: '#1e2329', marginBottom: '10px', fontSize: '18px', fontWeight: 'bold' }}>
          💳 الدفع الفوري عبر Binance Pay
        </h3>
        <p style={{ color: '#474d57', fontSize: '14px', lineHeight: '1.6' }}>
          أتمم اشتراكك أو عقدك القانوني بسهولة وبدون أي رسوم إضافية عبر تحويل المبلغ إلى حسابنا الرسمي في بايننس:
        </p>
        <ul style={{ listStyle: 'none', padding: 0, margin: '15px 0' }}>
          <li style={{ padding: '8px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>
              <strong>حساب بايننس (Binance Email):</strong>{' '}
              <code style={{ background: '#eee', padding: '2px 6px', borderRadius: '4px', color: '#1e2329', fontWeight: 'bold' }}>
                {merchantEmail}
              </code>
            </span>
            <button
              type="button"
              onClick={() => copyToClipboard(merchantEmail, 'email')}
              style={{
                background: '#f0b90b',
                color: '#000',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
            >
              {copiedEmail ? 'تم النسخ!' : 'نسخ الإيميل'}
            </button>
          </li>
        </ul>
        <span style={{ fontSize: '12px', color: '#848e9c', display: 'block' }}>
          * سيتم تفعيل اشتراكك تلقائياً وفوراً بمجرد تأكيد عملية التحويل.
        </span>
      </div>

      {/* 2. TON DeFi Wallet Box (TON / Gram Network) */}
      {showTonWallet && (
        <div
          className="ton-pay-box"
          style={{
            border: '2px solid #0088cc',
            padding: '20px',
            borderRadius: '12px',
            background: '#f0f9ff',
            margin: '20px 0',
            fontFamily: 'sans-serif',
            color: '#0f172a',
          }}
        >
          <h3 style={{ color: '#0088cc', marginBottom: '10px', fontSize: '18px', fontWeight: 'bold' }}>
            💎 الدفع عبر شبكة TON / Gram (DeFi Wallet)
          </h3>
          <p style={{ color: '#334155', fontSize: '14px', lineHeight: '1.6' }}>
            أرسل Gram (GRAM) والرموز المميزة لشبكة TON إلى عنوان محفظة DeFi المباشرة:
          </p>
          <div style={{ marginTop: '12px', padding: '12px', background: '#ffffff', borderRadius: '8px', border: '1px solid #bae6fd' }}>
            <span style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '4px' }}>
              عنوان TON الخاص بك (Toncoin / Gram):
            </span>
            <code style={{ fontSize: '12px', wordBreak: 'break-all', fontWeight: 'bold', color: '#0369a1', display: 'block', marginBottom: '10px' }}>
              {tonAddress}
            </code>
            <button
              type="button"
              onClick={() => copyToClipboard(tonAddress, 'ton')}
              style={{
                background: '#0088cc',
                color: '#fff',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold',
                width: '100%',
              }}
            >
              {copiedTon ? 'تم نسخ عنوان TON بنجاح!' : 'نسخ عنوان TON'}
            </button>
          </div>
        </div>
      )}

      {/* 3. Direct Bank Wire Transfer Box (Al Baraka Bank Official) */}
      <div
        className="bank-pay-box"
        style={{
          border: '2px solid #059669',
          padding: '20px',
          borderRadius: '12px',
          background: '#f0fdf4',
          margin: '20px 0',
          fontFamily: 'sans-serif',
          color: '#065f46',
        }}
      >
        <h3 style={{ color: '#059669', marginBottom: '10px', fontSize: '18px', fontWeight: 'bold' }}>
          🏦 التحويل البنكي المباشر (بنك البركة - Al Baraka Bank)
        </h3>
        <p style={{ color: '#047857', fontSize: '14px', lineHeight: '1.6' }}>
          يمكنك التحويل البنكي المباشر وحسابات الشركات عبر تفاصيل بنك البركة الرسمي التالي:
        </p>
        <ul style={{ listStyle: 'none', padding: 0, margin: '15px 0' }}>
          <li style={{ padding: '8px 0', borderBottom: '1px solid #d1fae5' }}>
            <strong>اسم المستفيد:</strong> MHAMMAD MUSTAFA MHAMMAD
          </li>
          <li style={{ padding: '8px 0', borderBottom: '1px solid #d1fae5' }}>
            <strong>رقم الـ IBAN:</strong> <code style={{ background: '#ecfdf5', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>EG310022012880211102491757001</code>
          </li>
          <li style={{ padding: '8px 0' }}>
            <strong>رمز الـ SWIFT:</strong> <code style={{ background: '#ecfdf5', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>ABRKEGCAXXX</code>
          </li>
        </ul>
      </div>
    </div>
  );
};


export default BinancePayBox;
