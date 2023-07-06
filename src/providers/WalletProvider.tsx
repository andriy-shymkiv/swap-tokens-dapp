import { Web3ReactProvider } from '@web3-react/core';

import { ReactNode } from 'react';
import useEagerlyConnect from '~/hooks/useEagerlyConnect';
import { connectors } from '../connection/connectors';

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider = ({ children }: WalletProviderProps): JSX.Element => {
  useEagerlyConnect();

  return <Web3ReactProvider connectors={connectors}>{children}</Web3ReactProvider>;
};
