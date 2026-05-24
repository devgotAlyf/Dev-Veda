import axios from 'axios';
import { GeneratedPaper } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
});

export const createAssignment = async (formData: FormData): Promise<{ success: boolean; assignmentId: string; jobId: string }> => {
  try {
    const response = await api.post('/assignments', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.errors) {
      const messages = error.response.data.errors.map((e: any) => `${e.field}: ${e.message}`).join(', ');
      throw new Error(`Validation Error: ${messages}`);
    }
    throw new Error(error.response?.data?.error || 'Failed to create assignment');
  }
};

export const getAssignment = async (id: string) => {
  try {
    const response = await api.get(`/assignments/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to fetch assignment');
  }
};

export const getAssignments = async () => {
  try {
    const response = await api.get('/assignments');
    return response.data.assignments;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to fetch assignments');
  }
};

export const getResult = async (assignmentId: string): Promise<GeneratedPaper> => {
  try {
    const response = await api.get(`/results/${assignmentId}`);
    return response.data.result;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to fetch result');
  }
};

export const regenerateResult = async (assignmentId: string): Promise<{ success: boolean; jobId: string }> => {
  try {
    const response = await api.post(`/results/${assignmentId}/regenerate`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to regenerate result');
  }
};

export const getResultPdfUrl = (assignmentId: string): string => {
  return `${API_URL}/results/${assignmentId}/pdf`;
};
