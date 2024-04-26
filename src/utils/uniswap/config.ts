import { Token } from '@uniswap/sdk-core';
import { FeeAmount } from '@uniswap/v3-sdk';
import { USDC_TOKEN, DAI_TOKEN } from './constants';

// Sets if the example should run locally or on chain
export enum Environment {
  WALLET_EXTENSION,
}

interface ExampleConfig {
  env: Environment;
  rpc: {
    local: string;
    mainnet: string;
    polygon: string;
  };
  wallet: {
    privateKey: string;
    address: string;
  };
  tokens: {
    in: Token;
    amountIn: number;
    out: Token;
    poolFee: number;
  };
}

export const CurrentConfig: ExampleConfig = {
  env: Environment.WALLET_EXTENSION,
  wallet: {
    address: '',
    privateKey: '',
  },
  rpc: {
    local: 'http://localhost:8545',
    mainnet: `https://eth.llamarpc.com/ACQBZIJPN9I5JS5F9NVN9518215S429XGH`,
    polygon: 'https://polygon-mainnet.public.blastapi.io',
  },
  tokens: {
    in: DAI_TOKEN,
    amountIn: 0.2,
    out: USDC_TOKEN,
    poolFee: FeeAmount.MEDIUM,
  },
};
