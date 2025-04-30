import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error:', error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      return Promise.reject(new Error('No response received from server'));
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', error.message);
      return Promise.reject(error);
    }
  }
);

// Candidates
export const getCandidates = (params) => api.get('/candidates', { params });
export const getCandidate = (id) => api.get(`/candidates/${id}`);
export const createCandidate = (data) => api.post('/candidates', data);
export const updateCandidate = (id, data) => api.put(`/candidates/${id}`, data);
export const deleteCandidate = (id) => api.delete(`/candidates/${id}`);

// Vacancies
export const getVacancies = (params) => api.get('/vacancies', { params });
export const getVacancy = (id) => api.get(`/vacancies/${id}`);
export const createVacancy = (data) => api.post('/vacancies', data);
export const updateVacancy = (id, data) => api.put(`/vacancies/${id}`, data);
export const deleteVacancy = (id) => api.delete(`/vacancies/${id}`);

// Applicants
export const getApplicants = (params) => api.get('/applicants', { params });
export const getApplicant = (id) => api.get(`/applicants/${id}`);
export const createApplicant = (data) => api.post('/applicants', data);
export const updateApplicantStatus = (id, status) =>
  api.put(`/applicants/${id}/status`, { status: status });
export const deleteApplicant = (id) => api.delete(`/applicants/${id}`);

export default api; 