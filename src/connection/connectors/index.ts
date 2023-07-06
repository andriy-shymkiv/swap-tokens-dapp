import { initializeConnector, Web3ReactHooks } from '@web3-react/core';
import { Network } from '@web3-react/network';
import { Connector } from '@web3-react/types';
import { URLS } from '../chains';
import { coinbaseWallet, hooks as coinbaseWalletHooks } from './coinbaseWallet';
import { hooks as metaMaskHooks, metaMask } from './metaMask';
import { hooks as walletConnectHooks, walletConnect } from './walletConnect';

const [network, networkHooks] = initializeConnector<Network>((actions) => new Network({ actions, urlMap: URLS }));

export const connectors: [Connector, Web3ReactHooks][] = [
  [metaMask, metaMaskHooks],
  [walletConnect, walletConnectHooks],
  [coinbaseWallet, coinbaseWalletHooks],
  [network, networkHooks],
];
