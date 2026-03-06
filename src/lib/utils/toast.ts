// Move toast types to a separate types file for reuse
import { Toast, ToastType } from '../../types/toast';

export function createToast(message: string, type: ToastType = 'info'): Toast {
  return {
    id: Date.now(),
    message,
    type
  };
}

export function dismissToast(toasts: Toast[], id: number): Toast[] {
  return toasts.filter(toast => toast.id !== id);
}