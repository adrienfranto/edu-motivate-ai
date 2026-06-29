import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FIELDS = [
  { id: 'SX', label: '1. Sexe', options: [{val: 0, text: 'Masculin'}, {val: 1, text: 'Féminin'}] },
  { id: 'AG', label: '2. Age', options: [{val: 0, text: 'Moins de 20 ans'}, {val: 1, text: '20-25 ans'}, {val: 2, text: 'Plus de 25 ans'}] },
  { id: 'SERIE_BAC', label: '3. Série du Baccalauréat', options: [{val: 0, text: 'L'}, {val: 1, text: 'S'}, {val: 2, text: 'ES'}, {val: 3, text: 'Autre'}] },
  { id: 'MENT_BAC', label: '4. Mention au Baccalauréat', options: [{val: 0, text: 'Passable'}, {val: 1, text: 'Assez Bien'}, {val: 2, text: 'Bien'}, {val: 3, text: 'Très Bien'}] },
  { id: 'MOT_MAST', label: '5. Motivation pour le Master', options: [{val: 0, text: 'Faible'}, {val: 1, text: 'Moyenne'}, {val: 2, text: 'Forte'}, {val: 3, text: 'Très Forte'}] },
  { id: 'EMP_ETU', label: '6. Emploi à côté des études', options: [{val: 0, text: 'Non'}, {val: 1, text: 'Oui'}] },
  { id: 'CLUB_ASS', label: '7. Club ou association étudiante', options: [{val: 0, text: 'Non'}, {val: 1, text: 'Oui'}] },
  { id: 'TMP_ETU', label: '8. Temps d\'étude personnel', options: [{val: 0, text: 'Faible'}, {val: 1, text: 'Moyen'}, {val: 2, text: 'Élevé'}, {val: 3, text: 'Très élevé'}] },
  { id: 'TMP_LOIS', label: '9. Temps loisirs / réseaux sociaux', options: [{val: 0, text: 'Faible'}, {val: 1, text: 'Moyen'}, {val: 2, text: 'Élevé'}, {val: 3, text: 'Très élevé'}] },
  { id: 'COURS_SUP', label: '10. Cours supplémentaires', options: [{val: 0, text: 'Non'}, {val: 1, text: 'Oui'}] },
  { id: 'TRAV_GRP', label: '11. Travail en groupe', options: [{val: 0, text: 'Non'}, {val: 1, text: 'Oui'}] },
  { id: 'MAT_REDOUB', label: '12. Matières redoublées', options: [{val: 0, text: '0'}, {val: 1, text: '1'}, {val: 2, text: '2'}, {val: 3, text: '3'}, {val: 4, text: '4'}, {val: 5, text: '5+'}] },
  { id: 'NB_FR_SR', label: '13. Nombre de frères et sœurs', options: [{val: 0, text: '0'}, {val: 1, text: '1 à 2'}, {val: 2, text: '3 ou plus'}] },
  { id: 'NIV_PERE', label: '14. Niveau académique du père', options: [{val: 0, text: 'Aucun/Primaire'}, {val: 1, text: 'Moyen'}, {val: 2, text: 'Secondaire'}, {val: 3, text: 'Supérieur'}] },
  { id: 'NIV_MERE', label: '15. Niveau académique de la mère', options: [{val: 0, text: 'Aucun/Primaire'}, {val: 1, text: 'Moyen'}, {val: 2, text: 'Secondaire'}, {val: 3, text: 'Supérieur'}] },
  { id: 'STAT_PARENT', label: '16. Statut des parents', options: [{val: 0, text: 'Mariés'}, {val: 1, text: 'Divorcés'}, {val: 2, text: 'Autre'}] },
  { id: 'SIT_ECO', label: '17. Situation économique familiale', options: [{val: 0, text: 'Difficile'}, {val: 1, text: 'Moyenne'}, {val: 2, text: 'Aisée'}, {val: 3, text: 'Très aisée'}] },
  { id: 'LIEU_RES', label: '18. Lieu de résidence familiale', options: [{val: 0, text: 'Rural'}, {val: 1, text: 'Urbain'}, {val: 2, text: 'Métropole'}] },
  { id: 'PRI_TACH', label: '19. Priorisation des tâches', options: [{val: 0, text: 'Faible'}, {val: 1, text: 'Moyenne'}, {val: 2, text: 'Forte'}] },
  { id: 'INFO', label: '20. Informatique et programmation', options: [{val: 0, text: 'Faible'}, {val: 1, text: 'Moyen'}, {val: 2, text: 'Avancé'}] },
  { id: 'ID_NUM', label: '21. Identité numérique', options: [{val: 0, text: 'Faible'}, {val: 1, text: 'Moyenne'}, {val: 2, text: 'Forte'}, {val: 3, text: 'Très forte'}] },
  { id: 'NTIC', label: '22. NTIC', options: [{val: 0, text: 'Faible'}, {val: 1, text: 'Moyen'}, {val: 2, text: 'Fort'}, {val: 3, text: 'Très fort'}] },
  { id: 'IA', label: '23. Compétences numériques et IA', options: [{val: 0, text: 'Débutant'}, {val: 1, text: 'Intermédiaire'}, {val: 2, text: 'Avancé'}, {val: 3, text: 'Expert'}] },
  { id: 'COM_SC', label: '24. Communication scientifique', options: [{val: 0, text: 'Faible'}, {val: 1, text: 'Moyenne'}, {val: 2, text: 'Forte'}, {val: 3, text: 'Très forte'}] }
];

const PredictionForm = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState(
    FIELDS.reduce((acc, field) => {
      acc[field.id] = field.options[0].val;
      return acc;
    }, {})
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseInt(value, 10)
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://127.0.0.1:8000/predict', formData);
      navigate('/result', { state: { results: response.data } });
    } catch (err) {
      console.error(err);
      setError(t('prediction.error_api'));
      setLoading(false);
    }
  };

  return (
    <div className="pb-24 animate-fade-in relative">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {FIELDS.map((field) => (
          <div key={field.id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-300">
            <label className="block text-slate-800 dark:text-slate-100 font-bold mb-3 text-[15px]">
              {field.label}
            </label>
            <div className="relative">
              <select
                name={field.id}
                value={formData[field.id]}
                onChange={handleChange}
                className="w-full appearance-none border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 rounded-xl py-3 px-4 bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
              >
                {field.options.map(opt => (
                  <option key={opt.val} value={opt.val}>{opt.text}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 dark:text-slate-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2 ml-1">{t('prediction.encoded_val')}: {formData[field.id]}</p>
          </div>
        ))}
      </div>

      {/* Sticky Bottom Bar for Submit */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-700 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full bg-[#2196F3] hover:bg-blue-600 active:bg-blue-700 text-white font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Send className="w-5 h-5" />
            )}
            {loading ? t('prediction.analyzing') : t('prediction.submit')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PredictionForm;
