import axios from 'axios';

// Base URL configuration
const API_BASE_URL = '/api/v1';

// API Client
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Health & Info API
export const healthApi = {
  checkHealth: () => axios.get('/api/health'),
  getInfo: () => axios.get('/api/info'),
};

// Client API
export const clientApi = {
  createClient: (clientData) => apiClient.post('/clients', clientData),
  getAllClients: () => apiClient.get('/clients'),
  getClientById: (id) => apiClient.get(`/clients/${id}`),
};

// Offering API
export const offeringApi = {
  createOffering: (offeringData) => apiClient.post('/offerings', offeringData),
  getAllOfferings: () => apiClient.get('/offerings'),
  getOfferingById: (id) => apiClient.get(`/offerings/${id}`),
};

// Question API
export const questionApi = {
  createQuestion: (questionData) => apiClient.post('/questions', questionData),
  getAllQuestions: () => apiClient.get('/questions'),
  getQuestionById: (id) => apiClient.get(`/questions/${id}`),
};

// Question Weights API
export const questionWeightsApi = {
  createQuestionWeights: (weightsData) => apiClient.post('/question-weights', weightsData),
  getQuestionWeights: (questionId) => apiClient.get(`/question-weights/${questionId}`),
  updateQuestionWeights: (questionId, weightsData) => apiClient.put(`/question-weights/${questionId}`, weightsData),
};

// Submission API
export const submissionApi = {
  createSubmissions: (submissionsData) => apiClient.post('/submissions', submissionsData),
  getSubmissionsByClient: (clientId) => apiClient.get(`/submissions/${clientId}`),
};

export default apiClient;
