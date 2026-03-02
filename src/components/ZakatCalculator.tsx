import React, { useState } from 'react';
import { RotateCcw, HeartHandshake, Info } from 'lucide-react';

// نصاب الزكاة يعادل 85 جرام من الذهب عيار 24
// بناءً على سعر 31.50 للجرام، النصاب التقريبي هو 2677.5 ريال عماني
const NISAB_OMR = 2677.5;
const ZAKAT_RATE = 0.025; // 2.5%

export default function ZakatCalculator() {
  const [wealth, setWealth] = useState<string>('');

  const reset = () => {
    setWealth('');
  };

  const parsedWealth = parseFloat(wealth) || 0;
  const isEligible = parsedWealth >= NISAB_OMR;
  const zakatAmount = isEligible ? parsedWealth * ZAKAT_RATE : 0;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">حاسبة الزكاة</h2>
        <button 
          onClick={reset}
          className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-full transition-colors"
          title="إعادة تعيين"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* معلومات النصاب */}
      <div className="bg-teal-50 border border-teal-100 rounded-2xl p-5 flex gap-4 items-start">
        <div className="bg-teal-100 p-2 rounded-full shrink-0 mt-1">
          <Info className="w-5 h-5 text-teal-600" />
        </div>
        <div>
          <h3 className="font-bold text-teal-800 mb-1">نصاب زكاة المال (لهذا العام)</h3>
          <p className="text-teal-700 text-sm leading-relaxed">
            تجب الزكاة في المال إذا بلغ النصاب وحال عليه الحول (مرور سنة هجرية كاملة). 
            نصاب المال يقدر بقيمة 85 جراماً من الذهب عيار 24، وهو يعادل حالياً حوالي <span className="font-bold">{NISAB_OMR.toLocaleString()} ريال عماني</span>.
            مقدار الزكاة الواجب إخراجها هو ربع العشر (2.5%).
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <label className="block text-sm font-medium text-slate-700 mb-2">إجمالي رأس المال والمدخرات (بالريال العماني)</label>
        <div className="relative">
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <HeartHandshake className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="number"
            min="0"
            value={wealth}
            onChange={(e) => setWealth(e.target.value)}
            className="block w-full pr-12 pl-4 py-4 text-xl font-bold border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 rounded-xl border bg-slate-50 transition-all"
            placeholder="أدخل إجمالي أموالك هنا..."
          />
        </div>
      </div>

      {/* النتيجة */}
      {parsedWealth > 0 && (
        <div className={`p-6 rounded-2xl shadow-lg relative overflow-hidden transition-colors duration-500 ${isEligible ? 'bg-gradient-to-br from-teal-500 to-emerald-600 text-white' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
          {isEligible && (
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
          )}
          
          <div className="relative z-10 text-center">
            {isEligible ? (
              <>
                <p className="text-teal-100 font-medium mb-4">مقدار الزكاة الواجب إخراجها</p>
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {zakatAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-2xl font-normal opacity-90">ر.ع</span>
                </div>
                <p className="text-sm text-teal-100 mt-4 bg-white/10 inline-block px-4 py-2 rounded-full backdrop-blur-sm">
                  تم حساب 2.5% من إجمالي المبلغ ({parsedWealth.toLocaleString()} ر.ع)
                </p>
              </>
            ) : (
              <div className="py-4">
                <div className="bg-slate-200/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HeartHandshake className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">لم يبلغ النصاب</h3>
                <p className="text-slate-500">
                  المبلغ المدخل ({parsedWealth.toLocaleString()} ر.ع) أقل من حد النصاب الموجب للزكاة ({NISAB_OMR.toLocaleString()} ر.ع). لا تجب فيه الزكاة.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
