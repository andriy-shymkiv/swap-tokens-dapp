import { Box, Button } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { useCallback } from 'react';
import { AVAILABLE_CONNECTIONS } from './walletActions/connections';
import { useConnectWallet } from './hooks/useConnectWallet';
import { setSelectedWallet } from './store/appSlice';
import { useAppDispatch } from './store/hooks';

export const App = (): JSX.Element => {
  const { mutate } = useConnectWallet();
  const { account, connector } = useWeb3React();
  const dispatch = useAppDispatch();

  const handleDisconnect = useCallback(() => {
    if (connector.deactivate) connector.deactivate();

    dispatch(setSelectedWallet(undefined));
    connector.resetState();
  }, [connector, dispatch]);

  return (
    <>
      <Box display={'flex'} flexDirection={'column'} gap={6}>
        {!account ? (
          AVAILABLE_CONNECTIONS.map((connection) => (
            <Button variant={'contained'} key={connection.type} onClick={(): void => mutate(connection)}>
              {connection.type}
            </Button>
          ))
        ) : (
          <Box display={'flex'} alignItems={'center'} flexDirection={'column'} gap={4}>
            {'Connected'}
            <Button variant={'contained'} onClick={handleDisconnect}>
              {'disconnect'}
            </Button>
          </Box>
        )}
      </Box>
    </>
  );
};
