import { useState } from 'react';
import { ethers } from 'ethers';

import { USDC_TOKEN } from '../../constants';
import { ChainId } from '../../../walletActions/types';
import {
  useGetNativeBalance,
  useGetTokenBalance,
  useMultipleBalances,
} from '../hooks/useTokenBalance';
import { CHAINS } from '../../../walletActions/chains';
import { createTrade, executeTrade } from '../trading';
import { CurrentConfig } from '../config';
import { connectBrowserExtensionWallet } from '../provider';

async function connectInjectedWallet(): Promise<string | null> {
  if (!window.ethereum) {
    return null;
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const accounts: string[] = await provider.send('eth_requestAccounts', []);

  return accounts[0] ? accounts[0] : null;
}

function getProvider(chainId: ChainId): ethers.providers.JsonRpcProvider {
  try {
    return new ethers.providers.JsonRpcProvider(CHAINS[chainId].rpcUrls[0]);
  } catch (error) {
    throw new Error('No wallet found');
  }
}

export const BaseWeb3Component = (): JSX.Element => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const chainId = ChainId.OPTIMISM;
  const tokenIn = CurrentConfig.tokens.in;
  const tokenOut = CurrentConfig.tokens.out;
  const poolFee = CurrentConfig.tokens.poolFee;
  const amountIn = CurrentConfig.tokens.amountIn;

  const onClick = async (): Promise<void> => {
    if (!walletAddress) {
      // throw new Error('no wallet address onCLick');
    }

    const trade = await createTrade(tokenIn, tokenOut, poolFee, amountIn);

    console.log({ trade });

    await executeTrade(trade, CurrentConfig.tokens.in);
  };

  const getTokenBalance = useGetTokenBalance();
  const getNativeTokenBalance = useGetNativeBalance();
  const getMultipleBalances = useMultipleBalances();

  const onBalanceClick = async (): Promise<void> => {
    if (!walletAddress) {
      throw new Error('No wallet address');
    }
    const provider = getProvider(chainId);

    const balance = await getTokenBalance({
      tokenAddress: USDC_TOKEN[chainId].address,
      decimals: USDC_TOKEN[chainId].decimals,
      account: walletAddress,
      provider,
    });

    const nativeBalance = await getNativeTokenBalance(provider, walletAddress);

    const multipleBalances = await getMultipleBalances(
      provider,
      walletAddress,
      [
        { address: USDC_TOKEN[chainId].address, decimals: 6 },
        { address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063', decimals: 18 }, // DAI
        { address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f', decimals: 6 }, // USDT
      ],
    );

    // console.log({
    //   balance,
    //   nativeBalance,
    //   multipleBalances,
    // });
  };

  return (
    <>
      <button
        style={{ display: 'block' }}
        onClick={async () => {
          const wallet = await connectInjectedWallet();
          await connectBrowserExtensionWallet();
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

      <ul>
        <li>chainId: {chainId}</li>
        <li>tokenIn: {tokenIn.symbol}</li>
        <li>tokenOut: {tokenOut.symbol}</li>
        <li>poolFee: {poolFee}</li>
        <li>amountIn: {amountIn}</li>
      </ul>

      <button
        style={{ display: 'block' }}
        onClick={onClick}
        // disabled={!walletAddress}
      >
        sign
      </button>
      <button
        style={{ display: 'block' }}
        onClick={onBalanceClick}
        disabled={!walletAddress}
      >
        balanceOf
      </button>
    </>
  );
};

// const fakeTx = {
//   to: '0x4B0897b0513FdBeEc7C469D9aF4fA6C0752aBea7',
//   from: '0xDeaDbeefdEAdbeefdEadbEEFdeadbeefDEADbEEF',
//   gas: '0x76c0',
//   value: '0x8ac7230489e80000',
//   data: '0x',
//   gasPrice: '0x4a817c800',
// };
