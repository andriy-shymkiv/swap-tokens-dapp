import { UseMutationResult, useMutation } from '@tanstack/react-query';
import { useWeb3React } from '@web3-react/core';
import { assert } from 'ts-essentials';
import { useGetSwapTransaction } from './useGetSwapTransaction';
import { TransactionResponse } from '@ethersproject/providers';
import { useSnackbar } from './useSnackbar';
import { getEllipsisString, isUserRejectedTx } from '~/helpers/utils';
import {} from '@uniswap/v3-sdk';

export const useCreateSwap = (): UseMutationResult<
  TransactionResponse,
  unknown,
  void
> => {
  const { chainId, account, provider } = useWeb3React();
  const { mutateAsync: getTransaction } = useGetSwapTransaction();
  const { showSnackbar } = useSnackbar();

  const createSwap = async (): Promise<TransactionResponse> => {
    assert(
      chainId && account && provider,
      'chainId, account or provider is undefined',
    );
    const signer = provider.getSigner(account);

    const { gas: gasLimit, ...rest } = await getTransaction();
    return signer.sendTransaction({
      gasLimit,
      ...rest,
    });
  };

  return useMutation(['useCreateSwap'], createSwap, {
    onError: (error) => {
      showSnackbar({
        message: isUserRejectedTx(error)
          ? 'user rejected transaction'
          : 'Error creating swap',
        severity: isUserRejectedTx(error) ? 'warning' : 'error',
      });
    },
    onSuccess: (tx: TransactionResponse) => {
      // @todo: wait for tx and invalidate balances
      showSnackbar({
        message: `Swap created with hash ${getEllipsisString(tx.hash)}`,
        severity: 'success',
      });
    },
  });
};
