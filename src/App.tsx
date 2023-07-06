import { Box, Button } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { useCallback } from 'react';
import { CONNECTIONS } from './connection/utils';
import { useConnectWallet } from './hooks/useConnectWallet';
import { setSelectedWallet } from './store/appSlice';
import { useAppDispatch } from './store/hooks';

export const App = (): JSX.Element => {
  const { mutate } = useConnectWallet();
  const { account, connector } = useWeb3React();
  const dispatch = useAppDispatch();

  const handleDisconnect = useCallback(() => {
    if (connector.deactivate) {
      connector.deactivate();
    }

    dispatch(setSelectedWallet(undefined));

    connector.resetState();
  }, [connector, dispatch]);

  return (
    <>
      <Box display={'flex'} flexDirection={'column'} gap={6}>
        {!account ? (
          CONNECTIONS.map((connection) => (
            <Button variant={'contained'} key={connection.type} onClick={(): void => mutate(connection)}>
              {connection.type}
            </Button>
          ))
        ) : (
          <>
            {`Connected to ${connector.provider}`}
            <Button variant={'contained'} onClick={handleDisconnect}>
              {'disconnect'}
            </Button>
          </>
        )}
      </Box>
    </>
  );
};
