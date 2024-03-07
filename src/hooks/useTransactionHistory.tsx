import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { ETHERSCAN_API_URL, ONE_MINUTE } from '../utils/constants';
import { ChainId } from '~/walletActions/types';
import axios from 'axios';
import ENV from '~/utils/env';
import { TransactionResponse } from 'ethers';
export function useTransactionHistory(
  address?: string,
  chainId?: ChainId | number,
): UseQueryResult<
  {
    status: string;
    message: string;
    // todo: define correct type for tx from etherscan
    result: TransactionResponse[];
  },
  Error
> {
  return useQuery(
    ['transactionHistory', address, chainId],
    async () => {
      const baseUrl = ETHERSCAN_API_URL[chainId as ChainId | number];
      const apiKey = ENV.ETHERSCAN_API_KEY;
      const url = `${baseUrl}/api?module=account&action=txlist&address=${address}&sort=desc&apikey=${apiKey}`;
      const { data } = await axios.get(url);
      return data;
    },
    {
      enabled: !!address && !!chainId,
      staleTime: ONE_MINUTE,
      cacheTime: ONE_MINUTE,
    },
  );
}
