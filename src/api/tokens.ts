import axios from 'axios';
import { UNISWAP_TOKEN_LIST_URL } from '~/utils/constants';
import { Token } from '~/walletActions/types';

export const getTokenList = async (): Promise<Token[]> => {
  const { data } = await axios.get(UNISWAP_TOKEN_LIST_URL);

  return data.tokens;
};
