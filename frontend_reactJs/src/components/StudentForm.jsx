import React, { useState } from 'react';
import { Send, User, BookOpen, Activity } from 'lucide-react';

const OPTIONS = {
  SX: [0, 1],
  AG: [0, 1, 2],
  SERIE_BAC: [0, 1, 2, 3],
  MENT_BAC: [0, 1, 2, 3],
  MOT_MAST: [0, 1, 2, 3],
  EMP_ETU: [0, 1],
  CLUB_ASS: [0, 1],
  TMP_ETU: [0, 1, 2, 3],
  TMP_LOIS: [0, 1, 2, 3],
  COURS_SUP: [0, 1],
  TRAV_GRP: [0, 1],
  MAT_REDOUB: [0, 1, 2, 3, 4, 5],
  NB_FR_SR: [0, 1, 2],
  NIV_PERE: [0, 1, 2, 3],
  NIV_MERE: [0, 1, 2, 3],
  STAT_PARENT: [0, 1, 2],
  SIT_ECO: [0, 1, 2, 3],
  LIEU_RES: [0, 1, 2],
  PRI_TACH: [0, 1, 2],
  INFO: [0, 1, 2],
  ID_NUM: [0, 1, 2, 3],
  NTIC: [0, 1, 2, 3],
  IA: [0, 1, 2, 3],
  COM_SC: [0, 1, 2, 3],
};

const LABELS = {
  SX: 'Sexe',
  AG: 'Age',
  SERIE_BAC: 'Série du Bac',
  MENT_BAC: 'Mention au Bac',
  MOT_MAST: 'Motivation Master',
  EMP_ETU: 'Emploi étudiant',
  CLUB_ASS: 'Club/Assoc',
  TMP_ETU: 'Temps étude',
  TMP_LOIS: 'Temps loisirs',
  COURS_SUP: 'Cours supp',
  TRAV_GRP: 'Travail groupe',
  MAT_REDOUB: 'Matières redoublées',
  NB_FR_SR: 'Nb frères/sœurs',
  NIV_PERE: 'Niv acad. père',
  NIV_MERE: 'Niv acad. mère',
  STAT_PARENT: 'Statut parents',
  SIT_ECO: 'Situation éco',
  LIEU_RES: 'Lieu résidence',
  PRI_TACH: 'Priorité tâches',
  INFO: 'Informatique',
  ID_NUM: 'Identité num',
  NTIC: 'NTIC',
  IA: 'Compétences IA',
  COM_SC: 'Comm scientifique',
};

const GROUPS = [
  {
    title: 'Profil Personnel & Socio-démographique',
    icon: <User className="w-5 h-5 text-indigo-500" />,
    fields: ['SX', 'AG', 'NB_FR_SR', 'NIV_PERE', 'NIV_MERE', 'STAT_PARENT', 'SIT_ECO', 'LIEU_RES'],
  },
  {
    title: 'Parcours & Organisation',
    icon: <BookOpen className="w-5 h-5 text-emerald-500" />,
    fields: ['SERIE_BAC', 'MENT_BAC', 'MOT_MAST', 'EMP_ETU', 'CLUB_ASS', 'TMP_ETU', 'TMP_LOIS', 'PRI_TACH'],
  },
  {
    title: 'Apprentissage & Numérique',
    icon: <Activity className="w-5 h-5 text-amber-500" />,
    fields: ['COURS_SUP', 'TRAV_GRP', 'MAT_REDOUB', 'INFO', 'ID_NUM', 'NTIC', 'IA', 'COM_SC'],
  },
];

const StudentForm = ({ onSubmit, loading }) => {
  const initialState = Object.keys(OPTIONS).reduce((acc, key) => {
    acc[key] = OPTIONS[key][0];
    return acc;
  }, {});

  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseInt(value, 10),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 bg-slate-50">
        <h3 className="text-xl font-bold text-slate-800">Saisie du profil étudiant</h3>
        <p className="text-sm text-slate-500 mt-1">
          Sélectionnez les valeurs correspondantes selon le codage de l'enquête.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-8">
          {GROUPS.map((group, idx) => (
            <div key={idx} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-50">
                {group.icon}
                <h4 className="font-semibold text-slate-700">{group.title}</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {group.fields.map((field) => (
                  <div key={field} className="flex flex-col">
                    <label htmlFor={field} className="text-xs font-medium text-slate-600 mb-1.5 truncate">
                      {LABELS[field]}
                    </label>
                    <select
                      id={field}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className="bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors hover:bg-slate-100 cursor-pointer"
                    >
                      {OPTIONS[field].map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white transition-all shadow-md
              ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]'}`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Analyse en cours...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Analyser le profil
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;
