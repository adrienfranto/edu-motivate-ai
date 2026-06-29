import React from 'react';
import { Target, CheckCircle2, AlertCircle, BarChart3, List, ChevronRight } from 'lucide-react';

const ResultsDisplay = ({ results }) => {
  if (!results) return null;

  const {
    predicted_class,
    probability_class_1,
    logit_score,
    factor_scores,
    contributions,
    recommendations,
  } = results;

  const isHighPerformance = predicted_class === 1;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Résultat Principal */}
      <div className={`p-6 rounded-2xl border shadow-sm ${
        isHighPerformance 
          ? 'bg-emerald-50 border-emerald-200' 
          : 'bg-amber-50 border-amber-200'
      }`}>
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl ${isHighPerformance ? 'bg-emerald-100' : 'bg-amber-100'}`}>
            {isHighPerformance ? (
              <CheckCircle2 className={`w-8 h-8 text-emerald-600`} />
            ) : (
              <AlertCircle className={`w-8 h-8 text-amber-600`} />
            )}
          </div>
          <div>
            <h3 className={`text-lg font-bold ${isHighPerformance ? 'text-emerald-800' : 'text-amber-800'}`}>
              Résultat de la prédiction
            </h3>
            <p className={`text-2xl font-extrabold mt-1 ${isHighPerformance ? 'text-emerald-700' : 'text-amber-700'}`}>
              Classe prédite : {predicted_class} — Performance {isHighPerformance ? 'élevée' : 'moyenne'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-white/60 p-4 rounded-xl">
            <p className="text-sm font-medium text-slate-500 mb-1">Probabilité (Perform. élevée)</p>
            <p className="text-2xl font-bold text-slate-800">
              {(probability_class_1 * 100).toFixed(1)}%
            </p>
          </div>
          <div className="bg-white/60 p-4 rounded-xl">
            <p className="text-sm font-medium text-slate-500 mb-1">Score Logistique</p>
            <p className="text-2xl font-bold text-slate-800">
              {logit_score.toFixed(3)}
            </p>
          </div>
        </div>
      </div>

      {/* Scores Factoriels & Contributions */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-500" />
          <h3 className="font-bold text-slate-800">Contributions des dimensions</h3>
        </div>
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-500 bg-slate-50 uppercase">
              <tr>
                <th className="px-6 py-3 font-medium">Dimension</th>
                <th className="px-6 py-3 font-medium">Score Factoriel</th>
                <th className="px-6 py-3 font-medium">Coef Logistique</th>
                <th className="px-6 py-3 font-medium">Contribution au logit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {contributions.map((row, idx) => {
                const isNegative = row['Contribution au logit'] < 0;
                return (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">
                      <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs mr-2">{row['Dimension']}</span>
                      {row['Nom scientifique']}
                    </td>
                    <td className="px-6 py-4">{row['Score factoriel'].toFixed(3)}</td>
                    <td className="px-6 py-4">{row['Coefficient logistique'].toFixed(3)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded-md font-medium text-xs ${
                        isNegative ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {row['Contribution au logit'].toFixed(3)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommandations */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-500" />
          <h3 className="font-bold text-slate-800">Recommandations personnalisées</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="mt-1">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                    isHighPerformance ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {idx + 1}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-slate-800">{rec['Priorité']}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-500">{rec['Dimension']}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    {rec['Recommandation']}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
