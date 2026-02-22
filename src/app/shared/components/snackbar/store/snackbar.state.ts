export type SnackbarVariant = 'success' | 'error' | 'info';

export interface SnackbarItem {
  id: string;
  message: string;
  variant: SnackbarVariant;
  duration: number;
}

export interface SnackbarState {
  queue: SnackbarItem[];
  visible: SnackbarItem[];
}

export const initialSnackbarState: SnackbarState = {
  queue: [],
  visible: [],
};
