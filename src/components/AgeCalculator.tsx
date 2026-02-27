import React, { useState } from 'react';
import { RotateCcw, CalendarDays } from 'lucide-react';
import { differenceInYears, differenceInMonths, differenceInDays, addYears, addMonths } from 'date-fns';

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

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBirthDate(e.target.value);
    calculateAge(e.target.value);
  };

  const reset = () => {
    setBirthDate('');
    setAge(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">حاسبة العمر</h2>
        <button 
          onClick={reset}
          className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
          title="إعادة تعيين"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <label className="block text-sm font-medium text-slate-700 mb-2">تاريخ الميلاد</label>
        <div className="relative w-full py-3 px-4 border border-slate-200 rounded-xl bg-slate-50 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition-all flex items-center justify-between overflow-hidden">
          <input
            type="date"
            value={birthDate}
            onChange={handleDateChange}
            onClick={(e) => {
              try {
                if ('showPicker' in HTMLInputElement.prototype) {
                  e.currentTarget.showPicker();
                }
              } catch (err) {}
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
          />
          <span className={`text-base sm:text-sm ${birthDate ? 'text-slate-900' : 'text-slate-400'}`}>
            {birthDate ? birthDate : "اختر التاريخ لحساب عمرك بدقة"}
          </span>
          <CalendarDays className="h-5 w-5 text-slate-400 shrink-0" />
        </div>
      </div>

      {age && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 text-center">
            <div className="text-3xl font-bold text-emerald-600">{age.years}</div>
            <div className="text-sm font-medium text-emerald-800 mt-1">سنة</div>
          </div>
          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 text-center">
            <div className="text-3xl font-bold text-emerald-600">{age.months}</div>
            <div className="text-sm font-medium text-emerald-800 mt-1">شهر</div>
          </div>
          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 text-center">
            <div className="text-3xl font-bold text-emerald-600">{age.days}</div>
            <div className="text-sm font-medium text-emerald-800 mt-1">يوم</div>
          </div>
        </div>
      )}
    </div>
  );
}
