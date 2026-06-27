const getApiBaseUrl = () => {
  if (window.location.hostname.includes('vercel.app')) {
    return 'https://hamstudio-backend.onrender.com';
  }
  return '';
};

export const API_BASE_URL = getApiBaseUrl();
