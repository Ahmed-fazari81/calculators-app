import React, { useState, useEffect } from 'react';
import { RotateCcw, Landmark, Clock, Percent, Info } from 'lucide-react';

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState<string>('');
  const [interestRate, setInterestRate] = useState<string>('');
  const [years, setYears] = useState<string>('');
  const [months, setMonths] = useState<string>('');

  const [result, setResult] = useState<{
    monthlyPayment: number;
    totalPayment: number;
    totalInterest: number;
  } | null>(null);

  const handleYearsChange = (val: string) => {
    setYears(val);
    const y = parseFloat(val);
    setMonths(!isNaN(y) ? (y * 12).toString() : '');
  };

  const handleMonthsChange = (val: string) => {
    setMonths(val);
    const m = parseFloat(val);
    setYears(!isNaN(m) ? (m / 12).toString() : '');
  };

  const calculateLoan = () => {
    const principal = parseFloat(loanAmount) || 0;
    const rate = parseFloat(interestRate) || 0;
    const termMonths = parseFloat(months) || 0;

    if (principal <= 0 || rate <= 0 || termMonths <= 0) {
      setResult(null);
      return;
    }

    // Standard amortized loan calculation
    const monthlyRate = rate / 100 / 12;
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1);
    const totalPayment = monthlyPayment * termMonths;
    const totalInterest = totalPayment - principal;

    setResult({
      monthlyPayment,
      totalPayment,
      totalInterest
    });
  };

  useEffect(() => {
    calculateLoan();
  }, [loanAmount, interestRate, months]);

  const reset = () => {
    setLoanAmount('');
    setInterestRate('');
    setYears('');
    setMonths('');
    setResult(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">حاسبة القروض البنكية</h2>
        <button 
          onClick={reset}
          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
          title="إعادة تعيين"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-indigo-50/50 p-5 rounded-xl border border-indigo-100 flex gap-3 text-sm text-indigo-800">
        <Info className="w-6 h-6 shrink-0 mt-0.5 text-indigo-600" />
        <div className="space-y-3 w-full">
          <p className="font-bold text-base">ملاحظات هامة حول القروض:</p>
          
          <div className="bg-white/60 p-3 rounded-lg border border-indigo-100/50">
            <p className="font-semibold text-indigo-900 mb-1">1. لماذا يختلف القسط الفعلي عن الحاسبة؟</p>
            <p className="leading-relaxed mb-2">
              <strong>مثال واقعي:</strong> إذا اقترضت 33,000 ر.ع لمدة 10 سنوات بنسبة فائدة 5%، فإن القسط الحسابي الأساسي هو <strong>350 ر.ع</strong> تقريباً. لكنك قد تجد أن البنك يطلب قسطاً أعلى بكثير!
            </p>
            <p className="font-medium mb-1">أسباب هذه الزيادة:</p>
            <ul className="list-disc list-inside space-y-1 text-indigo-700 pr-2">
              <li>إضافة <strong>رسوم التأمين على الحياة</strong> (والتي قد تصل لآلاف الريالات وتضاف لأصل القرض).</li>
              <li>إضافة رسوم التأمين على الممتلكات والرسوم الإدارية.</li>
              <li>طريقة حساب الفائدة (مركبة شهرياً) على المبلغ الإجمالي الجديد (القرض + التأمين).</li>
            </ul>
          </div>

          <div className="bg-indigo-100/50 p-3 rounded-lg border border-indigo-200/50">
            <p className="font-semibold text-indigo-900 mb-1">2. القاعدة الذهبية (تأثير مدة القرض):</p>
            <p className="leading-relaxed mb-2">
              كلما زادت مدة القرض (السنوات)، قلّ القسط الشهري ولكن <strong>تضاعفت أرباح البنك (الفوائد)</strong>.
            </p>
            <p className="font-medium mb-1">مثال مقارنة (لقرض 33,000 ر.ع بنسبة 5%):</p>
            <ul className="list-disc list-inside space-y-1 text-indigo-800 pr-2">
              <li><strong>على 5 سنوات:</strong> القسط 622 ر.ع ⟵ (أرباح البنك = <strong>4,365 ر.ع</strong>)</li>
              <li><strong>على 10 سنوات:</strong> القسط 350 ر.ع ⟵ (أرباح البنك = <strong>9,001 ر.ع</strong>)</li>
            </ul>
            <p className="mt-2 text-xs font-bold text-rose-600 bg-rose-50 p-2 rounded inline-block">
              الخلاصة: في الـ 10 سنوات، أنت تدفع قسطاً أريح، لكنك تدفع للبنك أكثر من ضعف الفوائد!
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">مبلغ التمويل (الأساسي)</label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Landmark className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="number"
                min="0"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                className="block w-full pl-12 pr-10 py-3 text-base border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-xl border bg-slate-50"
                placeholder="مثال: 33000"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-slate-500 sm:text-sm">ر.ع.</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">نسبة الفائدة / الربح السنوية</label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Percent className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="number"
                min="0"
                step="0.01"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="block w-full pl-3 pr-10 py-3 text-base border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-xl border bg-slate-50"
                placeholder="مثال: 5.05"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:col-span-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">المدة (بالسنوات)</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Clock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={years}
                  onChange={(e) => handleYearsChange(e.target.value)}
                  className="block w-full pl-3 pr-9 py-3 text-base border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-xl border bg-slate-50"
                  placeholder="سنوات"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">المدة (بالشهور)</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Clock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={months}
                  onChange={(e) => handleMonthsChange(e.target.value)}
                  className="block w-full pl-3 pr-9 py-3 text-base border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-xl border bg-slate-50"
                  placeholder="شهور"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {result && (
        <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
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
            <div className="text-center mb-6">
              <p className="text-indigo-200 font-medium mb-1">القسط الشهري المتوقع</p>
              <div className="text-4xl md:text-5xl font-bold">
                {result.monthlyPayment.toFixed(3)} <span className="text-xl font-normal opacity-80">ر.ع.</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-indigo-500/50 pt-6">
              <div className="text-center">
                <p className="text-indigo-200 text-sm mb-1">إجمالي الفوائد / الأرباح</p>
                <p className="font-semibold text-lg">{result.totalInterest.toFixed(3)} ر.ع.</p>
              </div>
              <div className="text-center">
                <p className="text-indigo-200 text-sm mb-1">المبلغ الإجمالي للسداد</p>
                <p className="font-semibold text-lg">{result.totalPayment.toFixed(3)} ر.ع.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
