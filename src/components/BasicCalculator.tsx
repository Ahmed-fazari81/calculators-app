import React, { useState } from 'react';
import { Calculator as CalcIcon, Delete } from 'lucide-react';

export default function BasicCalculator() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('0');

  const handlePress = (val: string) => {
    if (val === '=') {
      try {
        if (!expression) return;
        // Replace display operators with JS operators
        let evalStr = expression.replace(/×/g, '*').replace(/÷/g, '/');
        // Handle percentage
        evalStr = evalStr.replace(/%/g, '/100');
        
        // Safe evaluation using Function
        const res = Function(`'use strict'; return (${evalStr})`)();
        
        // Format result to avoid long decimals (e.g., 0.1 + 0.2)
        const formattedRes = Math.round(res * 100000000) / 100000000;
        setResult(String(formattedRes));
        setExpression(String(formattedRes));
      } catch (e) {
        setResult('خطأ');
      }
    } else if (val === 'C') {
      setExpression('');
      setResult('0');
    } else if (val === 'DEL') {
      setExpression(prev => prev.slice(0, -1));
    } else {
      // Prevent consecutive operators
      const lastChar = expression.slice(-1);
      const isOperator = ['+', '-', '×', '÷', '%'].includes(val);
      const isLastOperator = ['+', '-', '×', '÷', '%'].includes(lastChar);
      
      if (isOperator && isLastOperator) {
        setExpression(prev => prev.slice(0, -1) + val);
      } else {
        setExpression(prev => prev + val);
      }
    }
  };

  const buttons = [
    { label: 'C', class: 'bg-rose-100 text-rose-600 hover:bg-rose-200' },
    { label: 'DEL', class: 'bg-slate-200 text-slate-700 hover:bg-slate-300', icon: <Delete className="w-5 h-5 mx-auto" /> },
    { label: '%', class: 'bg-slate-200 text-slate-700 hover:bg-slate-300' },
    { label: '÷', class: 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200 text-xl' },
    
    { label: '7', class: 'bg-white text-slate-800 hover:bg-slate-50' },
    { label: '8', class: 'bg-white text-slate-800 hover:bg-slate-50' },
    { label: '9', class: 'bg-white text-slate-800 hover:bg-slate-50' },
    { label: '×', class: 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200 text-xl' },
    
    { label: '4', class: 'bg-white text-slate-800 hover:bg-slate-50' },
    { label: '5', class: 'bg-white text-slate-800 hover:bg-slate-50' },
    { label: '6', class: 'bg-white text-slate-800 hover:bg-slate-50' },
    { label: '-', class: 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200 text-xl' },
    
    { label: '1', class: 'bg-white text-slate-800 hover:bg-slate-50' },
    { label: '2', class: 'bg-white text-slate-800 hover:bg-slate-50' },
    { label: '3', class: 'bg-white text-slate-800 hover:bg-slate-50' },
    { label: '+', class: 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200 text-xl' },
    
    { label: '0', class: 'bg-white text-slate-800 hover:bg-slate-50 col-span-2' },
    { label: '.', class: 'bg-white text-slate-800 hover:bg-slate-50 text-xl' },
    { label: '=', class: 'bg-indigo-600 text-white hover:bg-indigo-700 text-xl' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-sm mx-auto">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-slate-800">الحاسبة السريعة</h2>
      </div>

      <div className="bg-slate-100 p-6 rounded-3xl shadow-inner border border-slate-200">
        {/* Display */}
        <div className="bg-white p-4 rounded-2xl shadow-sm mb-6 text-left min-h-[100px] flex flex-col justify-end items-end overflow-hidden border border-slate-200">
          <div className="text-slate-500 text-lg h-7 tracking-wider font-mono">
            {expression || '\u00A0'}
          </div>
          <div className="text-4xl font-bold text-slate-800 tracking-tight font-mono truncate w-full text-right">
            {result}
          </div>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-4 gap-3">
          {buttons.map((btn, idx) => (
            <button
              key={idx}
              onClick={() => handlePress(btn.label)}
              className={`p-4 rounded-2xl font-bold text-lg transition-all active:scale-95 shadow-sm border border-slate-200/50 ${btn.class}`}
            >
              {btn.icon || btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
