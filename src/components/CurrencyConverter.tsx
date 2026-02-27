import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, RefreshCw, DollarSign, RotateCcw } from 'lucide-react';

const CURRENCIES = [
  { code: 'OMR', name: 'ريال عماني', flag: '🇴🇲' },
  { code: 'AED', name: 'درهم إماراتي', flag: '🇦🇪' },
  { code: 'SAR', name: 'ريال سعودي', flag: '🇸🇦' },
  { code: 'QAR', name: 'ريال قطري', flag: '🇶🇦' },
  { code: 'KWD', name: 'دينار كويتي', flag: '🇰🇼' },
  { code: 'BHD', name: 'دينار بحريني', flag: '🇧🇭' },
  { code: 'USD', name: 'دولار أمريكي', flag: '🇺🇸' },
  { code: 'EUR', name: 'يورو', flag: '🇪🇺' },
  { code: 'GBP', name: 'جنيه إسترليني', flag: '🇬🇧' },
  { code: 'EGP', name: 'جنيه مصري', flag: '🇪🇬' },
  { code: 'JOD', name: 'دينار أردني', flag: '🇯🇴' },
];

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<string>('1');
  const [fromCurrency, setFromCurrency] = useState('OMR');
  const [toCurrency, setToCurrency] = useState('AED');
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');

  const fetchRates = async () => {
    setLoading(true);
    setError(false);
    try {
      // Using a free, reliable public API for exchange rates
      const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      setRates(data.rates);
      setLastUpdated(new Date().toLocaleTimeString('ar-OM', { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.error("Failed to fetch rates", err);
      setError(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRates();
  }, [fromCurrency]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const reset = () => {
    setAmount('1');
    setFromCurrency('OMR');
    setToCurrency('AED');
  };

  const convertedAmount = rates[toCurrency] 
    ? (parseFloat(amount || '0') * rates[toCurrency]).toFixed(3) 
    : '0.000';

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">محول العملات</h2>
        <div className="flex gap-2">
          <button 
            onClick={reset}
            className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-full transition-colors"
            title="إعادة تعيين"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button 
            onClick={fetchRates}
            disabled={loading}
            className={`p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-full transition-all ${loading ? 'animate-spin text-amber-500' : ''}`}
            title="تحديث الأسعار"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6 relative">
        
        {error && (
          <div className="bg-rose-50 text-rose-600 p-3 rounded-xl text-sm text-center border border-rose-100">
            تعذر جلب أسعار الصرف الحالية. يرجى التحقق من اتصالك بالإنترنت.
          </div>
        )}

        <div className="space-y-4">
          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">المبلغ</label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="number"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="block w-full pl-3 pr-10 py-4 text-lg font-bold border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 rounded-xl border bg-slate-50 transition-all"
                placeholder="أدخل المبلغ"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* From Currency */}
            <div className="w-full">
              <label className="block text-sm font-medium text-slate-700 mb-2">من</label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="block w-full p-3 text-base border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 rounded-xl border bg-slate-50 transition-all"
              >
                {CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <div className="pt-6">
              <button
                onClick={handleSwap}
                className="p-3 bg-amber-100 text-amber-600 hover:bg-amber-200 rounded-full transition-colors shadow-sm"
              >
                <ArrowRightLeft className="w-5 h-5" />
              </button>
            </div>

            {/* To Currency */}
            <div className="w-full">
              <label className="block text-sm font-medium text-slate-700 mb-2">إلى</label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="block w-full p-3 text-base border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 rounded-xl border bg-slate-50 transition-all"
              >
                {CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

      </div>

      {/* Result Card */}
      <div className="bg-gradient-to-br from-amber-500 to-orange-500 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="relative z-10 text-center">
          <p className="text-amber-100 font-medium mb-2">النتيجة</p>
          <div className="text-4xl md:text-5xl font-bold flex items-center justify-center gap-2 flex-wrap">
            <span>{loading ? '...' : convertedAmount}</span>
            <span className="text-2xl font-normal opacity-90">{toCurrency}</span>
          </div>
          
          {rates[toCurrency] && !loading && (
            <div className="mt-6 pt-4 border-t border-amber-400/30 text-sm text-amber-100">
              <p>سعر الصرف: 1 {fromCurrency} = {rates[toCurrency]} {toCurrency}</p>
              <p className="text-xs mt-1 opacity-75">آخر تحديث للأسعار: {lastUpdated}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
