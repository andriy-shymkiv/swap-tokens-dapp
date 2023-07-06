import { createSlice } from '@reduxjs/toolkit';
import { ConnectionType } from '../connection/types';

export interface AppState {
  selectedWallet: ConnectionType | undefined;
}

const initialState: AppState = {
  selectedWallet: undefined,
};

export const paymentSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setSelectedWallet: (state: AppState, { payload }: { payload: ConnectionType | undefined }) => {
      state.selectedWallet = payload;
    },
  },
});

export const { setSelectedWallet } = paymentSlice.actions;

export default paymentSlice.reducer;
