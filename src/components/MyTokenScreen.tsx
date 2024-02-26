import {
  Box,
  Button,
  CircularProgress,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  styled,
} from '@mui/material';
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
import { useTransactionHistory } from '~/hooks/useTransactionHistory';
import { useState } from 'react';

const StyledTxButton = styled(Button, {
  name: 'StyledTxButton',
})(({ theme }) => ({
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.success.main,
  textTransform: 'none',
  '&:hover': {
    backgroundColor: theme.palette.success.dark,
  },
}));
const StyledBox = styled(Box, {
  name: 'StyledBox',
})(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  padding: theme.spacing(4),
  boxShadow: theme.shadows[5],
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
}));

// this component will be deleted from the codebase after pdp
export const MyTokenScreen = (): JSX.Element => {
  const { account, chainId } = useWeb3React();
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
  const { data: txHistory } = useTransactionHistory(account, chainId);

  const [isModalOpen, setIsModalOpen] = useState(false);

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
          <StyledTxButton
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            show last 5 transactions
          </StyledTxButton>
          <Modal
            open={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
            }}
          >
            <StyledBox>
              last 5 transactions from etherscan:
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>tx hash</TableCell>
                      <TableCell align="right">blockNumber</TableCell>
                      <TableCell align="right">from</TableCell>
                      <TableCell align="right">to</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {txHistory?.result.slice(0, 5).map((tx) => (
                      <TableRow key={tx.hash} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell component="th" scope="row">
                          {getEllipsisString(tx.hash)}
                        </TableCell>
                        <TableCell align="right">{getEllipsisString(tx.blockNumber?.toString())}</TableCell>
                        <TableCell align="right">{getEllipsisString(tx.from)}</TableCell>
                        <TableCell align="right">{getEllipsisString(tx.to ?? '')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </StyledBox>
          </Modal>
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
