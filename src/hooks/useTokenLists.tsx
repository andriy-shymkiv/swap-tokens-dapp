import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getTokenList } from '~/api/tokens';
import { TokenListMap, TokenMap } from '~/types/tokens';
import { ONE_HOUR } from '~/utils/constants';
import { Token } from '~/walletActions/types';

export const getTokenListByChainId = async (): Promise<TokenListMap> => {
  const tokens = await getTokenList();
  const tokenListMap: TokenListMap = {};

  tokens.map((token: Token) => {
    if (!tokenListMap[token.chainId]) tokenListMap[token.chainId] = {}; // if no token list for this chainId, create it
    const tokenMap = tokenListMap[token.chainId] as TokenMap; // get token list for this chainId
    tokenMap[token.address] = token; // add token to token list
  });

  return tokenListMap;
};

export const constructTokensListQueryKey = (): any[] => ['tokenLists'];

export const useTokenLists = (): UseQueryResult<TokenListMap> => {
  return useQuery<TokenListMap>(constructTokensListQueryKey(), () => getTokenListByChainId(), {
    staleTime: ONE_HOUR,
    cacheTime: ONE_HOUR,
  });
};
