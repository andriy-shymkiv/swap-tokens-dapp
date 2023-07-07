import { Box } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { useCallback } from 'react';
import { getEllipsisString } from '~/helpers/utils';
import { AppScreen, setAppScreen, setSelectedWallet } from '~/store/appSlice';
import { useAppDispatch } from '~/store/hooks';
import { PrimaryButton } from './common/PrimaryButton';

export const SwapTokensScreen: React.FC = (): JSX.Element => {
  const { account, connector } = useWeb3React();
  const dispatch = useAppDispatch();

  const handleDisconnect = useCallback(() => {
    if (connector.deactivate) connector.deactivate();

    dispatch(setAppScreen(AppScreen.INITIAL));
    dispatch(setSelectedWallet(undefined));
    connector.resetState();
  }, [connector, dispatch]);

  return (
    <>
      <Box display={'flex'} alignItems={'center'} flexDirection={'column'} gap={4}>
        {`Account address: ${getEllipsisString(account)}`}

        <PrimaryButton fullWidth variant={'contained'} onClick={handleDisconnect}>
          {'disconnect'}
        </PrimaryButton>
      </Box>
    </>
  );
};
