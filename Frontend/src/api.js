const API_BASE_URL = import.meta.env.DEV
  ? '/api' // proxy en desarrollo (localhost)
  : 'https://backend-5j48usd29-emmanuels-projects-d9e6d035.vercel.app/api'; // URL real en producción

export default API_BASE_URL;
