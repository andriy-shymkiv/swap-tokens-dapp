import { useCallback, useEffect, useState } from 'react';
import { getQuote } from './utils/uniswap/quote';
import { CurrentConfig } from './utils/uniswap/config';
import { PoolInfo, getPoolInfo } from './utils/uniswap/pool';
import { createTrade, executeTrade } from './utils/uniswap/trading';
import { useWeb3React } from '@web3-react/core';
import {
  connectBrowserExtensionWallet,
  getWalletAddress,
} from './utils/uniswap/provider';

export const UniswapComponent = (): JSX.Element => {
  const [outputAmount, setOutputAmount] = useState<string>();
  const [poolInfo, setPoolInfo] = useState<PoolInfo>();
  const [trade, setTrade] = useState<any>();
  const [walletAddress, setWalletAddress] = useState<string | null | undefined>(
    getWalletAddress(),
  );

  const onQuote = useCallback(async () => {
    const quote = await getQuote({
      tokenA: CurrentConfig.tokens.in,
      tokenB: CurrentConfig.tokens.out,
      poolFee: CurrentConfig.tokens.poolFee,
      tokenInAmount: CurrentConfig.tokens.amountIn,
      tokenInDecimals: CurrentConfig.tokens.in.decimals,
      tokenOutDecimals: CurrentConfig.tokens.out.decimals,
    });

    const poolInfo = await getPoolInfo(
      CurrentConfig.tokens.in,
      CurrentConfig.tokens.out,
      CurrentConfig.tokens.poolFee,
    );

    console.log({ quote, poolInfo });

    setOutputAmount(quote);
    setPoolInfo(poolInfo);
  }, []);

  const onTrade = useCallback(async () => {
    const trade = await createTrade(
      CurrentConfig.tokens.in,
      CurrentConfig.tokens.out,
      CurrentConfig.tokens.poolFee,
      CurrentConfig.tokens.amountIn,
    );
    setTrade(trade);

    await executeTrade(trade, CurrentConfig.tokens.in);
  }, []);

  return (
    <>
      <button
        onClick={async () => {
          const wallet = await connectBrowserExtensionWallet();
          setWalletAddress(wallet);
        }}
        disabled={!!walletAddress}
      >
        {walletAddress
          ? `Connected with ${walletAddress.slice(
              0,
              4,
            )}...${walletAddress.slice(-4)}`
          : 'Connect Metamask'}
      </button>
      {CurrentConfig.rpc.mainnet === '' && (
        <h2 className="error">Please set your mainnet RPC URL in config.ts</h2>
      )}
      <h3>{`Quote input amount: ${CurrentConfig.tokens.amountIn} ${CurrentConfig.tokens.in.symbol}`}</h3>
      <h3>{`Quote output amount: ${outputAmount} ${CurrentConfig.tokens.out.symbol}`}</h3>
      <button onClick={onQuote}>
        <p>Quote</p>
      </button>
      <button onClick={onTrade}>
        <p>Trade</p>
      </button>
    </>
  );
};
