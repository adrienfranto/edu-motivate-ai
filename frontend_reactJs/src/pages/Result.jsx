import React from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Home, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (!location.state || !location.state.results) {
    return <Navigate to="/" />;
  }

  const { results } = location.state;
  const isAdmis = results.predicted_class === 1;
  const confidence = results.probability_class_1 * 100;
  const nonAdmisConfidence = 100 - confidence;

  return (
    <div className="pb-24 animate-fade-in relative">
      {/* Top Status Card */}
      <div className="flex justify-center mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-8 flex flex-col items-center min-w-[200px] transition-colors duration-300">
          {isAdmis ? (
            <div className="bg-[#4CAF50] rounded-full p-2 mb-3 shadow-md">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          ) : (
            <div className="bg-[#FF9800] rounded-full p-2 mb-3 shadow-md">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          )}
          <h2 className={`text-2xl font-bold mb-1 ${isAdmis ? 'text-[#4CAF50]' : 'text-[#FF9800]'}`}>
            {isAdmis ? t('result.admitted') : t('result.not_admitted')}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            {t('result.confidence')}: {confidence.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Probabilité Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 mb-6 transition-colors duration-300">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">{t('result.probability')}</h3>
        
        <div className="space-y-5">
          <div>
            <div className="flex justify-between text-sm mb-2 font-medium text-slate-700 dark:text-slate-300">
              <span>{t('result.admitted')}: {confidence.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-[#4CAF50] h-4 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${confidence}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2 font-medium text-slate-700 dark:text-slate-300">
              <span>{t('result.not_admitted')}: {nonAdmisConfidence.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-[#FF9800] h-4 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${nonAdmisConfidence}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommandations Card — shown only if backend returns recommendations */}
      {results.recommendations && results.recommendations.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 transition-colors duration-300">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{t('result.recommendations')}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{t('result.reco_subtitle')}</p>
          
          <div className="space-y-4">
            {results.recommendations.map((rec, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-7 h-7 bg-[#2196F3] text-white rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
                    {index + 1}
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[15px] leading-relaxed">
                  {rec.Recommandation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-700 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40">
        <div className="max-w-4xl mx-auto flex gap-3">
          <button 
            onClick={() => navigate('/prediction')}
            className="flex-1 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold py-3 px-4 rounded-full flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="w-5 h-5 text-blue-500" />
            <span className="text-blue-500">{t('result.new_prediction')}</span>
          </button>
          <button 
            onClick={() => navigate('/')}
            className="flex-1 bg-[#2196F3] hover:bg-blue-600 active:bg-blue-700 text-white font-semibold py-3 px-4 rounded-full flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <Home className="w-5 h-5" />
            {t('result.home')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;
