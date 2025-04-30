import api from '../config/api';

export const vacancyService = {
  getAllVacancies: async (params) => {
    try {
      const response = await api.get('/vacancies', { params });
      return {
        data: response.data.data,
        recordsTotal: response.data.recordsTotal,
        recordsFiltered: response.data.recordsFiltered,
        draw: response.data.draw
      };
    } catch (error) {
      throw error;
    }
  },

  getVacancyById: async (id) => {
    try {
      const response = await api.get(`/vacancies/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createVacancy: async (vacancyData) => {
    try {
      const response = await api.post('/vacancies', vacancyData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateVacancy: async (id, vacancyData) => {
    try {
      const response = await api.put(`/vacancies/${id}`, vacancyData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteVacancy: async (id) => {
    try {
      const response = await api.delete(`/vacancies/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}; 