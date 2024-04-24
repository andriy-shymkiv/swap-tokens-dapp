import { UseMutationResult, useMutation } from '@tanstack/react-query';
import { useAppSelector } from '~/store/hooks';
import { DEFAULT_PARTNER, DEFAULT_SLIPPAGE } from '~/utils/constants';
import {
  MinTokenData,
  TransactionParams,
  createSwapper,
} from '~/utils/paraswap';
import BigNumber from 'bignumber.js';
import { useWeb3React } from '@web3-react/core';
import { assert } from 'ts-essentials';
import { useCallback } from 'react';
import { useSnackbar } from './useSnackbar';

export const useGetSwapTransaction = (): UseMutationResult<
  TransactionParams,
  unknown,
  void
> => {
  const { youPay, youReceive } = useAppSelector(({ app }) => app);
  const { chainId, account } = useWeb3React();
  const { showSnackbar } = useSnackbar();

  const getSwapTransaction =
    useCallback(async (): Promise<TransactionParams> => {
      assert(chainId && account, 'chainId or account is undefined');
      const srcToken: Pick<MinTokenData, 'address' | 'decimals'> = {
        decimals: youPay.token.decimals,
        address: youPay.token.address,
      };
      const destToken: Pick<MinTokenData, 'address' | 'decimals'> = {
        decimals: youReceive.token.decimals,
        address: youReceive.token.address,
      };

      const srcAmount = new BigNumber(youPay.amount)
        .times(10 ** srcToken.decimals)
        .toFixed(0);

      const ps = createSwapper(chainId);

      const priceRoute = await ps.getRate({
        srcToken,
        destToken,
        srcAmount,
      });

      const minAmount = new BigNumber(priceRoute.destAmount)
        .times(1 - DEFAULT_SLIPPAGE / 100)
        .toFixed(0);

      const transactionRequest = await ps.buildSwap({
        srcToken,
        destToken,
        srcAmount,
        minAmount,
        priceRoute,
        userAddress: account,
        receiver: account,
        partner: DEFAULT_PARTNER,
      });

      return transactionRequest;
    }, [account, chainId, youPay, youReceive]);

  return useMutation(['getSwapTransaction'], getSwapTransaction, {
    onError: () => {
      showSnackbar({
        message: 'Error building swap transaction',
        severity: 'error',
      });
    },
  });
};
