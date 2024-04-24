import { AlertProps, SnackbarProps } from '@mui/material';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type SnackbarState = {
  isOpen: SnackbarProps['open'];
  message: SnackbarProps['message'];
  severity: AlertProps['severity'];
};

const initialState: SnackbarState = {
  isOpen: false,
  message: null,
  severity: 'info',
};

const snackbar = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    openSnackbar: (
      state: SnackbarState,
      action: PayloadAction<Pick<SnackbarState, 'message' | 'severity'>>,
    ) => {
      state.isOpen = true;
      state.message = action.payload.message;
      state.severity = action.payload.severity;
    },
    closeSnackbar: (state: SnackbarState) => {
      state.isOpen = false;
    },
  },
});

export const { openSnackbar, closeSnackbar } = snackbar.actions;
export default snackbar.reducer;
