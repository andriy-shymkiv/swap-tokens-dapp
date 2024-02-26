import { Box, Button, CircularProgress, TextField, Typography, styled } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import {
  useMyTokenDetails,
  useBalanceOf,
  useIsAdmin,
  useIsBlackListed,
  useAllowance,
  useTransfer,
  useManageBlackList,
  useMint,
  useBurnFrom,
} from '~/hooks/useMyToken';
import { formatUnits, parseUnits, isAddress } from 'ethers';
import { getEllipsisString } from '~/helpers/utils';
import { Form, Formik } from 'formik';
import { useSnackbar } from '~/hooks/useSnackbar';

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
  const { showSnackbar } = useSnackbar();
  const { data: details, isLoading: isDetailsLoading } = useMyTokenDetails();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsAdmin(account);
  const { data: isBlackListed, isLoading: isBlackListedLoading } = useIsBlackListed(account);
  const { data: balanceOf, isLoading: isBalanceOfLoading } = useBalanceOf(account);
  const { data: allowance, isLoading: isAllowanceLoading } = useAllowance(account);
  const { mutate: transfer } = useTransfer();
  const { mutate: mint } = useMint();
  const { mutate: burnFrom } = useBurnFrom();
  const { mutate: manageBlackList } = useManageBlackList();

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
            {'hasRole(ADMIN_ROLE):'}
          </Typography>{' '}
          {isAdminLoading ? (
            <CircularProgress size={20} thickness={8} />
          ) : isAdmin ? (
            <Typography display="inline" fontWeight={700} color={(theme) => theme.palette.success.main}>
              {'true'}
            </Typography>
          ) : (
            <Typography display="inline" fontWeight={700} color={(theme) => theme.palette.info.main}>
              {'false'}
            </Typography>
          )}
        </Box>
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
        <Box display={'flex'} flexDirection={'column'} gap={2}>
          <Formik
            initialValues={{
              account: '',
            }}
            onSubmit={({ account }) => {
              if (!isAddress(account)) {
                showSnackbar({
                  message: 'Invalid address',
                  severity: 'error',
                });
              } else {
                manageBlackList({
                  action: 'add',
                  account,
                });
              }
            }}
          >
            {({ values, handleChange, handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} gap={4}>
                  <StyledTxButton variant="contained" type="submit">
                    {'addToBlackList'}
                  </StyledTxButton>
                  <Box display={'flex'} flexDirection={'column'} gap={1}>
                    <TextField
                      size="small"
                      name="account"
                      placeholder="address"
                      value={values.account}
                      onChange={handleChange}
                    />
                  </Box>
                </Box>
              </Form>
            )}
          </Formik>

          <Formik
            initialValues={{
              account: '',
            }}
            onSubmit={({ account }) => {
              if (!isAddress(account)) {
                showSnackbar({
                  message: 'Invalid address',
                  severity: 'error',
                });
              } else {
                manageBlackList({
                  action: 'remove',
                  account,
                });
              }
            }}
          >
            {({ values, handleChange, handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} gap={4}>
                  <StyledTxButton variant="contained" type="submit">
                    {'removeFromBlackList'}
                  </StyledTxButton>
                  <Box display={'flex'} flexDirection={'column'} gap={1}>
                    <TextField
                      size="small"
                      name="account"
                      placeholder="address"
                      value={values.account}
                      onChange={handleChange}
                    />
                  </Box>
                </Box>
              </Form>
            )}
          </Formik>

          <Formik
            initialValues={{
              to: '',
              amount: '',
            }}
            onSubmit={({ to, amount }) => {
              if (!isAddress(to) || !amount) {
                showSnackbar({
                  message: 'Invalid address or amount',
                  severity: 'error',
                });
              } else {
                transfer({
                  to,
                  amount: parseUnits(amount, 18),
                });
              }
            }}
          >
            {({ values, handleChange, handleSubmit }) => (
              <Form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} gap={4}>
                  <StyledTxButton variant="contained" type="submit">
                    {'transfer'}
                  </StyledTxButton>
                  <Box display={'flex'} flexDirection={'column'} gap={1}>
                    <TextField size="small" name="to" placeholder="address" value={values.to} onChange={handleChange} />
                    <TextField
                      size="small"
                      name="amount"
                      placeholder="amount"
                      value={values.amount}
                      onChange={handleChange}
                    />
                  </Box>
                </Box>
              </Form>
            )}
          </Formik>

          <Formik
            initialValues={{
              to: '',
              amount: '',
            }}
            onSubmit={({ to, amount }) => {
              if (!isAddress(to) || !amount) {
                showSnackbar({
                  message: 'Invalid address or amount',
                  severity: 'error',
                });
              } else {
                mint({
                  to,
                  amount: parseUnits(amount, 18),
                });
              }
            }}
          >
            {({ values, handleChange, handleSubmit }) => (
              <Form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} gap={4}>
                  <StyledTxButton variant="contained" type="submit">
                    {'mint'}
                  </StyledTxButton>
                  <Box display={'flex'} flexDirection={'column'} gap={1}>
                    <TextField size="small" name="to" placeholder="address" value={values.to} onChange={handleChange} />
                    <TextField
                      size="small"
                      name="amount"
                      placeholder="amount"
                      value={values.amount}
                      onChange={handleChange}
                    />
                  </Box>
                </Box>
              </Form>
            )}
          </Formik>
          <Formik
            initialValues={{
              from: '',
              amount: '',
            }}
            onSubmit={({ from, amount }) => {
              if (!isAddress(from) || !amount) {
                showSnackbar({
                  message: 'Invalid address or amount',
                  severity: 'error',
                });
              } else {
                burnFrom({
                  from,
                  amount: parseUnits(amount, 18),
                });
              }
            }}
          >
            {({ values, handleChange, handleSubmit }) => (
              <Form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} gap={4}>
                  <StyledTxButton variant="contained" type="submit">
                    {'burnFrom'}
                  </StyledTxButton>
                  <Box display={'flex'} flexDirection={'column'} gap={1}>
                    <TextField
                      size="small"
                      name="from"
                      placeholder="address"
                      value={values.from}
                      onChange={handleChange}
                    />
                    <TextField
                      size="small"
                      name="amount"
                      placeholder="amount"
                      value={values.amount}
                      onChange={handleChange}
                    />
                  </Box>
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      </Box>
    </Box>
  );
};
