import { Card, styled } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { useEffect } from 'react';
import { ChooseWalletScreen } from './components/ChooseWalletScreen';
import { ConnectWalletButton } from './components/ConnectWalletButton';
import { SelectTokenScreen } from './components/SelectTokenScreen';
import { SwapTokensScreen } from './components/SwapTokensScreen';
import { AppScreen, setAppScreen } from './store/appSlice';
import { useAppDispatch, useAppSelector } from './store/hooks';

const StyledWidgetWrapper = styled(Card, {
  name: 'StyledWidgetWrapper',
})(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: 400,
  width: 400,
  padding: theme.spacing(10),
  boxShadow: theme.shadows[8],
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
    <StyledWidgetWrapper>
      {screen === AppScreen.INITIAL && <ConnectWalletButton />}
      {screen === AppScreen.CHOOSE_WALLET && <ChooseWalletScreen />}
      {screen === AppScreen.SWAP_TOKENS && <SwapTokensScreen />}
      {(screen === AppScreen.SELECT_YOU_PAY_TOKEN || screen === AppScreen.SELECT_YOU_RECEIVE_TOKEN) && (
        <SelectTokenScreen />
      )}
    </StyledWidgetWrapper>
  );
};
