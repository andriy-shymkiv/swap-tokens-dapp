import { createSlice } from '@reduxjs/toolkit';
import { Token } from '~/types/tokens';
import { USDC_TOKEN } from '~/utils/constants';
import { CHAINS } from '~/walletActions/chains';
import { ChainId, ConnectionType } from '../walletActions/types';

export enum AppScreen {
  INITIAL = 'INITIAL',
  CHOOSE_WALLET = 'CHOOSE_WALLET',
  SWAP_TOKENS = 'SWAP_TOKENS',
  SELECT_YOU_PAY_TOKEN = 'SELECT_YOU_PAY_TOKEN',
  SELECT_YOU_RECEIVE_TOKEN = 'SELECT_YOU_RECEIVE_TOKEN',
}

export interface AppState {
  selectedChainId: ChainId;
  selectedWallet: ConnectionType | undefined;
  screen: AppScreen;
  youPay: { amount: string; token: Token };
  youReceive: { amount: string; token: Token };
}

const initialState: AppState = {
  selectedChainId: ChainId.MAINNET,
  selectedWallet: undefined,
  screen: AppScreen.INITIAL,
  youPay: { amount: '', token: CHAINS[ChainId.MAINNET].nativeToken },
  youReceive: { amount: '', token: USDC_TOKEN[ChainId.MAINNET] },
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setSelectedWallet: (state: AppState, { payload }: { payload: ConnectionType | undefined }) => {
      state.selectedWallet = payload;
    },
    setAppScreen: (state: AppState, { payload }: { payload: AppScreen }) => {
      state.screen = payload;
    },
  },
});

export const { setSelectedWallet, setAppScreen } = appSlice.actions;

export default appSlice.reducer;
