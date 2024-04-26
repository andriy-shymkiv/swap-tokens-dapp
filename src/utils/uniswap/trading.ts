import {
  Currency,
  CurrencyAmount,
  Percent,
  Token,
  TradeType,
} from '@uniswap/sdk-core';
import { getPoolInfo } from './pool';
import {
  FeeAmount,
  Pool,
  Route,
  SwapOptions,
  SwapQuoter,
  SwapRouter,
  Trade,
} from '@uniswap/v3-sdk';
import {
  TransactionState,
  getProvider,
  getWalletAddress,
  sendTransaction,
} from './provider';
import { ethers } from 'ethers';
import {
  ERC20_ABI,
  MAX_FEE_PER_GAS,
  MAX_PRIORITY_FEE_PER_GAS,
  QUOTER_CONTRACT_ADDRESS,
  SWAP_ROUTER_ADDRESS,
  TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER,
} from './constants';
import { fromHumanAmount } from './conversion';
import JSBI from 'jsbi';

export type TokenTrade = Trade<Token, Token, TradeType>;

export async function createTrade(
  tokenA: Token,
  tokenB: Token,
  poolFee: FeeAmount,
  tokenAAmount: number,
): Promise<TokenTrade> {
  console.log('creating trade...', { tokenA, tokenB, poolFee, tokenAAmount });
  try {
    const poolInfo = await getPoolInfo(tokenA, tokenB, poolFee);
    console.log({ poolInfo });
  } catch (error) {
    console.log('Error getting pool info:', error);
  }

  const pool = new Pool(
    tokenA,
    tokenB,
    poolFee,
    poolInfo.sqrtPriceX96.toString(),
    poolInfo.liquidity.toString(),
    poolInfo.tick,
  );
  console.log({ pool });
  const swapRoute = new Route([pool], tokenA, tokenB);
  console.log({ swapRoute });
  const amountOut = await getOutputQuote(swapRoute, tokenA, tokenAAmount);
  console.log({ amountOut });
  const uncheckedTrade = Trade.createUncheckedTrade({
    route: swapRoute,
    inputAmount: CurrencyAmount.fromRawAmount(
      tokenA,
      fromHumanAmount(tokenAAmount, tokenA.decimals).toString(),
    ),
    outputAmount: CurrencyAmount.fromRawAmount(tokenB, JSBI.BigInt(amountOut)),
    tradeType: TradeType.EXACT_INPUT,
  });
  console.log('unchecked trade created:', { uncheckedTrade });

  return uncheckedTrade;
}

export async function executeTrade(
  trade: TokenTrade,
  tokenA: Token,
): Promise<TransactionState> {
  console.log('executing trade...');
  const walletAddress = getWalletAddress();
  const provider = getProvider();

  if (!walletAddress || !provider) {
    throw new Error('Cannot execute a trade without a connected wallet');
  }

  // Give approval to the router to spend the token
  const tokenApproval = await getTokenTransferApproval(
    tokenA,
    // walletAddress,
    // provider,
  );

  // Fail if transfer approvals do not go through
  if (tokenApproval !== TransactionState.Sent) {
    return TransactionState.Failed;
  }

  const options: SwapOptions = {
    slippageTolerance: new Percent(50, 10_000), // 50 bips, or 0.50%
    deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from the current Unix time
    recipient: walletAddress,
  };

  const methodParameters = SwapRouter.swapCallParameters([trade], options);

  const tx = {
    data: methodParameters.calldata,
    to: SWAP_ROUTER_ADDRESS,
    value: methodParameters.value,
    from: walletAddress,
    maxFeePerGas: MAX_FEE_PER_GAS,
    maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
    gasLimit: 300000,
  };
  console.log({ tx });
  const res = await sendTransaction(tx);

  return res;
}

async function getOutputQuote(
  route: Route<Currency, Currency>,
  tokenA: Token,
  tokenAAmount: number,
): Promise<ethers.utils.Result> {
  const provider = getProvider();

  if (!provider) {
    throw new Error('Provider required to get pool state');
  }

  const { calldata } = SwapQuoter.quoteCallParameters(
    route,
    CurrencyAmount.fromRawAmount(
      tokenA,
      fromHumanAmount(tokenAAmount, tokenA.decimals).toString(),
    ),
    TradeType.EXACT_INPUT,
    {
      useQuoterV2: true,
    },
  );

  const quoteCallReturnData = await provider.call({
    to: QUOTER_CONTRACT_ADDRESS,
    data: calldata,
  });

  console.log('quoteCallReturnData:', quoteCallReturnData);

  return ethers.utils.defaultAbiCoder.decode(['uint256'], quoteCallReturnData);
}

export async function getTokenTransferApproval(
  token: Token,
): Promise<TransactionState> {
  const provider = getProvider();
  const walletAddress = getWalletAddress();
  if (!provider || !walletAddress) {
    console.log('No Provider Found');
    return TransactionState.Failed;
  }

  try {
    const tokenContract = new ethers.Contract(
      token.address,
      ERC20_ABI,
      provider,
    );

    const transaction = await tokenContract.populateTransaction.approve?.(
      SWAP_ROUTER_ADDRESS,
      fromHumanAmount(
        TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER,
        token.decimals,
      ).toString(),
    );

    return sendTransaction({
      ...transaction,
      from: walletAddress,
    });
  } catch (e) {
    console.error(e);
    return TransactionState.Failed;
  }
}
