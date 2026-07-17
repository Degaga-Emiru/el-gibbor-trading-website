import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  showToast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((type: ToastType, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    
    // Auto-remove toast after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast container */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        {toasts.map((toast) => {
          let bgColor = 'bg-white';
          let borderColor = 'border-slate-200';
          let textColor = 'text-[#1E293B]';
          let icon = <Info className="h-5 w-5 text-blue-500" />;

          switch (toast.type) {
            case 'success':
              bgColor = 'bg-emerald-50';
              borderColor = 'border-emerald-200';
              textColor = 'text-emerald-950';
              icon = <CheckCircle className="h-5 w-5 text-emerald-600" />;
              break;
            case 'error':
              bgColor = 'bg-red-50';
              borderColor = 'border-red-200';
              textColor = 'text-red-950';
              icon = <AlertCircle className="h-5 w-5 text-red-600" />;
              break;
            case 'warning':
              bgColor = 'bg-amber-50';
              borderColor = 'border-amber-200';
              textColor = 'text-amber-950';
              icon = <AlertTriangle className="h-5 w-5 text-amber-600" />;
              break;
            case 'info':
              bgColor = 'bg-blue-50';
              borderColor = 'border-blue-200';
              textColor = 'text-blue-950';
              icon = <Info className="h-5 w-5 text-blue-600" />;
              break;
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 border rounded-2xl shadow-lg transition-all duration-300 transform translate-x-0 ${bgColor} ${borderColor} ${textColor}`}
              style={{ animation: 'slideIn 0.3s ease-out' }}
            >
              <div className="shrink-0 mt-0.5">{icon}</div>
              <div className="flex-grow text-xs font-semibold leading-relaxed">
                {toast.message}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Embedded keyframe animation */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100%) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
