import { Card, styled } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { useEffect } from 'react';
import { ChooseWalletScreen } from './components/ChooseWalletScreen';
import { ConnectWalletButton } from './components/ConnectWalletButton';
import { SelectTokenScreen } from './components/SelectTokenScreen';
import { SwapTokensScreen } from './components/SwapTokensScreen';
import { AppScreen, setAppScreen } from './store/appSlice';
import { useAppDispatch, useAppSelector } from './store/hooks';

export const StyledCard = styled(Card, {
  name: 'StyledCard',
})(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(4),
  width: 620,
  height: 400,
  padding: theme.spacing(4),
  boxShadow: theme.shadows[6],
}));

export const App: React.FC = (): JSX.Element => {
  const { screen } = useAppSelector(({ app }) => app);
  const { account } = useWeb3React();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (account) {
      dispatch(setAppScreen(AppScreen.SWAP_TOKENS));
    } else {
      dispatch(setAppScreen(AppScreen.INITIAL));
    }
  }, [account, dispatch]);

  return (
    <StyledCard>
      {screen === AppScreen.INITIAL && <ConnectWalletButton />}
      {screen === AppScreen.CHOOSE_WALLET && <ChooseWalletScreen />}
      {screen === AppScreen.SWAP_TOKENS && <SwapTokensScreen />}
      {screen === AppScreen.SELECT_YOU_PAY_TOKEN && screen === AppScreen.SELECT_YOU_PAY_TOKEN && <SelectTokenScreen />}
    </StyledCard>
  );
};
