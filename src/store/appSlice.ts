import { createSlice } from '@reduxjs/toolkit';
import { ConnectionType } from '../connection/types';

export interface AppState {
  selectedWallet: ConnectionType | undefined;
}

const initialState: AppState = {
  selectedWallet: undefined,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setSelectedWallet: (state: AppState, { payload }: { payload: ConnectionType | undefined }) => {
      state.selectedWallet = payload;
    },
  },
});

export const { setSelectedWallet } = appSlice.actions;

export default appSlice.reducer;
