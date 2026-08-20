import React, { useState, useEffect } from 'react';
import { RotateCcw, Percent, Tag, Calculator } from 'lucide-react';

export default function DiscountCalculator() {
  const [originalPrice, setOriginalPrice] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<string>('');
  const [priceAfterDiscount, setPriceAfterDiscount] = useState<string>('');
  const [savedAmount, setSavedAmount] = useState<number | null>(null);

  // Handle changes to original price or discount percent
  const handleOriginalOrDiscountChange = (orig: string, disc: string) => {
    setOriginalPrice(orig);
    setDiscountPercent(disc);

    const o = parseFloat(orig);
    const d = parseFloat(disc);

    if (!isNaN(o) && !isNaN(d) && d >= 0 && d <= 100) {
      const finalPrice = o - (o * (d / 100));
      setPriceAfterDiscount(finalPrice.toFixed(3));
      setSavedAmount(o - finalPrice);
    } else {
      if (orig === '' || disc === '') {
        setPriceAfterDiscount('');
        setSavedAmount(null);
      }
    }
  };

  // Handle changes to price after discount
  const handleFinalPriceChange = (final: string, disc: string) => {
    setPriceAfterDiscount(final);
    setDiscountPercent(disc);

    const f = parseFloat(final);
    const d = parseFloat(disc);

    if (!isNaN(f) && !isNaN(d) && d >= 0 && d < 100) {
      // final = original - (original * d/100)
      // final = original * (1 - d/100)
      // original = final / (1 - d/100)
      const orig = f / (1 - (d / 100));
      setOriginalPrice(orig.toFixed(3));
      setSavedAmount(orig - f);
    } else {
      if (final === '' || disc === '') {
        setOriginalPrice('');
        setSavedAmount(null);
      }
    }
  };

  const reset = () => {
    setOriginalPrice('');
    setDiscountPercent('');
    setPriceAfterDiscount('');
    setSavedAmount(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">حاسبة التخفيضات</h2>
        <button
          onClick={reset}
          className="p-2 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-full transition-colors"
          title="إعادة تعيين"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-4">

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">السعر الأصلي (قبل الخصم)</label>
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Tag className="h-5 w-5 text-slate-400 dark:text-slate-500" />
            </div>
            <input
              type="number"
              min="0"
              step="0.001"
              value={originalPrice}
              onChange={(e) => handleOriginalOrDiscountChange(e.target.value, discountPercent)}
              className="block w-full pl-12 pr-10 py-3 text-base border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 sm:text-sm rounded-xl border bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 transition-all"
              placeholder="مثال: 100"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-slate-500 dark:text-slate-400 sm:text-sm">ر.ع.</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">نسبة الخصم (%)</label>
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Percent className="h-5 w-5 text-slate-400 dark:text-slate-500" />
            </div>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={discountPercent}
              onChange={(e) => {
                // If we have original price, calculate final. If we have final, calculate original.
                // Prioritize original -> final if both exist.
                if (originalPrice) {
                  handleOriginalOrDiscountChange(originalPrice, e.target.value);
                } else if (priceAfterDiscount) {
                  handleFinalPriceChange(priceAfterDiscount, e.target.value);
                } else {
                  setDiscountPercent(e.target.value);
                }
              }}
              className="block w-full pl-3 pr-10 py-3 text-base border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 sm:text-sm rounded-xl border bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 transition-all"
              placeholder="مثال: 20"
            />
          </div>
        </div>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-slate-200 dark:border-slate-700" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white dark:bg-slate-800 px-2 text-sm text-slate-500 dark:text-slate-400">أو أدخل السعر بعد الخصم لمعرفة السعر الأصلي</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">السعر بعد الخصم</label>
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Calculator className="h-5 w-5 text-slate-400 dark:text-slate-500" />
            </div>
            <input
              type="number"
              min="0"
              step="0.001"
              value={priceAfterDiscount}
              onChange={(e) => handleFinalPriceChange(e.target.value, discountPercent)}
              className="block w-full pl-12 pr-10 py-3 text-base border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 sm:text-sm rounded-xl border bg-rose-50/50 dark:bg-rose-900/20 transition-all font-bold text-rose-700 dark:text-rose-400"
              placeholder="مثال: 80"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-slate-500 dark:text-slate-400 sm:text-sm">ر.ع.</span>
            </div>
          </div>
        </div>

      </div>

      {savedAmount !== null && savedAmount > 0 && (
        <div className="bg-rose-50 dark:bg-rose-900/30 p-4 rounded-2xl border border-rose-100 dark:border-rose-800/50 flex items-center justify-between mt-4">
          <div>
            <p className="text-sm font-medium text-rose-800 dark:text-rose-300">الفرق بين السعر الأصلي والسعر بعد الخصم (قيمة التوفير)</p>
            <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">{savedAmount.toFixed(3)} <span className="text-sm font-normal">ر.ع.</span></p>
          </div>
          <div className="h-12 w-12 bg-rose-100 dark:bg-rose-900/40 rounded-full flex items-center justify-center shrink-0 mr-4">
            <Tag className="h-6 w-6 text-rose-600 dark:text-rose-400" />
          </div>
        </div>
      )}
    </div>
  );
}
