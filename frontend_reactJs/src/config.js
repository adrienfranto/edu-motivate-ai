// Configuration centralisée de l'API
// En développement local : http://127.0.0.1:8000
// En production (Render) : https://edu-motivate-ai.onrender.com

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://edu-motivate-ai.onrender.com';

export default API_BASE_URL;
