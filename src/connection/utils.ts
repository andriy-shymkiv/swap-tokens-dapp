import { Connector } from '@web3-react/types';
import { assert } from 'ts-essentials';
import { coinbaseConnection } from './connectors/coinbaseWallet';
import { metaMaskConnection } from './connectors/metaMask';
import { networkConnection } from './connectors/network';
import { walletConnectConnection } from './connectors/walletConnect';
import { Connection, ConnectionType } from './types';

export const CONNECTIONS = [metaMaskConnection, coinbaseConnection, walletConnectConnection];

export function getConnection(c: Connector | ConnectionType): Connection | undefined {
  if (c instanceof Connector) {
    const connection = CONNECTIONS.find((connection) => connection.connector === c);
    assert(connection, 'connection is not defined');

    return connection;
  } else {
    switch (c) {
      case ConnectionType.METAMASK:
        return metaMaskConnection;
      case ConnectionType.COINBASE_WALLET:
        return coinbaseConnection;
      case ConnectionType.WALLET_CONNECT:
        return walletConnectConnection;
      case ConnectionType.NETWORK:
        return networkConnection;
    }
  }
}
