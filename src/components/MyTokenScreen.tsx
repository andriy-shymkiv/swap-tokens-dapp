import { Box, Button, CircularProgress, Typography, styled } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { useMyTokenDetails, useBalanceOf, useIsBlackListed, useAllowance } from '~/hooks/useMyToken';
import { formatUnits } from 'ethers';
import { getEllipsisString } from '~/helpers/utils';

const StyledTxButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.success.main,
  textTransform: 'none',
  '&:hover': {
    backgroundColor: theme.palette.success.dark,
  },
}));

export const MyTokenScreen = (): JSX.Element => {
  const { account } = useWeb3React();
  const { data: details, isLoading: isDetailsLoading } = useMyTokenDetails();
  const { data: isBlackListed, isLoading: isBlackListedLoading } = useIsBlackListed(account);
  const { data: balanceOf, isLoading: isBalanceOfLoading } = useBalanceOf(account);
  const { data: allowance, isLoading: isAllowanceLoading } = useAllowance(account);
  return (
    <Box display={'flex'} flexDirection={'column'} gap={6}>
      <Box>
        Basic details:
        {isDetailsLoading ? (
          <CircularProgress size={20} thickness={8} />
        ) : (
          Object.entries(details || {}).map(([key, value]) => (
            <Box key={`${key}_${value}`}>
              <Typography key={key} display="inline" color={(theme) => theme.palette.info.main}>
                {key}:
              </Typography>{' '}
              <Typography display="inline" fontWeight={700}>
                {key === 'totalSupply' ? formatUnits(value || 0, 18) : value.toString()}
              </Typography>
            </Box>
          ))
        )}
      </Box>
      <Box>
        {getEllipsisString(account)}:
        <Box>
          <Typography display="inline" color={(theme) => theme.palette.info.main}>
            {'blackList:'}
          </Typography>{' '}
          {isBlackListedLoading ? (
            <CircularProgress size={20} thickness={8} />
          ) : isBlackListed ? (
            <Typography display="inline" fontWeight={700} color={(theme) => theme.palette.error.main}>
              {'true'}
            </Typography>
          ) : (
            <Typography display="inline" fontWeight={700} color={(theme) => theme.palette.success.main}>
              {'false'}
            </Typography>
          )}
        </Box>
        <Box>
          <Typography display="inline" color={(theme) => theme.palette.info.main}>
            {'balanceOf:'}
          </Typography>{' '}
          {isBalanceOfLoading ? (
            <CircularProgress size={20} thickness={8} />
          ) : (
            <Typography display="inline" fontWeight={700}>
              {formatUnits(balanceOf || 0, 18)}
            </Typography>
          )}
        </Box>
        <Box>
          <Typography display="inline" color={(theme) => theme.palette.info.main}>
            {'allowance:'}
          </Typography>{' '}
          {isAllowanceLoading ? (
            <CircularProgress size={20} thickness={8} />
          ) : (
            <Typography display="inline" fontWeight={700}>
              {formatUnits(allowance || 0, 18)}
            </Typography>
          )}
        </Box>
        <Box display={'flex'} flexDirection={'column'} gap={2} width={'max-content'}>
          <StyledTxButton size="small" variant="contained">
            {'transfer'}
          </StyledTxButton>
          <StyledTxButton size="small" variant="contained">
            {'transferFrom'}
          </StyledTxButton>
        </Box>
      </Box>
    </Box>
  );
};
