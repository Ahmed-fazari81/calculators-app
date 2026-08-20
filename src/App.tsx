import React, { useEffect, useState } from 'react';
import { Calculator, Calendar, Briefcase, Landmark, Tag, ChevronRight, DollarSign, Coins, HeartHandshake, Sun, Moon } from 'lucide-react';
import BasicCalculator from './components/BasicCalculator';
import AgeCalculator from './components/AgeCalculator';
import ExperienceCalculator from './components/ExperienceCalculator';
import LoanCalculator from './components/LoanCalculator';
import DiscountCalculator from './components/DiscountCalculator';
import CurrencyConverter from './components/CurrencyConverter';
import GoldCalculator from './components/GoldCalculator';
import ZakatCalculator from './components/ZakatCalculator';
import { cn } from './lib/utils';

type Tab = 'basic' | 'age' | 'experience' | 'loan' | 'discount' | 'currency' | 'gold' | 'zakat';

const tabs = [
  { id: 'basic', label: 'الحاسبة السريعة', icon: Calculator, color: 'text-slate-700 dark:text-slate-300', bg: 'bg-slate-200 dark:bg-slate-700' },
  { id: 'age', label: 'حاسبة العمر', icon: Calendar, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/40' },
  { id: 'experience', label: 'سنوات الخبرة', icon: Briefcase, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/40' },
  { id: 'loan', label: 'القروض البنكية', icon: Landmark, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-900/40' },
  { id: 'discount', label: 'التخفيضات', icon: Tag, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-100 dark:bg-rose-900/40' },
  { id: 'currency', label: 'محول العملات', icon: DollarSign, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/40' },
  { id: 'gold', label: 'حاسبة الذهب', icon: Coins, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/40' },
  { id: 'zakat', label: 'حاسبة الزكاة', icon: HeartHandshake, color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-100 dark:bg-teal-900/40' },
] as const;

function useTheme() {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return { isDark, toggleTheme: () => setIsDark((prev) => !prev) };
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab | null>(null);
  const { isDark, toggleTheme } = useTheme();

  const activeTabInfo = tabs.find((tab) => tab.id === activeTab);

  const renderContent = () => {
    switch (activeTab) {
      case 'basic': return <BasicCalculator />;
      case 'age': return <AgeCalculator />;
      case 'experience': return <ExperienceCalculator />;
      case 'loan': return <LoanCalculator />;
      case 'discount': return <DiscountCalculator />;
      case 'currency': return <CurrencyConverter />;
      case 'gold': return <GoldCalculator />;
      case 'zakat': return <ZakatCalculator />;
      default: return null;
    }
  };

  const ThemeToggleButton = ({ className }: { className?: string }) => (
    <button
      onClick={toggleTheme}
      className={cn(
        "p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors",
        className
      )}
      aria-label={isDark ? "تفعيل الوضع النهاري" : "تفعيل الوضع الليلي"}
      title={isDark ? "الوضع النهاري" : "الوضع الليلي"}
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );

  return (
    <div className="h-[100dvh] bg-slate-50 dark:bg-slate-900 flex flex-col md:flex-row overflow-hidden transition-colors">
      {/* Mobile Header */}
      <div className="md:hidden bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between gap-2 flex-shrink-0 z-50 relative">
        {activeTab ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab(null)}
              className="p-2 -mr-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
              aria-label="العودة للقائمة الرئيسية"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <h1 className="font-bold text-lg text-slate-800 dark:text-slate-100">{activeTabInfo?.label}</h1>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 p-2 rounded-lg">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-bold text-lg text-slate-800 dark:text-slate-100">المحاسب الشامل</h1>
          </div>
        )}
        <ThemeToggleButton />
      </div>

      {/* Sidebar Navigation (desktop) */}
      <nav className="hidden md:block bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 w-72 flex-shrink-0 h-full overflow-y-auto transition-colors">
        <div className="p-6 flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 p-2.5 rounded-xl shadow-sm">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-slate-800 dark:text-slate-100">المحاسب الشامل</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">أدوات حسابية ذكية</p>
            </div>
          </div>
          <ThemeToggleButton />
        </div>

        <div className="p-4 space-y-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-right",
                  isActive
                    ? "bg-slate-900 dark:bg-slate-700 text-white shadow-md"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white"
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
            {activeTab === null ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 md:hidden">اختر حاسبة</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className="flex flex-col items-center justify-center gap-3 p-5 md:p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md hover:-translate-y-0.5 transition-all text-center"
                      >
                        <div className={cn("p-3.5 rounded-xl", tab.bg, tab.color)}>
                          <Icon className="w-7 h-7" />
                        </div>
                        <span className="font-semibold text-slate-700 dark:text-slate-200 text-sm md:text-base">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : renderContent()}
          </div>

          <footer className="mt-12 pt-6 pb-6 md:pb-2 text-center text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 w-full shrink-0">
            جميع الحقوق محفوظة للاستاذ احمد الفزاري &copy; {new Date().getFullYear()}
          </footer>
        </div>
      </main>
    </div>
  );
}
