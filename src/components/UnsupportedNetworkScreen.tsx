import { Box, ButtonBase, Typography, styled } from '@mui/material';
import { CHAINS } from '~/walletActions/chains';
import { ChainId } from '~/walletActions/types';
import { ErrorCommon } from './common/ErrorCommon';
import { useSwitchNetwork } from '~/hooks/useSwitchNetwork';
import { useCallback } from 'react';

const StyledButton = styled(ButtonBase, {
  name: 'StyledButton',
})(({ theme }) => ({
  fontSize: 'inherit',
  textDecoration: 'underline',
  color: theme.palette.info.main,
}));

export const UnsupportedNetworkScreen = ({
  networkToSwitch = ChainId.MAINNET,
}: {
  networkToSwitch?: ChainId;
}): JSX.Element => {
  const switchNetwork = useSwitchNetwork();

  const onClick = useCallback(() => {
    switchNetwork(networkToSwitch);
  }, [networkToSwitch, switchNetwork]);

  return (
    <ErrorCommon
      message={
        <Box textAlign={'center'}>
          {`Current network is not supported, click`}{' '}
          <StyledButton onClick={onClick}>
            <Typography>{'here'}</Typography>
          </StyledButton>{' '}
          {`to switch to ${CHAINS[networkToSwitch].name}.`}
        </Box>
      }
    />
  );
};
