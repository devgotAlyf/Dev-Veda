import { create } from 'zustand';
import { ToastMessage, ToastVariant } from '../types';

interface ToastStore {
  toasts: ToastMessage[];
  addToast: (message: string, variant: ToastVariant) => void;
  removeToast: (id: string) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (message, variant) => {
    const id = generateId();
    set((state) => ({ toasts: [...state.toasts, { id, message, variant }] }));
    
    // Auto remove after 4s
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export function useToast() {
  const addToast = useToastStore((state) => state.addToast);
  
  return {
    toast: (message: string, variant: ToastVariant = 'info') => addToast(message, variant),
    success: (message: string) => addToast(message, 'success'),
    error: (message: string) => addToast(message, 'error'),
    info: (message: string) => addToast(message, 'info'),
  };
}
