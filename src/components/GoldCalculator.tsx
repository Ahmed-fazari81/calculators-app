import React, { useState } from 'react';
import { RotateCcw, Coins, Scale, HandCoins } from 'lucide-react';

// أسعار تقريبية للذهب بالريال العماني (يمكن تحديثها لاحقاً بربطها بـ API)
const GOLD_PRICES: Record<string, number> = {
  '24': 31.50,
  '22': 28.90,
  '21': 27.60,
  '18': 23.60,
};

export default function GoldCalculator() {
  const [karat, setKarat] = useState<string>('21');
  const [weight, setWeight] = useState<string>('');
  const [makingCharge, setMakingCharge] = useState<string>('');

  const reset = () => {
    setKarat('21');
    setWeight('');
    setMakingCharge('');
  };

  const parsedWeight = parseFloat(weight) || 0;
  const parsedMakingCharge = parseFloat(makingCharge) || 0;
  
  const pureGoldPrice = parsedWeight * GOLD_PRICES[karat];
  const totalMakingCharge = parsedWeight * parsedMakingCharge;
  const finalTotalPrice = pureGoldPrice + totalMakingCharge;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">حاسبة الذهب</h2>
        <button 
          onClick={reset}
          className="p-2 text-slate-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-full transition-colors"
          title="إعادة تعيين"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* أسعار الذهب اليوم */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-yellow-400 flex items-center gap-2">
          <Coins className="w-5 h-5" />
          متوسط أسعار الذهب اليوم (للجرام)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.entries(GOLD_PRICES).reverse().map(([k, price]) => (
            <div key={k} className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm border border-white/5">
              <div className="text-slate-300 text-sm mb-1">عيار {k}</div>
              <div className="font-bold text-lg text-yellow-400">{price.toFixed(2)} <span className="text-xs font-normal text-slate-300">ر.ع</span></div>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-4 text-center">الأسعار تقريبية وقد تختلف قليلاً حسب السوق المحلي</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* العيار */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">عيار الذهب</label>
            <select
              value={karat}
              onChange={(e) => setKarat(e.target.value)}
              className="block w-full p-4 text-base border-slate-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 rounded-xl border bg-slate-50 transition-all"
            >
              <option value="24">عيار 24</option>
              <option value="22">عيار 22</option>
              <option value="21">عيار 21</option>
              <option value="18">عيار 18</option>
            </select>
          </div>

          {/* الوزن */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">الوزن (بالجرام)</label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <Scale className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="number"
                min="0"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="block w-full pr-12 pl-4 py-4 text-lg font-bold border-slate-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 rounded-xl border bg-slate-50 transition-all"
                placeholder="مثال: 50"
              />
            </div>
          </div>

          {/* المصنعية */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">المصنعية للجرام (ر.ع)</label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <HandCoins className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="number"
                min="0"
                value={makingCharge}
                onChange={(e) => setMakingCharge(e.target.value)}
                className="block w-full pr-12 pl-4 py-4 text-lg font-bold border-slate-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 rounded-xl border bg-slate-50 transition-all"
                placeholder="مثال: 2.5"
              />
            </div>
          </div>
        </div>
      </div>

      {/* النتيجة */}
      {parsedWeight > 0 && (
        <div className="bg-gradient-to-br from-yellow-500 to-amber-600 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
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
          
          <div className="relative z-10">
            <p className="text-center text-yellow-100 font-medium mb-4">التكلفة الإجمالية للذهب</p>
            <div className="text-4xl md:text-5xl font-bold text-center mb-6">
              {finalTotalPrice.toFixed(2)} <span className="text-2xl font-normal opacity-90">ر.ع</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center border-t border-yellow-400/30 pt-4">
              <div>
                <span className="block text-yellow-100 text-sm mb-1">قيمة الذهب الصافي</span>
                <span className="font-bold text-xl">{pureGoldPrice.toFixed(2)} ر.ع</span>
              </div>
              <div>
                <span className="block text-yellow-100 text-sm mb-1">إجمالي المصنعية</span>
                <span className="font-bold text-xl">{totalMakingCharge.toFixed(2)} ر.ع</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
