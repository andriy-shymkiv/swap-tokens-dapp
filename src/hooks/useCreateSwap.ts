import { UseMutationResult, useMutation } from '@tanstack/react-query';
import { useWeb3React } from '@web3-react/core';
import { assert } from 'ts-essentials';
import { useGetSwapTransaction } from './useGetSwapTransaction';
import { TransactionResponse } from '@ethersproject/providers';

export const useCreateSwap = (): UseMutationResult<TransactionResponse, unknown, void> => {
  const { chainId, account, provider } = useWeb3React();
  const { mutateAsync: getTransaction } = useGetSwapTransaction();

  const createSwap = async (): Promise<TransactionResponse> => {
    assert(chainId && account && provider, 'chainId, account or provider is undefined');
    const signer = provider.getSigner(account);

    const { gas: gasLimit, ...rest } = await getTransaction();
    return signer.sendTransaction({
      gasLimit,
      ...rest,
    });
  };

  return useMutation(['useCreateSwap'], createSwap);
};
