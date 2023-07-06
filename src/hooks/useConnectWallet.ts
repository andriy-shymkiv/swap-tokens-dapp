import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { Connector } from '@web3-react/types';
import { useCallback, useMemo } from 'react';
import { Connection } from '~/connection/types';
import { getConnection } from '~/connection/utils';
import { setSelectedWallet } from '~/store/appSlice';
import { useAppDispatch } from '~/store/hooks';

type UseConnectWalletCallbacks = Pick<
  UseMutationOptions<Connector, Error, Connection>,
  'onMutate' | 'onSuccess' | 'onError'
>;

export const constructWalletConnectKey = (): any[] => ['walletConnect'];

export const useConnectWallet = (): UseMutationResult<Connector, Error, Connection> => {
  const dispatch = useAppDispatch();

  const connectWallet = useCallback(async ({ connector }: { connector: Connector }): Promise<Connector> => {
    await connector.activate();

    return connector;
  }, []);

  const callbacks: UseConnectWalletCallbacks = useMemo(
    () => ({
      onSuccess: (connector: Connector): void => {
        const connection = getConnection(connector);
        dispatch(setSelectedWallet(connection?.type));
      },
      onError: (): void => {
        console.error('error connecting wallet');
        dispatch(setSelectedWallet(undefined));
      },
    }),
    [dispatch],
  );

  return useMutation<Connector, Error, Connection>(constructWalletConnectKey(), connectWallet, callbacks);
};
