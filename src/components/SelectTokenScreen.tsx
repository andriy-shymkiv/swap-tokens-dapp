import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, CircularProgress, debounce, FormControl, styled, TextField, Typography } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import { isNonEmptyArray } from '~/helpers/utils';
import { useTokenLists } from '~/hooks/useTokenLists';
import { AppScreen, setAppScreen, setYouPayToken, setYouReceiveToken } from '~/store/appSlice';
import { useAppDispatch, useAppSelector } from '~/store/hooks';
import { Token } from '~/types/tokens';
import { EMPTY_ARRAY } from '~/utils/constants';

const StyledTokensWrapper = styled(Box, {
  name: 'StyledTokensWrapper',
})(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    width: theme.spacing(2),
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.secondary.main,
    borderRadius: theme.shape.borderRadius,
  },
}));

const StyledSearchTokenInput = styled(TextField)(({ theme }) => ({
  width: '100%',
  marginBottom: theme.spacing(6),
  '& .MuiOutlinedInput-root': {
    height: 44,
    borderRadius: theme.spacing(10),
  },
}));

const StyledTokenButton = styled(Button, {
  name: 'StyledTokenButton',
})(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'flex-start',
  gap: theme.spacing(2),
  textTransform: 'none',
  color: theme.palette.text.primary,
  padding: '4px 8px',
}));

const StyledLoaderShadow = styled(CircularProgress, {
  name: 'StyledLoaderShadow',
})(({ theme }) => ({
  color: theme.palette.success.light,
}));

const StyledLoader = styled(CircularProgress, {
  name: 'StyledLoader',
})(({ theme }) => ({
  position: 'absolute',
  color: theme.palette.success.main,
}));

const StyledTokenImage = styled('img', {
  name: 'StyledTokenImage',
})({
  width: 24,
  height: 24,
});

export const SelectTokenScreen: React.FC = (): JSX.Element => {
  const { selectedChainId, screen } = useAppSelector(({ app }) => app);
  const { data: tokensList, isLoading: tokensListIsLoading } = useTokenLists();
  const dispatch = useAppDispatch();
  const [query, setQuery] = useState('');
  const tokensToDisplay = useMemo(
    () =>
      Object.values(tokensList?.[selectedChainId] ?? {}).filter((token) =>
        token.symbol.toLowerCase().includes(query.trim()),
      ) ?? EMPTY_ARRAY,
    [query, selectedChainId, tokensList],
  );

  const onChange = debounce((event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value.toLowerCase());
  }, 500);

  const onSelectTokenClick = useCallback(
    (token: Token) => {
      dispatch(screen === AppScreen.SELECT_YOU_PAY_TOKEN ? setYouPayToken(token) : setYouReceiveToken(token));
      dispatch(setAppScreen(AppScreen.SWAP_TOKENS));
    },
    [dispatch, screen],
  );

  return (
    <>
      <FormControl fullWidth>
        <StyledSearchTokenInput
          autoComplete="off"
          onChange={onChange}
          InputProps={{
            startAdornment: (
              <Box display={'flex'} alignItems={'center'} mr={2}>
                <SearchIcon />
              </Box>
            ),
          }}
          placeholder="Search..."
        />
      </FormControl>
      {isNonEmptyArray(tokensToDisplay) ? (
        <StyledTokensWrapper>
          {tokensToDisplay.map((token) => (
            <StyledTokenButton key={token.address} onClick={(): void => onSelectTokenClick(token)}>
              <StyledTokenImage src={token.logoURI} alt={token.symbol} />
              <Typography variant="body2" color="text.primary" fontWeight={700}>
                {token.symbol}
              </Typography>
            </StyledTokenButton>
          ))}
        </StyledTokensWrapper>
      ) : (
        <>
          {tokensListIsLoading ? (
            <Box position={'relative'} display={'flex'} alignItems={'center'} justifyContent={'center'} flexGrow={1}>
              <StyledLoaderShadow variant="determinate" size={60} thickness={4} value={100} />
              <StyledLoader size={60} thickness={6} />
            </Box>
          ) : (
            <Box display={'flex'} flexDirection={'column'} justifyContent={'start'} alignItems={'center'}>
              <Typography variant="body1">{`Sorry, we can't find the token.`}</Typography>
              <Typography variant="body1">{`Please, try again`}</Typography>
            </Box>
          )}
        </>
      )}
    </>
  );
};
