import { Token } from '@uniswap/sdk-core';
import { FeeAmount, computePoolAddress } from '@uniswap/v3-sdk';
import {
  POOL_FACTORY_CONTRACT_ADDRESS,
  QUOTER_CONTRACT_ADDRESS,
  USDC_TOKEN,
  WETH_TOKEN,
} from './constants';
import { ethers } from 'ethers';
import Quoter from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json';
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json';
import { getProvider } from './provider';
import { fromHumanAmount, toHumanAmount } from './conversion';

interface ExampleConfig {
  rpc: {
    local: string;
    mainnet: string;
  };
  tokens: {
    in: Token;
    amountIn: number;
    out: Token;
    poolFee: number;
  };
}

export const CurrentConfig: ExampleConfig = {
  rpc: {
    local: 'http://localhost:8545',
    mainnet: 'https://mainnet.infura.io/v3/0ac57a06f2994538829c14745750d721',
  },
  tokens: {
    in: USDC_TOKEN,
    amountIn: 1000,
    out: WETH_TOKEN,
    poolFee: FeeAmount.MEDIUM,
  },
};

export async function getQuote(): Promise<string> {
  const quoterContract = new ethers.Contract(
    QUOTER_CONTRACT_ADDRESS,
    Quoter.abi,
    getProvider(),
  );

  const { token0, token1, fee } = await getPoolConstants();

  const quotedAmountOut =
    await quoterContract.callStatic.quoteExactInputSingle?.(
      token0,
      token1,
      fee,
      fromHumanAmount(
        CurrentConfig.tokens.amountIn,
        CurrentConfig.tokens.in.decimals,
      ).toString(),
      0,
    );

  console.log('quotedAmountOut:', quotedAmountOut);

  const quotedAmountOutHuman = toHumanAmount(
    quotedAmountOut,
    CurrentConfig.tokens.out.decimals,
  );
  console.log('quotedAmountOut human:', quotedAmountOutHuman);

  return quotedAmountOutHuman;
}

async function getPoolConstants(): Promise<{
  token0: string;
  token1: string;
  fee: unknown;
  liquidity: unknown;
  slot0: unknown;
}> {
  const currentPoolAddress = computePoolAddress({
    factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
    tokenA: CurrentConfig.tokens.in,
    tokenB: CurrentConfig.tokens.out,
    fee: CurrentConfig.tokens.poolFee,
  });

  const poolContract = new ethers.Contract(
    currentPoolAddress,
    IUniswapV3PoolABI.abi,
    getProvider(),
  );

  const [token0, token1, fee, liquidity, slot0] = await Promise.all([
    poolContract.token0(),
    poolContract.token1(),
    poolContract.fee(),
    poolContract.liquidity(),
    poolContract.slot0(),
  ]);

  return {
    token0,
    token1,
    fee,
    liquidity,
    slot0,
  };
}
