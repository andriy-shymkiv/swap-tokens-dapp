import {
  Box,
  Button,
  styled,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { useCallback } from 'react';
import { getEllipsisString } from '~/helpers/utils';
import {
  AppScreen,
  resetState,
  setAppScreen,
  setSelectedWallet,
} from '~/store/appSlice';
import { useAppDispatch } from '~/store/hooks';
import { AssetInput, AssetInputType } from './common/AssetInput/AssetInput';
import { FlipTokensButton } from './common/FlipTokensButton';
import { PrimaryButton } from './common/PrimaryButton';
import { SelectChain } from './SelectChain';
import { useSwapCondition } from '~/hooks/useSwapCondition';
import { useRequestApprove } from '~/hooks/useRequestApprove';
import { useCreateSwapParaswap } from '~/hooks/useCreateSwapParaswap';

const StyledDisconnectButton = styled(Button, {
  name: 'StyledDisconnectButton',
})(({ theme }) => ({
  textTransform: 'none',
  backgroundColor: theme.palette.error.main,
}));

export const SwapTokensScreen: React.FC = (): JSX.Element => {
  const { account, connector } = useWeb3React();
  const dispatch = useAppDispatch();
  const { isEnoughBalance, isEnoughAllowance } = useSwapCondition();
  const { mutate: requestApprove, isLoading: isRequestApproveLoading } =
    useRequestApprove();
  const { mutate: createSwap, isLoading: isCreateSwapLoading } =
    useCreateSwapParaswap();

  const handleDisconnect = useCallback(() => {
    if (connector.deactivate) connector.deactivate();

    dispatch(setAppScreen(AppScreen.INITIAL));
    dispatch(setSelectedWallet(undefined));
    dispatch(resetState());
    connector.resetState();
  }, [connector, dispatch]);

  const onClick = useCallback((): void => {
    if (!isEnoughBalance) {
      return;
    }

    if (!isEnoughAllowance) {
      requestApprove();
    } else {
      createSwap();
    }
  }, [isEnoughAllowance, isEnoughBalance, requestApprove, createSwap]);

  const buttonLabel = !isEnoughBalance
    ? 'Insufficient balance'
    : !isEnoughAllowance
    ? 'Unlock'
    : 'Swap';
  const isButtonDisabled =
    !account ||
    !isEnoughBalance ||
    isRequestApproveLoading ||
    isCreateSwapLoading;
  const isLoader = isRequestApproveLoading || isCreateSwapLoading;

  return (
    <>
      <Box
        display={'flex'}
        width={'100%'}
        justifyContent={'space-between'}
        alignItems={'center'}
        gap={2}
      >
        <Typography variant={'body1'}>{`Connected to ${getEllipsisString(
          account,
        )}`}</Typography>
        <StyledDisconnectButton
          variant={'contained'}
          onClick={handleDisconnect}
        >
          {'Disconnect'}
        </StyledDisconnectButton>
      </Box>
      <Box
        display={'flex'}
        flexDirection={'column'}
        alignItems={'center'}
        justifyContent={'center'}
        gap={4}
        flexGrow={1}
      >
        <SelectChain />
        <AssetInput type={AssetInputType.PAY} />
        <FlipTokensButton />
        <AssetInput type={AssetInputType.RECEIVE} />

        <PrimaryButton fullWidth disabled={isButtonDisabled} onClick={onClick}>
          <Box display={'flex'} alignItems={'center'} gap={2}>
            {buttonLabel}
            {isLoader && <CircularProgress size={24} color="info" />}
          </Box>
        </PrimaryButton>
      </Box>
    </>
  );
};
