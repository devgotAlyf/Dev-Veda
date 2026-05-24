'use client';

import React from 'react';
import { useToastStore } from '../../hooks/useToast';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { ToastVariant } from '../../types';

const variants = {
  success: { bg: 'bg-sage', text: 'text-white', icon: <CheckCircle size={20} className="mr-3" /> },
  error: { bg: 'bg-rose', text: 'text-white', icon: <AlertCircle size={20} className="mr-3" /> },
  info: { bg: 'bg-navy', text: 'text-cream', icon: <Info size={20} className="mr-3 text-amber" /> },
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  return (
    <>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
        {toasts.map((toast) => {
          const config = variants[toast.variant];
          
          return (
            <div
              key={toast.id}
              className={`${config.bg} ${config.text} px-4 py-3 rounded-lg shadow-lifted flex items-center min-w-[300px] animate-in slide-in-from-bottom-5 fade-in duration-300 relative overflow-hidden group`}
            >
              {config.icon}
              <p className="flex-1 font-sans text-sm font-medium pr-6">{toast.message}</p>
              
              <button
                onClick={() => removeToast(toast.id)}
                className="opacity-70 hover:opacity-100 transition-opacity p-1"
              >
                <X size={16} />
              </button>

              {/* Progress bar for auto-dismiss (4s) */}
              <div 
                className="absolute bottom-0 left-0 h-1 bg-white/30"
                style={{ animation: 'toast-progress 4s linear forwards' }}
              />
            </div>
          );
        })}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes toast-progress {
          0% { width: 100%; }
          100% { width: 0%; }
        }
      `}} />
    </>
  );
};
