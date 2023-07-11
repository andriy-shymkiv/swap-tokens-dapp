import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useWeb3React } from '@web3-react/core';
import { useAppSelector } from '~/store/hooks';
import { getMultipleAllowances } from '~/utils/web3Utils';
import { ONE_MINUTE } from '~/utils/constants';
import { ChainId } from '~/walletActions/types';
import { useTokenLists } from './useTokenLists';

export interface MulticallResponse {
  humanAmount: string;
  amount: string;
}

export const PAYMENT_SPENDER = '0xb7742b7cf4d590de1f2bded0139537fea8f00710';

export const constructTokenAllowancesCacheKey = (chainId: ChainId): any[] => ['tokensAllowances', chainId];

export const useTokenAllowances = (): UseQueryResult<Record<string, MulticallResponse | null>> => {
  const { selectedChainId } = useAppSelector(({ app }) => app);
  const { account } = useWeb3React();
  const { data: tokensList } = useTokenLists();

  return useQuery(
    constructTokenAllowancesCacheKey(selectedChainId),
    () =>
      getMultipleAllowances(
        account ?? '',
        selectedChainId,
        Object.values(tokensList?.[selectedChainId] ?? {}),
        PAYMENT_SPENDER,
      ),
    {
      enabled: !!account?.length && !!Object.values(tokensList?.[selectedChainId] ?? {}),
      cacheTime: ONE_MINUTE,
      staleTime: ONE_MINUTE,
    },
  );
};
