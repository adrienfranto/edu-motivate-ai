import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Settings as SettingsIcon, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  // Define page titles based on route
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return t('layout.title_home');
      case '/prediction': return t('layout.title_prediction');
      case '/result': return t('layout.title_result');
      case '/settings': return t('layout.title_settings');
      default: return t('layout.title_default');
    }
  };

  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      {/* Navbar */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="w-10">
            {!isHome && (
              <button 
                onClick={() => navigate(-1)} 
                className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                aria-label="Retour"
              >
                <ArrowLeft className="w-6 h-6 text-slate-700 dark:text-slate-300" />
              </button>
            )}
          </div>
          
          <h1 className="text-lg font-bold text-slate-900 dark:text-white flex-1 text-center">
            {getPageTitle()}
          </h1>

          <div className="w-10 flex justify-end">
            <button 
              onClick={() => navigate('/settings')}
              className="p-2 -mr-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              aria-label="Paramètres"
            >
              <SettingsIcon className="w-6 h-6 text-slate-900 dark:text-white" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
