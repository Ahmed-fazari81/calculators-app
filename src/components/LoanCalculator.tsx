import React, { useState, useEffect } from 'react';
import { RotateCcw, Landmark, Clock, Percent, Info, Plus, Minus } from 'lucide-react';

type Method = 'reducing' | 'flat';

interface ScheduleRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

interface LoanResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  schedule: ScheduleRow[];
}

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState<string>('');
  const [interestRate, setInterestRate] = useState<string>('');
  const [years, setYears] = useState<string>('');
  const [months, setMonths] = useState<string>('');
  const [method, setMethod] = useState<Method>('reducing');
  const [showSchedule, setShowSchedule] = useState(false);

  const [result, setResult] = useState<LoanResult | null>(null);

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

    if (principal <= 0 || rate < 0 || termMonths <= 0) {
      setResult(null);
      return;
    }

    const monthlyRate = rate / 100 / 12;
    const schedule: ScheduleRow[] = [];
    let monthlyPayment: number;
    let totalPayment: number;
    let totalInterest: number;

    if (method === 'flat') {
      // Fixed installment: interest is calculated once on the original principal for the whole term
      totalInterest = principal * (rate / 100) * (termMonths / 12);
      totalPayment = principal + totalInterest;
      monthlyPayment = totalPayment / termMonths;

      const monthlyPrincipal = principal / termMonths;
      const monthlyInterest = totalInterest / termMonths;
      let balance = principal;
      for (let m = 1; m <= termMonths; m++) {
        balance -= monthlyPrincipal;
        schedule.push({
          month: m,
          payment: monthlyPayment,
          principal: monthlyPrincipal,
          interest: monthlyInterest,
          balance: Math.max(balance, 0),
        });
      }
    } else {
      // Declining/reducing balance: interest is recalculated each month on the remaining balance
      if (rate === 0) {
        monthlyPayment = principal / termMonths;
      } else {
        monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1);
      }

      let balance = principal;
      for (let m = 1; m <= termMonths; m++) {
        const interestPortion = balance * monthlyRate;
        const principalPortion = monthlyPayment - interestPortion;
        balance -= principalPortion;
        schedule.push({
          month: m,
          payment: monthlyPayment,
          principal: principalPortion,
          interest: interestPortion,
          balance: Math.max(balance, 0),
        });
      }

      totalPayment = monthlyPayment * termMonths;
      totalInterest = totalPayment - principal;
    }

    setResult({ monthlyPayment, totalPayment, totalInterest, schedule });
  };

  useEffect(() => {
    calculateLoan();
  }, [loanAmount, interestRate, months, method]);

  const reset = () => {
    setLoanAmount('');
    setInterestRate('');
    setYears('');
    setMonths('');
    setResult(null);
    setShowSchedule(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">حاسبة القروض البنكية</h2>
        <button
          onClick={reset}
          className="p-2 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-full transition-colors"
          title="إعادة تعيين"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-indigo-50/50 dark:bg-indigo-950/30 p-5 rounded-xl border border-indigo-100 dark:border-indigo-900/50 flex gap-3 text-sm text-indigo-800 dark:text-indigo-300">
        <Info className="w-6 h-6 shrink-0 mt-0.5 text-indigo-600 dark:text-indigo-400" />
        <div className="w-full divide-y divide-indigo-200/60 dark:divide-indigo-800/40">
          <p className="font-bold text-base pb-3">ملاحظات هامة حول القروض:</p>

          <div className="py-3">
            <p className="font-semibold text-indigo-900 dark:text-indigo-200 mb-1">1. لماذا يختلف القسط الفعلي عن الحاسبة؟</p>
            <p className="leading-relaxed mb-2">
              <strong>مثال واقعي:</strong> إذا اقترضت 33,000 ر.ع لمدة 10 سنوات بنسبة فائدة 5%، فإن القسط الحسابي الأساسي هو <strong>350 ر.ع</strong> تقريباً. لكنك قد تجد أن البنك يطلب قسطاً أعلى بكثير!
            </p>
            <p className="font-medium mb-1">أسباب هذه الزيادة:</p>
            <ul className="list-disc list-inside space-y-1 text-indigo-700 dark:text-indigo-300/90 pr-2">
              <li>إضافة <strong>رسوم التأمين على الحياة</strong> (والتي قد تصل لآلاف الريالات وتضاف لأصل القرض).</li>
              <li>إضافة رسوم التأمين على الممتلكات والرسوم الإدارية.</li>
              <li>طريقة حساب الفائدة (مركبة شهرياً) على المبلغ الإجمالي الجديد (القرض + التأمين).</li>
            </ul>
          </div>

          <div className="py-3">
            <p className="font-semibold text-indigo-900 dark:text-indigo-200 mb-1">2. القاعدة الذهبية (تأثير مدة القرض):</p>
            <p className="leading-relaxed mb-2">
              كلما زادت مدة القرض (السنوات)، قلّ القسط الشهري ولكن <strong>تضاعفت أرباح البنك (الفوائد)</strong>.
            </p>
            <p className="font-medium mb-1">مثال مقارنة (لقرض 33,000 ر.ع بنسبة 5%):</p>
            <ul className="list-disc list-inside space-y-1 text-indigo-800 dark:text-indigo-300 pr-2">
              <li><strong>على 5 سنوات:</strong> القسط 622 ر.ع ⟵ (أرباح البنك = <strong>4,365 ر.ع</strong>)</li>
              <li><strong>على 10 سنوات:</strong> القسط 350 ر.ع ⟵ (أرباح البنك = <strong>9,001 ر.ع</strong>)</li>
            </ul>
            <p className="mt-2 text-xs font-bold text-slate-900 bg-lime-300 dark:bg-lime-400 p-2 rounded inline-block">
              الخلاصة: في الـ 10 سنوات، أنت تدفع قسطاً أريح، لكنك تدفع للبنك أكثر من ضعف الفوائد!
            </p>
          </div>

          <div className="py-3">
            <p className="font-semibold text-indigo-900 dark:text-indigo-200 mb-1">3. الفائدة الثابتة مقابل الفائدة المتناقصة:</p>
            <p className="leading-relaxed mb-2">
              <strong>الفائدة الثابتة (Flat):</strong> تُحسب مرة واحدة على كامل مبلغ القرض الأصلي طوال المدة، فتبقى حصة الفائدة في كل قسط ثابتة.
              <strong> الفائدة المتناقصة (Reducing):</strong> تُحسب شهرياً على الرصيد المتبقي فقط، فتقل حصة الفائدة تدريجياً كلما سددت أكثر — وهي الطريقة الأكثر شيوعاً في معظم القروض الشخصية بالبنوك التجارية.
            </p>
            <p className="font-medium mb-1">مثال توضيحي (لنفس قرض 33,000 ر.ع بنسبة 5% لمدة 10 سنوات):</p>
            <ul className="list-disc list-inside space-y-1 text-indigo-800 dark:text-indigo-300 pr-2">
              <li><strong>فائدة ثابتة:</strong> القسط 412.5 ر.ع ⟵ (إجمالي الفوائد = <strong>16,500 ر.ع</strong>)</li>
              <li><strong>فائدة متناقصة:</strong> القسط 350 ر.ع ⟵ (إجمالي الفوائد = <strong>9,001 ر.ع</strong>)</li>
            </ul>
            <p className="mt-2 text-xs font-bold text-slate-900 bg-lime-300 dark:bg-lime-400 p-2 rounded inline-block">
              نفس المبلغ ونفس النسبة المعلنة، لكن الفائدة الثابتة أغلى بكثير (يقارب ضعف الفوائد تقريباً) لأنها تُحسب على كامل المبلغ الأصلي طوال المدة دون أن تقل — لذلك يجب دائماً السؤال عن طريقة الحساب وليس النسبة فقط.
            </p>
          </div>

          <div className="py-3">
            <p className="font-semibold text-indigo-900 dark:text-indigo-200 mb-1">4. البنك التقليدي مقابل البنك الإسلامي:</p>
            <p className="leading-relaxed mb-2">
              الفرق بينهما <strong>شرعي وتعاقدي وليس رياضياً</strong>. البنك التقليدي يقرضك مبلغاً مقابل فائدة على الدين، أما البنك الإسلامي (كبنك نزوى، العز الإسلامي، وميثاق التابع لبنك مسقط) فلا يتعامل بالفائدة، بل بعقود بيع أو إيجار أو شراكة:
            </p>
            <ul className="list-disc list-inside space-y-1 text-indigo-700 dark:text-indigo-300/90 pr-2">
              <li><strong>المرابحة:</strong> البنك يشتري السلعة ويبيعها لك بسعر (التكلفة + هامش ربح ثابت متفق عليه مسبقاً لا يتغير) — يطابق رياضياً وضع <strong>"قسط ثابت (Flat)"</strong> أعلاه.</li>
              <li><strong>الإجارة المنتهية بالتمليك / المشاركة المتناقصة:</strong> تشتري حصة البنك تدريجياً وتدفع إيجاراً على حصته المتبقية، والإيجار يتناقص كلما زادت ملكيتك — يطابق رياضياً وضع <strong>"قسط متناقص (Reducing)"</strong> أعلاه.</li>
            </ul>
            <p className="leading-relaxed mt-2">
              لذلك يمكنك استخدام هذه الحاسبة بغض النظر عن نوع البنك، مع اعتبار النسبة المدخلة "نسبة ربح/إيجار" بدل "فائدة" في حالة التمويل الإسلامي.
            </p>
            <p className="mt-2 text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 p-2 rounded inline-block">
              تنبيه: عند السداد المبكر، البنوك الإسلامية غالباً ملزمة نظاماً بمنح خصم "الإبراء" عن الربح غير المستحق، بينما البنوك التقليدية قد تفرض رسوم سداد مبكر بدلاً من ذلك — وهذا الفرق غير محتسب في هذه الحاسبة حالياً.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-6">
        {/* Method Toggle */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">طريقة حساب الفائدة</label>
          <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-slate-900/50 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setMethod('reducing')}
              className={`py-2.5 rounded-lg text-sm font-semibold transition-all ${
                method === 'reducing' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              قسط متناقص (Reducing)
            </button>
            <button
              type="button"
              onClick={() => setMethod('flat')}
              className={`py-2.5 rounded-lg text-sm font-semibold transition-all ${
                method === 'flat' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              قسط ثابت (Flat)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">مبلغ التمويل (الأساسي)</label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Landmark className="h-5 w-5 text-slate-400 dark:text-slate-500" />
              </div>
              <input
                type="number"
                min="0"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                className="block w-full pl-12 pr-10 py-3 text-base border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-xl border bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100"
                placeholder="مثال: 33000"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-slate-500 dark:text-slate-400 sm:text-sm">ر.ع.</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">نسبة الفائدة / المرابحة / الإجارة السنوية</label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Percent className="h-5 w-5 text-slate-400 dark:text-slate-500" />
              </div>
              <input
                type="number"
                min="0"
                step="0.01"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="block w-full pl-3 pr-10 py-3 text-base border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-xl border bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100"
                placeholder="مثال: 5.05 (أو 0 لقرض بدون فائدة)"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:col-span-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">المدة (بالسنوات)</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Clock className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                </div>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={years}
                  onChange={(e) => handleYearsChange(e.target.value)}
                  className="block w-full pl-3 pr-9 py-3 text-base border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-xl border bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100"
                  placeholder="سنوات"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">المدة (بالشهور)</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Clock className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                </div>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={months}
                  onChange={(e) => handleMonthsChange(e.target.value)}
                  className="block w-full pl-3 pr-9 py-3 text-base border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-xl border bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100"
                  placeholder="شهور"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {result && (
        <>
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

          {/* Payment Schedule (expand/collapse) */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowSchedule((prev) => !prev)}
              className="w-full flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <span className="font-semibold text-slate-800 dark:text-slate-100">
                جدول الدفعات التفصيلي ({result.schedule.length} دفعة)
              </span>
              <span className={`p-1.5 rounded-full transition-colors ${showSchedule ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                {showSchedule ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </span>
            </button>

            {showSchedule && (
              <div className="border-t border-slate-100 dark:border-slate-700 max-h-96 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-900/50 sticky top-0">
                    <tr className="text-slate-600 dark:text-slate-300">
                      <th className="p-3 text-right font-semibold">#</th>
                      <th className="p-3 text-right font-semibold">القسط</th>
                      <th className="p-3 text-right font-semibold">أصل</th>
                      <th className="p-3 text-right font-semibold">فائدة</th>
                      <th className="p-3 text-right font-semibold">الرصيد المتبقي</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.schedule.map((row) => (
                      <tr key={row.month} className="border-t border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                        <td className="p-3 text-slate-400 dark:text-slate-500">{row.month}</td>
                        <td className="p-3 font-medium">{row.payment.toFixed(3)}</td>
                        <td className="p-3">{row.principal.toFixed(3)}</td>
                        <td className="p-3">{row.interest.toFixed(3)}</td>
                        <td className="p-3">{row.balance.toFixed(3)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
