import React, { useState } from 'react';
import { RotateCcw, CalendarDays } from 'lucide-react';
import { differenceInYears, differenceInMonths, differenceInDays, addYears, addMonths } from 'date-fns';
import DateSelector from './DateSelector';

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState<string>('');
  const [age, setAge] = useState<{ years: number; months: number; days: number } | null>(null);

  const calculateAge = (dateString: string) => {
    if (!dateString) {
      setAge(null);
      return;
    }

    const start = new Date(dateString);
    const end = new Date(); // Today

    if (start > end) {
      setAge(null);
      return;
    }

    const years = differenceInYears(end, start);
    const dateAfterYears = addYears(start, years);

    const months = differenceInMonths(end, dateAfterYears);
    const dateAfterMonths = addMonths(dateAfterYears, months);

    const days = differenceInDays(end, dateAfterMonths);

    setAge({ years, months, days });
  };

  const handleDateChange = (newDate: string) => {
    setBirthDate(newDate);
    calculateAge(newDate);
  };

  const reset = () => {
    setBirthDate('');
    setAge(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">حاسبة العمر</h2>
        <button
          onClick={reset}
          className="p-2 text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-full transition-colors"
          title="إعادة تعيين"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">تاريخ الميلاد</label>
        <DateSelector
          value={birthDate}
          onChange={handleDateChange}
          colorTheme="emerald"
        />
      </div>

      {age && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-emerald-50 dark:bg-emerald-900/30 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-800/50 text-center">
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{age.years}</div>
            <div className="text-sm font-medium text-emerald-800 dark:text-emerald-300 mt-1">سنة</div>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-900/30 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-800/50 text-center">
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{age.months}</div>
            <div className="text-sm font-medium text-emerald-800 dark:text-emerald-300 mt-1">شهر</div>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-900/30 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-800/50 text-center">
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{age.days}</div>
            <div className="text-sm font-medium text-emerald-800 dark:text-emerald-300 mt-1">يوم</div>
          </div>
        </div>
      )}
    </div>
  );
}
