import { useState, useCallback } from 'react';
import { Toast, ToastType } from '../types/toast';
import { createToast, dismissToast } from '../lib/utils/toast';

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const toast = createToast(message, type);
    setToasts(prev => [...prev, toast]);
    
    setTimeout(() => {
      setToasts(prev => dismissToast(prev, toast.id));
    }, 3000);
  }, []);

  return { toasts, showToast };
}