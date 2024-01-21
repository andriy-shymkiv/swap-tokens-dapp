import { UseMutationResult, useMutation } from '@tanstack/react-query';
import { useWeb3React } from '@web3-react/core';
import { useCallback } from 'react';
import { assert } from 'ts-essentials';
import { useAppSelector } from '~/store/hooks';
import { SWAP_SPENDER } from '~/utils/constants';
import { requestApprove } from '~/utils/web3Utils';
import { useSnackbar } from './useSnackbar';
import { getEllipsisString, isUserRejectedTx } from '~/helpers/utils';
import { TransactionResponse } from '@ethersproject/providers';

export const useRequestApprove = (): UseMutationResult<TransactionResponse, unknown, void> => {
  const { youPay } = useAppSelector(({ app }) => app);
  const { provider, account, chainId } = useWeb3React();
  const { showSnackbar } = useSnackbar();
  const amountInWei = Number(youPay.amount) * 10 ** youPay.token.decimals;

  // not sure about return type for approve
  const approve = useCallback((): Promise<TransactionResponse> => {
    assert(provider && account && chainId, 'missing provider, account, or chainId');

    return requestApprove(provider, {
      clientAddress: account,
      tokenAddress: youPay.token.address,
      chainId,
      amount: amountInWei.toString(),
      spender: SWAP_SPENDER,
    });
  }, [provider, account, chainId, amountInWei, youPay.token.address]);

  return useMutation(['requestApprove'], approve, {
    onError: (error) => {
      showSnackbar({
        message: isUserRejectedTx(error) ? 'user rejected transaction' : 'Error creating swap',
        severity: isUserRejectedTx(error) ? 'warning' : 'error',
      });
    },
    onSuccess: (tx) => {
      // @todo: wait for tx and invalidate allowances
      showSnackbar({
        message: `Approve transaction sent with hash ${getEllipsisString(tx.hash)}`,
        severity: 'success',
      });
    },
  });
};
