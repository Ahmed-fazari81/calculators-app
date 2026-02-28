import React, { useState, useEffect } from 'react';
import { CalendarDays } from 'lucide-react';

interface DateSelectorProps {
  value: string; // YYYY-MM-DD
  onChange: (date: string) => void;
  icon?: React.ReactNode;
  colorTheme?: 'emerald' | 'blue';
}

export default function DateSelector({ value, onChange, icon, colorTheme = 'emerald' }: DateSelectorProps) {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  useEffect(() => {
    if (value) {
      const [y, m, d] = value.split('-');
      setYear(y || '');
      setMonth(m || '');
      setDay(d || '');
    } else {
      setYear('');
      setMonth('');
      setDay('');
    }
  }, [value]);

  const handleDateChange = (newY: string, newM: string, newD: string) => {
    setYear(newY);
    setMonth(newM);
    setDay(newD);
    if (newY && newM && newD) {
      onChange(`${newY}-${newM.padStart(2, '0')}-${newD.padStart(2, '0')}`);
    } else {
      onChange('');
    }
  };

  const currentYear = new Date().getFullYear();
  // Generate years from current year down to 1920
  const years = Array.from({ length: currentYear - 1920 + 1 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  
  const getDaysInMonth = (y: string, m: string) => {
    if (!m) return 31;
    const monthNum = parseInt(m);
    const yearNum = y ? parseInt(y) : currentYear;
    return new Date(yearNum, monthNum, 0).getDate();
  };
  
  const daysCount = getDaysInMonth(year, month);
  const days = Array.from({ length: daysCount }, (_, i) => i + 1);

  const ringColor = colorTheme === 'emerald' 
    ? 'focus-within:ring-emerald-500 focus-within:border-emerald-500' 
    : 'focus-within:ring-blue-500 focus-within:border-blue-500';

  return (
    <div className={`flex items-center w-full border border-slate-200 rounded-xl bg-slate-50 transition-all overflow-hidden px-2 focus-within:ring-2 ${ringColor}`}>
      <select 
        value={day} 
        onChange={(e) => handleDateChange(year, month, e.target.value)}
        className="flex-1 bg-transparent py-3 px-1 outline-none text-center appearance-none cursor-pointer text-slate-700 font-medium sm:text-sm"
        style={{ textAlignLast: 'center' }}
      >
        <option value="" disabled>اليوم</option>
        {days.map(d => <option key={d} value={d}>{d}</option>)}
      </select>
      
      <span className="text-slate-300">/</span>
      
      <select 
        value={month} 
        onChange={(e) => handleDateChange(year, e.target.value, day)}
        className="flex-1 bg-transparent py-3 px-1 outline-none text-center appearance-none cursor-pointer text-slate-700 font-medium sm:text-sm"
        style={{ textAlignLast: 'center' }}
      >
        <option value="" disabled>الشهر</option>
        {months.map(m => <option key={m} value={m}>{m}</option>)}
      </select>
      
      <span className="text-slate-300">/</span>
      
      <select 
        value={year} 
        onChange={(e) => handleDateChange(e.target.value, month, day)}
        className="flex-[1.2] bg-transparent py-3 px-1 outline-none text-center appearance-none cursor-pointer text-slate-700 font-medium sm:text-sm"
        style={{ textAlignLast: 'center' }}
      >
        <option value="" disabled>السنة</option>
        {years.map(y => <option key={y} value={y}>{y}</option>)}
      </select>

      <div className="px-2 pointer-events-none shrink-0">
        {icon || <CalendarDays className="w-5 h-5 text-slate-400" />}
      </div>
    </div>
  );
}
