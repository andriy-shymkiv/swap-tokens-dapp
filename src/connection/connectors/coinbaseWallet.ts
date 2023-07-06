import { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import { initializeConnector } from '@web3-react/core';
import { CHAINS } from '../chains';
import { ChainId, Connection, ConnectionType } from '../types';

export const [coinbaseWallet, hooks] = initializeConnector<CoinbaseWallet>(
  (actions) =>
    new CoinbaseWallet({
      actions,
      options: {
        url: CHAINS[ChainId.MAINNET].rpcUrls[0] ?? '',
        appName: 'swap-tokens-dapp',
      },
    }),
);

export const coinbaseConnection: Connection = {
  connector: coinbaseWallet,
  type: ConnectionType.COINBASE_WALLET,
};
