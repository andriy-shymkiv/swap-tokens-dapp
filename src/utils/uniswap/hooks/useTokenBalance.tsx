import { JsonRpcProvider } from '@ethersproject/providers';
import { formatUnits } from '@ethersproject/units';
import { ethers, BigNumber } from 'ethers';
import { useCallback } from 'react';
import { UNISWAP_MULTICALL_ADDRESS_POLYGON } from '../constants';

interface GetTokenBalanceInput {
  tokenAddress: string;
  decimals: number;
  account: string;
  provider: JsonRpcProvider;
}

interface GetTokenBalanceOutput {
  hex: string;
  amount: string;
  humanAmount: string;
}

export function useGetTokenBalance(): (
  args: GetTokenBalanceInput,
) => Promise<GetTokenBalanceOutput> {
  return useCallback(
    async (args: GetTokenBalanceInput): Promise<GetTokenBalanceOutput> => {
      const { tokenAddress, decimals, account, provider } = args;

      const contract = new ethers.Contract(
        tokenAddress,
        ['function balanceOf(address owner) view returns (uint256)'],
        provider,
      );

      const balanceOf = await contract.balanceOf?.(account);
      return {
        hex: balanceOf._hex,
        amount: BigNumber.from(balanceOf).toString(),
        humanAmount: formatUnits(balanceOf, decimals),
      };
    },
    [],
  );
}

export function useGetNativeBalance(): (
  provider: JsonRpcProvider,
  account: string,
) => Promise<GetTokenBalanceOutput> {
  return useCallback(async (provider: JsonRpcProvider, account: string) => {
    const balanceOf = await provider.getBalance(account);

    return {
      hex: balanceOf._hex,
      amount: BigNumber.from(balanceOf).toString(),
      humanAmount: formatUnits(balanceOf, 18),
    };
  }, []);
}

export function useMultipleBalances() {
  return useCallback(
    async (
      provider: JsonRpcProvider,
      account: string,
      tokens: { address: string; decimals: number }[],
    ) => {
      const aggregateCalls = tokens.map(({ address }) => {
        return {
          target: address,
          callData: new ethers.utils.Interface([
            'function balanceOf(address owner) view returns (uint256)',
          ]).encodeFunctionData('balanceOf', [account]),
        };
      });
      console.log({ calls: aggregateCalls });
      const multicall = new ethers.Contract(
        UNISWAP_MULTICALL_ADDRESS_POLYGON,
        [
          'function aggregate((address target,bytes callData)[] calls) public view returns (uint256,bytes[])',
        ],
        provider,
      );

      const [, response] = await multicall.aggregate(aggregateCalls);
      console.log({ response });

      const balances = (response as string[]).map((response, i) => {
        const balance = new ethers.utils.Interface([
          'function balanceOf(address owner) view returns (uint256)',
        ]).decodeFunctionResult('balanceOf', response);
        console.log({ balance, i }, Array.isArray(balance));

        return {
          token: tokens[i],
          hex: balance[0]._hex,
          balance: balance[0].toString(),
          humanBalance: formatUnits(balance[0], tokens[i]?.decimals),
        };
      });

      return balances;
    },
    [],
  );
}
