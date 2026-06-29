import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, CheckCircle2, History, BarChart2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center mt-12 animate-fade-in">
      {/* Icon */}
      <div className="mb-6 text-blue-500">
        <GraduationCap className="w-24 h-24 stroke-[1.5]" />
      </div>

      {/* Title */}
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{t('home.welcome')}</h2>
      <p className="text-slate-500 dark:text-slate-400 text-center mb-10 max-w-sm">
        {t('home.subtitle')}
      </p>

      {/* Connection Status */}
      <div className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex items-center justify-between shadow-sm mb-12 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-100 dark:bg-emerald-900/40 p-1.5 rounded-full">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <span className="font-medium text-emerald-700 dark:text-emerald-400">{t('home.connected')}</span>
        </div>
        <button className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 p-2 rounded-full transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
        </button>
      </div>

      {/* Actions */}
      <div className="w-full flex flex-col gap-3">
        <button 
          onClick={() => navigate('/prediction')}
          className="w-full bg-[#2196F3] hover:bg-blue-600 active:bg-blue-700 text-white font-medium py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <BarChart2 className="w-5 h-5" />
          {t('home.btn_start')}
        </button>
        <button 
          className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-blue-500 font-medium py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <History className="w-5 h-5" />
          {t('home.btn_history')}
        </button>
      </div>
    </div>
  );
};

export default Home;
