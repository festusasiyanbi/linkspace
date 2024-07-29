export interface ToastProviderProps {
    delay?: number;
    type: 'error' | 'success' | 'info' | 'warning';
    text1: string;
    text2?: string;
  }