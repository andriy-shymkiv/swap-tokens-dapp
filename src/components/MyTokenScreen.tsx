import { Box, Typography } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { useIsBlackListed } from '~/hooks/useMyToken';

export const MyTokenScreen = (): JSX.Element => {
  const { account } = useWeb3React();
  const { data: isBlackListed } = useIsBlackListed(account);
  return (
    <Box>
      <Typography display="inline" color={(theme) => theme.palette.info.main}>
        {'Black list status:'}
      </Typography>{' '}
      {isBlackListed ? (
        <Typography display="inline" fontWeight={700} color={(theme) => theme.palette.error.main}>
          {'Whoops, you are blacklisted and can only read from the contract'}
        </Typography>
      ) : (
        <Typography display="inline" fontWeight={700} color={(theme) => theme.palette.success.main}>
          {'Very good, you are not blacklisted (yet)'}
        </Typography>
      )}
    </Box>
  );
};
