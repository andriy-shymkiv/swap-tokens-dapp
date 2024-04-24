/* eslint-disable @typescript-eslint/ban-types */
import axios from 'axios';
import { OptimalRate, SwapSide } from '@paraswap/core';
import { PARASWAP_API_URL, DEFAULT_PARTNER } from './constants';

export interface MinTokenData {
  decimals: number;
  symbol: string;
  address: string;
}

/**
 * @type ethereum address
 */
type Address = string;
/**
 * @type number as string
 */
type NumberAsString = string;

export interface TransactionParams {
  to: Address;
  from: Address;
  value: NumberAsString;
  data: string;
  gasPrice: NumberAsString;
  gas?: NumberAsString;
  chainId: number;
}

interface Swapper {
  getRate(params: {
    srcToken: Pick<MinTokenData, 'address' | 'decimals'>;
    destToken: Pick<MinTokenData, 'address' | 'decimals'>;
    srcAmount: NumberAsString;
    partner?: string;
  }): Promise<OptimalRate>;
  buildSwap(params: {
    srcToken: Pick<MinTokenData, 'address' | 'decimals'>;
    destToken: Pick<MinTokenData, 'address' | 'decimals'>;
    srcAmount: NumberAsString;
    minAmount: NumberAsString;
    priceRoute: OptimalRate;
    userAddress: Address;
    receiver?: Address;
    partner?: string;
  }): Promise<TransactionParams>;
}

export function createSwapper(networkID: number): Swapper {
  type PriceQueryParams = {
    srcToken: string;
    destToken: string;
    srcDecimals: string;
    destDecimals: string;
    amount: string;
    side: SwapSide;
    network: string;
    partner: string;
  };

  const getRate: Swapper['getRate'] = async ({
    srcToken,
    destToken,
    srcAmount,
    partner = DEFAULT_PARTNER,
  }) => {
    const queryParams: PriceQueryParams = {
      srcToken: srcToken.address,
      destToken: destToken.address,
      srcDecimals: srcToken.decimals.toString(),
      destDecimals: destToken.decimals.toString(),
      amount: srcAmount,
      side: SwapSide.SELL,
      network: networkID.toString(),
      partner,
    };

    const searchString = new URLSearchParams(queryParams);

    const pricesURL = `${PARASWAP_API_URL}/prices/?${searchString}`;
    console.log('GET /price URL', pricesURL);

    const {
      data: { priceRoute },
    } = await axios.get<{ priceRoute: OptimalRate }>(pricesURL);

    return priceRoute;
  };

  interface BuildTxBody {
    srcToken: Address;
    destToken: Address;
    srcAmount: NumberAsString;
    destAmount: NumberAsString;
    priceRoute: OptimalRate;
    userAddress: Address;
    partner?: string;
    receiver?: Address;
    srcDecimals?: number;
    destDecimals?: number;
  }

  const buildSwap: Swapper['buildSwap'] = async ({
    srcToken,
    destToken,
    srcAmount,
    minAmount,
    priceRoute,
    userAddress,
    receiver,
    partner,
  }) => {
    const txURL = `${PARASWAP_API_URL}/transactions/${networkID}`;

    const txConfig: BuildTxBody = {
      priceRoute,
      srcToken: srcToken.address,
      srcDecimals: srcToken.decimals,
      destToken: destToken.address,
      destDecimals: destToken.decimals,
      srcAmount,
      destAmount: minAmount,
      userAddress,
      partner,
      receiver,
    };

    const { data } = await axios.post<TransactionParams>(txURL, txConfig);

    return data;
  };

  return { getRate, buildSwap };
}
