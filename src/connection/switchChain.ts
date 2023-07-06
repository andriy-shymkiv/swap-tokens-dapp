import { Connector } from '@web3-react/types';
import { assert } from 'ts-essentials';
import { CHAINS, URLS } from './chains';
import { networkConnection } from './connectors/network';
import { walletConnectConnection } from './connectors/walletConnect';
import { ChainId } from './types';

export function isSupportedChain(chainId: ChainId): chainId is ChainId {
  return !!chainId && !!CHAINS[chainId];
}

export const switchChain = async (connector: Connector, chainId: ChainId): Promise<void> => {
  assert(isSupportedChain(chainId), `Unsupported chainId: ${chainId}`);

  if (connector === walletConnectConnection.connector || connector === networkConnection.connector) {
    await connector.activate(chainId);
  } else {
    await connector.activate({
      chainId: Number(chainId),
      chainName: CHAINS[chainId].name,
      rpcUrls: URLS[chainId],
      nativeCurrency: CHAINS[chainId].nativeCurrency,
      blockExplorerUrls: [CHAINS[chainId].blockExplorerUrls],
    });
  }
};
