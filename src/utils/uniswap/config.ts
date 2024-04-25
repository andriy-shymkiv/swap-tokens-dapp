import { Token } from '@uniswap/sdk-core';
import { FeeAmount } from '@uniswap/v3-sdk';
import { USDC_TOKEN, WETH_TOKEN } from './constants';

// Sets if the example should run locally or on chain
export enum Environment {
  LOCAL,
  MAINNET,
  WALLET_EXTENSION,
}

interface ExampleConfig {
  env: Environment;
  rpc: {
    local: string;
    mainnet: string;
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
    privateKey:
      '',
  },
  rpc: {
    local: 'http://localhost:8545',
    mainnet: `https://eth.llamarpc.com/ACQBZIJPN9I5JS5F9NVN9518215S429XGH`,
  },
  tokens: {
    in: USDC_TOKEN,
    amountIn: 1000,
    out: WETH_TOKEN,
    poolFee: FeeAmount.MEDIUM,
  },
};
