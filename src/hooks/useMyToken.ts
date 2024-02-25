import { Web3Provider } from '@ethersproject/providers';
import { UseMutationResult, UseQueryResult, useMutation, useQuery } from '@tanstack/react-query';
import { useWeb3React } from '@web3-react/core';
import { Contract } from 'ethers';
import { useState, useEffect } from 'react';
import myTokenAbi from '~/abis/mytoken.json';
import { MY_TOKEN } from '~/utils/constants';
import { useSnackbar } from './useSnackbar';

export function useMyToken(): Contract | null {
  const [myToken, setMyToken] = useState<Contract | null>(null);
  const { provider, account } = useWeb3React<Web3Provider>();

  useEffect(() => {
    if (!provider || !account) {
      return;
    }
    const contract = new Contract(
      MY_TOKEN,
      myTokenAbi,
      // todo: investigate why the fuck it is TS error here
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      provider.getSigner(),
    );
    setMyToken(contract);
  }, [provider, account]);

  // const handleTx = async (): Promise<void> => {
  //   // Example: Transfer tokens
  //   if (contract && account) {
  //     // await contract.mint?.(account, 0.009 * 10 ** 18);
  //     // const bl = await contract.blackList?.(account);
  //     // console.log('bl', bl);
  //     // setIsBlackListed(bl);
  //     await contract.transfer?.('0x9e08D72501C1ccE2916AaC582D5536f414fD8A1b', 0.009 * 10 ** 18);
  //   }
  // };

  // const addToBlackList = async (address: string): Promise<void> => {
  //   if (contract && account) {
  //     await contract.addToBlackList?.([address]);
  //   }
  // };
  return myToken;
}

export function useMyTokenDetails(): UseQueryResult<
  {
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: bigint;
  },
  Error
> {
  const myToken = useMyToken();

  return useQuery(
    ['myTokenDetails'],
    async () => ({
      name: await myToken?.name?.(),
      symbol: await myToken?.symbol?.(),
      decimals: await myToken?.decimals?.(),
      totalSupply: await myToken?.totalSupply?.(),
    }),
    {
      enabled: !!myToken,
      staleTime: Infinity,
      cacheTime: Infinity,
    },
  );
}

export function useIsBlackListed(address?: string): UseQueryResult<boolean, Error> {
  const myToken = useMyToken();

  return useQuery(
    ['isBlackListed', address],
    () => {
      return myToken?.blackList?.(address);
    },
    { enabled: !!myToken && !!address },
  );
}

export function useBalanceOf(address?: string): UseQueryResult<string, Error> {
  const myToken = useMyToken();
  return useQuery(
    ['balanceOf', address],
    () => {
      return myToken?.balanceOf?.(address);
    },
    { enabled: !!myToken && !!address },
  );
}

export function useAllowance(address?: string): UseQueryResult<string, Error> {
  const myToken = useMyToken();
  return useQuery(
    ['allowance', address],
    () => {
      return myToken?.allowance?.(address, address);
    },
    { enabled: !!myToken && !!address },
  );
}

export function useTransfer(): UseMutationResult<void, unknown, { to: string; amount: string }> {
  const myToken = useMyToken();
  const { showSnackbar } = useSnackbar();
  return useMutation(
    ['transfer'],
    async ({ to, amount }) => {
      await myToken?.transfer?.(to, amount);
    },
    {
      onError: () => {
        showSnackbar({
          message: 'Error transferring tokens',
          severity: 'error',
        });
      },
    },
  );
}
