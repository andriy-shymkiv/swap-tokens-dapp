import { FeeAmount, computePoolAddress } from '@uniswap/v3-sdk';
import {
  POOL_FACTORY_CONTRACT_ADDRESS,
  QUOTER_CONTRACT_ADDRESS,
} from './constants';
import { ethers } from 'ethers';
import Quoter from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json';
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json';
import { getProvider } from './provider';
import { fromHumanAmount, toHumanAmount } from './conversion';
import { Token } from '@uniswap/sdk-core';

export async function getQuote({
  tokenA,
  tokenB,
  poolFee,
  tokenInAmount,
  tokenInDecimals,
  tokenOutDecimals,
}: {
  tokenA: Token;
  tokenB: Token;
  poolFee: FeeAmount;
  tokenInAmount: number;
  tokenInDecimals: number;
  tokenOutDecimals: number;
}): Promise<string> {
  const provider = getProvider();

  if (!provider) {
    throw new Error('No provider');
  }

  const quoterContract = new ethers.Contract(
    QUOTER_CONTRACT_ADDRESS,
    Quoter.abi,
    provider,
  );

  const { token0, token1, fee } = await getPoolConstants(
    tokenA,
    tokenB,
    poolFee,
  );

  const quotedAmountOut =
    await quoterContract.callStatic.quoteExactInputSingle?.(
      token0,
      token1,
      fee,
      fromHumanAmount(tokenInAmount, tokenInDecimals).toString(),
      0,
    );

  // console.log('quotedAmountOut:', quotedAmountOut);

  const quotedAmountOutHuman = toHumanAmount(quotedAmountOut, tokenOutDecimals);

  // console.log('quotedAmountOut human:', quotedAmountOutHuman);

  return quotedAmountOutHuman;
}

async function getPoolConstants(
  tokenA: Token,
  tokenB: Token,
  poolFee: FeeAmount,
): Promise<{
  token0: string;
  token1: string;
  fee: unknown;
  liquidity: unknown;
  slot0: unknown;
}> {
  const provider = getProvider();

  if (!provider) {
    throw new Error('No provider');
  }

  const currentPoolAddress = computePoolAddress({
    factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
    tokenA,
    tokenB,
    fee: poolFee,
  });

  const poolContract = new ethers.Contract(
    currentPoolAddress,
    IUniswapV3PoolABI.abi,
    provider,
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
