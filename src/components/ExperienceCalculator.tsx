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
          <DateSelector 
            value={startDate} 
            onChange={setStartDate} 
            icon={<Briefcase className="w-5 h-5 text-slate-400" />}
            colorTheme="blue" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">تاريخ نهاية العمل (أو اليوم)</label>
          <DateSelector 
            value={endDate} 
            onChange={setEndDate} 
            icon={<CalendarDays className="w-5 h-5 text-slate-400" />}
            colorTheme="blue" 
          />
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
