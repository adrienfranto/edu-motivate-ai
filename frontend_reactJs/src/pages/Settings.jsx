import React, { useState, useEffect } from 'react';
import { Palette, Globe, Link, Check, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Settings = () => {
  const { t, i18n } = useTranslation();
  const [isDark, setIsDark] = useState(
    localStorage.getItem('theme') === 'dark' || 
    document.documentElement.classList.contains('dark')
  );
  const [showLangMenu, setShowLangMenu] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const themeText = isDark ? t('settings.dark') : t('settings.light');

  const getLanguageName = (lng) => {
    switch(lng) {
      case 'fr': return 'Français';
      case 'en': return 'English';
      case 'mg': return 'Malagasy';
      default: return 'Français';
    }
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setShowLangMenu(false);
  };

  const sectionBg = isDark ? 'bg-slate-800 border border-slate-700' : 'bg-[#EBEBEB]';
  const dividerColor = isDark ? 'border-slate-700' : 'border-slate-300';
  const iconColor = isDark ? 'text-slate-300' : 'text-slate-700';
  const labelColor = isDark ? 'text-slate-100' : 'text-slate-800';
  const subColor = isDark ? 'text-slate-400' : 'text-slate-500';
  const headingColor = isDark ? 'text-white' : 'text-slate-800';

  return (
    <div className="animate-fade-in pb-10">
      
      {/* Apparence */}
      <h3 className={`text-lg font-bold mb-4 ml-2 ${headingColor}`}>{t('settings.appearance')}</h3>
      <div className={`${sectionBg} rounded-2xl p-2 mb-8 transition-colors duration-300`}>
        {/* Theme toggle */}
        <div className={`flex items-center justify-between p-4 border-b ${dividerColor}`}>
          <div className="flex items-center gap-4">
            <Palette className={`w-6 h-6 ${iconColor}`} />
            <div>
              <p className={`font-medium ${labelColor}`}>{t('settings.theme')}</p>
              <p className={`text-sm ${subColor}`}>{themeText}</p>
            </div>
          </div>
          {/* Custom toggle switch */}
          <button
            role="switch"
            aria-checked={isDark}
            onClick={() => setIsDark(!isDark)}
            className={`relative inline-flex items-center w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-blue-500' : 'bg-slate-300'}`}
          >
            <span
              className={`inline-block w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300 ${isDark ? 'translate-x-6' : 'translate-x-1'}`}
            />
          </button>
        </div>

        {/* Language picker */}
        <div className={`flex items-center justify-between p-4 relative cursor-pointer`} onClick={() => setShowLangMenu(!showLangMenu)}>
          <div className="flex items-center gap-4">
            <Globe className={`w-6 h-6 ${iconColor}`} />
            <div>
              <p className={`font-medium ${labelColor}`}>{t('settings.language')}</p>
              <p className={`text-sm ${subColor}`}>{getLanguageName(i18n.language)}</p>
            </div>
          </div>
          <svg className={`w-5 h-5 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
          
          {showLangMenu && (
            <div className={`absolute top-1/2 right-4 transform -translate-y-1/2 ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-100'} rounded-2xl shadow-xl p-4 w-52 z-10 border`}>
              <h4 className={`text-base font-semibold mb-3 ${labelColor}`}>{t('settings.choose_language')}</h4>
              <ul className="space-y-3">
                <li className={`flex items-center gap-3 cursor-pointer p-2 rounded-xl ${i18n.language === 'fr' ? 'bg-blue-50 dark:bg-blue-900/30' : 'hover:bg-slate-50 dark:hover:bg-slate-600'}`} onClick={(e) => { e.stopPropagation(); changeLanguage('fr'); }}>
                  <span className="text-lg">🇫🇷</span> 
                  <span className={`${i18n.language === 'fr' ? 'font-bold text-blue-600' : labelColor}`}>Français</span>
                  {i18n.language === 'fr' && <Check className="w-4 h-4 text-blue-500 ml-auto" />}
                </li>
                <li className={`flex items-center gap-3 cursor-pointer p-2 rounded-xl ${i18n.language === 'en' ? 'bg-blue-50 dark:bg-blue-900/30' : 'hover:bg-slate-50 dark:hover:bg-slate-600'}`} onClick={(e) => { e.stopPropagation(); changeLanguage('en'); }}>
                  <span className="text-lg">🇬🇧</span> 
                  <span className={`${i18n.language === 'en' ? 'font-bold text-blue-600' : labelColor}`}>English</span>
                  {i18n.language === 'en' && <Check className="w-4 h-4 text-blue-500 ml-auto" />}
                </li>
                <li className={`flex items-center gap-3 cursor-pointer p-2 rounded-xl ${i18n.language === 'mg' ? 'bg-blue-50 dark:bg-blue-900/30' : 'hover:bg-slate-50 dark:hover:bg-slate-600'}`} onClick={(e) => { e.stopPropagation(); changeLanguage('mg'); }}>
                  <span className="text-lg">🇲🇬</span> 
                  <span className={`${i18n.language === 'mg' ? 'font-bold text-blue-600' : labelColor}`}>Malagasy</span>
                  {i18n.language === 'mg' && <Check className="w-4 h-4 text-blue-500 ml-auto" />}
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Configuration */}
      <h3 className={`text-lg font-bold mb-4 ml-2 ${headingColor}`}>{t('settings.configuration')}</h3>
      <div className={`${sectionBg} rounded-2xl p-2 mb-8 transition-colors duration-300`}>
        <div className={`flex items-center gap-4 p-4 border-b ${dividerColor} cursor-pointer`}>
          <Link className={`w-6 h-6 ${iconColor}`} />
          <p className={`font-medium ${labelColor}`}>{t('settings.api_url')}</p>
        </div>
        <div className="flex items-center gap-4 p-4 cursor-pointer">
          <Check className={`w-6 h-6 ${iconColor}`} />
          <p className={`font-medium ${labelColor}`}>{t('settings.check_conn')}</p>
        </div>
      </div>

      {/* À propos */}
      <h3 className={`text-lg font-bold mb-4 ml-2 ${headingColor}`}>{t('settings.about')}</h3>
      <div className={`${sectionBg} rounded-2xl p-2 transition-colors duration-300`}>
        <div className="flex items-center gap-4 p-4">
          <Info className={`w-6 h-6 ${iconColor}`} />
          <div>
            <p className={`font-medium ${labelColor}`}>{t('settings.version')}</p>
            <p className={`text-sm ${subColor}`}>1.0.0</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Settings;
