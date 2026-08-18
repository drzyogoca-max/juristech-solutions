/**
 * src/lib/contracts/globalMatrix.ts & /lib/contracts/global-matrix.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Global Sovereign Currencies & International Arbitration Venues Matrix
 */

export interface CurrencyItem {
  code: string;
  name: string;
  symbol: string;
  region: string;
}

export interface ArbitrationVenueItem {
  id: string;
  name: string;
}

export const GLOBAL_CURRENCIES: CurrencyItem[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', region: 'Global' },
  { code: 'EUR', name: 'Euro', symbol: '€', region: 'European Union' },
  { code: 'GBP', name: 'British Pound', symbol: '£', region: 'United Kingdom' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'AED', region: 'UAE' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: 'SAR', region: 'Saudi Arabia' },
  { code: 'QAR', name: 'Qatari Riyal', symbol: 'QAR', region: 'Qatar' },
  { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'KWD', region: 'Kuwait' },
  { code: 'BHD', name: 'Bahraini Dinar', symbol: 'BHD', region: 'Bahrain' },
  { code: 'OMR', name: 'Omani Rial', symbol: 'OMR', region: 'Oman' },
  { code: 'JOD', name: 'Jordanian Dinar', symbol: 'JOD', region: 'Jordan' },
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'EGP', region: 'Egypt' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', region: 'Japan' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', region: 'Canada' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', region: 'Australia' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', region: 'Switzerland' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: 'CN¥', region: 'China' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', region: 'India' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', region: 'Singapore' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', region: 'Hong Kong' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', region: 'Sweden' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', region: 'New Zealand' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', region: 'South Korea' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', region: 'Brazil' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', region: 'South Africa' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', region: 'Turkey' },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'Mex$', region: 'Mexico' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', region: 'Indonesia' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', region: 'Malaysia' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱', region: 'Philippines' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', region: 'Thailand' },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', region: 'Poland' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', region: 'Denmark' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', region: 'Norway' },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', region: 'Czech Republic' },
  { code: 'ILS', name: 'Israeli New Shekel', symbol: '₪', region: 'Israel' },
  { code: 'CLP', name: 'Chilean Peso', symbol: 'CLP$', region: 'Chile' },
  { code: 'COP', name: 'Colombian Peso', symbol: 'COL$', region: 'Colombia' },
  { code: 'BTC', name: 'Bitcoin (Crypto Asset)', symbol: '₿', region: 'Decentralized' },
  { code: 'ETH', name: 'Ethereum (Crypto Asset)', symbol: 'Ξ', region: 'Decentralized' },
  { code: 'USDT', name: 'Tether USD (Stablecoin)', symbol: 'USDT', region: 'Decentralized' }
];

export const ARBITRATION_VENUES: ArbitrationVenueItem[] = [
  { id: 'LCIA', name: 'محكمة لندن للتحكيم الدولي (LCIA - London)' },
  { id: 'ICC', name: 'غرفة التجارة الدولية (ICC - Paris)' },
  { id: 'DIAC', name: 'مركز دبي للتحكيم الدولي (DIAC - Dubai)' },
  { id: 'SIAC', name: 'مركز سنغافورة للتحكيم الدولي (SIAC - Singapore)' },
  { id: 'SCCA', name: 'مركز التحكيم التجاري السعودي (SCCA - Riyadh)' },
  { id: 'ADGM', name: 'محاكم سوق أبوظبي العالمي (ADGM - Abu Dhabi)' }
];
