import React, { useState } from 'react';
import { Calculator, Calendar, Briefcase, Landmark, Tag, Menu, X, DollarSign } from 'lucide-react';
import BasicCalculator from './components/BasicCalculator';
import AgeCalculator from './components/AgeCalculator';
import ExperienceCalculator from './components/ExperienceCalculator';
import LoanCalculator from './components/LoanCalculator';
import DiscountCalculator from './components/DiscountCalculator';
import CurrencyConverter from './components/CurrencyConverter';
import { cn } from './lib/utils';

type Tab = 'basic' | 'age' | 'experience' | 'loan' | 'discount' | 'currency';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('basic');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'basic', label: 'الحاسبة السريعة', icon: Calculator, color: 'text-slate-700', bg: 'bg-slate-200' },
    { id: 'age', label: 'حاسبة العمر', icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { id: 'experience', label: 'سنوات الخبرة', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-100' },
    { id: 'loan', label: 'القروض البنكية', icon: Landmark, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { id: 'discount', label: 'التخفيضات', icon: Tag, color: 'text-rose-600', bg: 'bg-rose-100' },
    { id: 'currency', label: 'محول العملات', icon: DollarSign, color: 'text-amber-600', bg: 'bg-amber-100' },
  ] as const;

  const renderContent = () => {
    switch (activeTab) {
      case 'basic': return <BasicCalculator />;
      case 'age': return <AgeCalculator />;
      case 'experience': return <ExperienceCalculator />;
      case 'loan': return <LoanCalculator />;
      case 'discount': return <DiscountCalculator />;
      case 'currency': return <CurrencyConverter />;
      default: return null;
    }
  };

  return (
    <div className="h-[100dvh] bg-slate-50 flex flex-col md:flex-row overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between flex-shrink-0 z-20">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-600 p-2 rounded-lg">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-bold text-lg text-slate-800">المحاسب الشامل</h1>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <nav className={cn(
        "bg-white border-l border-slate-200 w-full md:w-72 flex-shrink-0 transition-all duration-300 z-10 overflow-y-auto",
        "md:relative md:block md:h-full",
        isMobileMenuOpen ? "block absolute top-[73px] left-0 right-0 bottom-0" : "hidden"
      )}>
        <div className="p-6 hidden md:flex items-center gap-3 border-b border-slate-100">
          <div className="bg-emerald-600 p-2.5 rounded-xl shadow-sm">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-slate-800">المحاسب الشامل</h1>
            <p className="text-xs text-slate-500 font-medium">أدوات حسابية ذكية</p>
          </div>
        </div>

        <div className="p-4 space-y-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsMobileMenuOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-right",
                  isActive 
                    ? "bg-slate-900 text-white shadow-md" 
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <div className={cn(
                  "p-2 rounded-lg transition-colors",
                  isActive ? "bg-white/20 text-white" : cn(tab.bg, tab.color)
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-semibold">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto w-full flex flex-col relative">
        <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
          <div className="flex-1">
            {renderContent()}
          </div>
          
          <footer className="mt-12 pt-6 pb-6 md:pb-2 text-center text-sm text-slate-500 border-t border-slate-200 w-full shrink-0">
            جميع الحقوق محفوظة للاستاذ احمد الفزاري &copy; {new Date().getFullYear()}
          </footer>
        </div>
      </main>
    </div>
  );
}
