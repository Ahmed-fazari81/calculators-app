import React, { useState, useEffect } from 'react';
import { RotateCcw, CalendarDays, Briefcase } from 'lucide-react';
import { differenceInYears, differenceInMonths, differenceInDays, addYears, addMonths, format } from 'date-fns';
import DateSelector from './DateSelector';

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
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">حاسبة سنوات الخبرة</h2>
        <button
          onClick={reset}
          className="p-2 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full transition-colors"
          title="إعادة تعيين"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">تاريخ بداية العمل</label>
          <DateSelector
            value={startDate}
            onChange={setStartDate}
            icon={<Briefcase className="w-5 h-5 text-slate-400 dark:text-slate-500" />}
            colorTheme="blue"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">تاريخ نهاية العمل (أو اليوم)</label>
          <DateSelector
            value={endDate}
            onChange={setEndDate}
            icon={<CalendarDays className="w-5 h-5 text-slate-400 dark:text-slate-500" />}
            colorTheme="blue"
          />
        </div>
      </div>

      {experience && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-2xl border border-blue-100 dark:border-blue-800/50 text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{experience.years}</div>
            <div className="text-sm font-medium text-blue-800 dark:text-blue-300 mt-1">سنة</div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-2xl border border-blue-100 dark:border-blue-800/50 text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{experience.months}</div>
            <div className="text-sm font-medium text-blue-800 dark:text-blue-300 mt-1">شهر</div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-2xl border border-blue-100 dark:border-blue-800/50 text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{experience.days}</div>
            <div className="text-sm font-medium text-blue-800 dark:text-blue-300 mt-1">يوم</div>
          </div>
        </div>
      )}
    </div>
  );
}
