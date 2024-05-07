import { useWeb3React } from '@web3-react/core';
import { useCallback } from 'react';
import { assert } from 'ts-essentials';
import { isSupportedChain } from '~/helpers/utils';
import { CHAINS, URLS } from '~/walletActions/chains';
import { CONNECTIONS } from '~/walletActions/connections';
import { ChainId, ConnectionType } from '~/walletActions/types';

type SwitchNetwork = (chainId: ChainId) => Promise<void>;

export const useSwitchNetwork = (): SwitchNetwork => {
  const { connector } = useWeb3React();

  const switchNetwork = useCallback(
    async (chainId: ChainId): Promise<void> => {
      assert(isSupportedChain(chainId), `Unsupported chainId: ${chainId}`);

      if (
        connector === CONNECTIONS[ConnectionType.WALLET_CONNECT]?.connector ||
        connector === CONNECTIONS[ConnectionType.NETWORK]?.connector
      ) {
        await connector.activate(chainId);
      } else {
        await connector.activate({
          chainId: Number(chainId),
          chainName: CHAINS[chainId].name,
          rpcUrls: URLS[chainId],
          nativeCurrency: CHAINS[chainId].nativeToken,
          blockExplorerUrls: [CHAINS[chainId].blockExplorerUrls],
        });
      }
    },
    [connector],
  );

  return switchNetwork;
};
