import { Web3Provider } from '@ethersproject/providers';
import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { useWeb3React } from '@web3-react/core';
import { Contract } from 'ethers';
import { useState, useEffect } from 'react';
import myTokenAbi from '~/abis/mytoken.json';
import { MY_TOKEN } from '~/utils/constants';

export function useMyToken(): {
  contract: Contract | null;
} {
  const [contract, setContract] = useState<Contract | null>(null);

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
    setContract(contract);
  }, [provider, account]);

  return {
    contract,
  };
}

export function useIsBlackListed(address?: string): UseQueryResult<boolean, Error> {
  const { contract } = useMyToken();
  console.log('contract', contract);

  return useQuery(
    ['isBlackListed'],
    () => {
      console.log('contract', contract);
      return contract?.blackList?.(address);
    },
    {
      enabled: !!contract && !!address,
    },
  );
}
