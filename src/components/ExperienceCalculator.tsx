import React, { useState, useEffect } from 'react';
import { RotateCcw, CalendarDays, Briefcase } from 'lucide-react';
import { differenceInYears, differenceInMonths, differenceInDays, addYears, addMonths, format } from 'date-fns';

export default function ExperienceCalculator() {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [experience, setExperience] = useState<{ years: number; months: number; days: number } | null>(null);

  const calculateExperience = (start: string, end: string) => {
    if (!start || !end) {
      setExperience(null);
      return;
    }

    const startDateObj = new Date(start);
    const endDateObj = new Date(end);

    if (startDateObj > endDateObj) {
      setExperience(null);
      return;
    }

    const years = differenceInYears(endDateObj, startDateObj);
    const dateAfterYears = addYears(startDateObj, years);
    
    const months = differenceInMonths(endDateObj, dateAfterYears);
    const dateAfterMonths = addMonths(dateAfterYears, months);
    
    const days = differenceInDays(endDateObj, dateAfterMonths);

    setExperience({ years, months, days });
  };

  useEffect(() => {
    calculateExperience(startDate, endDate);
  }, [startDate, endDate]);

  const reset = () => {
    setStartDate('');
    setEndDate(format(new Date(), 'yyyy-MM-dd'));
    setExperience(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">حاسبة سنوات الخبرة</h2>
        <button 
          onClick={reset}
          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
          title="إعادة تعيين"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">تاريخ بداية العمل</label>
          <div className="relative w-full py-3 px-4 border border-slate-200 rounded-xl bg-slate-50 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all flex items-center justify-between overflow-hidden">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              onClick={(e) => {
                try {
                  if ('showPicker' in HTMLInputElement.prototype) {
                    e.currentTarget.showPicker();
                  }
                } catch (err) {}
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
            />
            <span className={`text-base sm:text-sm ${startDate ? 'text-slate-900' : 'text-slate-400'}`}>
              {startDate ? startDate : "اختر التاريخ"}
            </span>
            <Briefcase className="h-5 w-5 text-slate-400 shrink-0" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">تاريخ نهاية العمل (أو اليوم)</label>
          <div className="relative w-full py-3 px-4 border border-slate-200 rounded-xl bg-slate-50 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all flex items-center justify-between overflow-hidden">
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              onClick={(e) => {
                try {
                  if ('showPicker' in HTMLInputElement.prototype) {
                    e.currentTarget.showPicker();
                  }
                } catch (err) {}
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
            />
            <span className={`text-base sm:text-sm ${endDate ? 'text-slate-900' : 'text-slate-400'}`}>
              {endDate ? endDate : "اختر التاريخ"}
            </span>
            <CalendarDays className="h-5 w-5 text-slate-400 shrink-0" />
          </div>
        </div>
      </div>

      {experience && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 text-center">
            <div className="text-3xl font-bold text-blue-600">{experience.years}</div>
            <div className="text-sm font-medium text-blue-800 mt-1">سنة</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 text-center">
            <div className="text-3xl font-bold text-blue-600">{experience.months}</div>
            <div className="text-sm font-medium text-blue-800 mt-1">شهر</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 text-center">
            <div className="text-3xl font-bold text-blue-600">{experience.days}</div>
            <div className="text-sm font-medium text-blue-800 mt-1">يوم</div>
          </div>
        </div>
      )}
    </div>
  );
}
