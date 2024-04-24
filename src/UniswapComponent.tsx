import { useCallback, useState } from 'react';
import { CurrentConfig, getQuote } from './utils/uniswap/quote';

export const UniswapComponent = (): JSX.Element => {
  const [outputAmount, setOutputAmount] = useState<string>();

  const onQuote = useCallback(async () => {
    setOutputAmount(await getQuote());
  }, []);

  return (
    <>
      {CurrentConfig.rpc.mainnet === '' && (
        <h2 className="error">Please set your mainnet RPC URL in config.ts</h2>
      )}
      <h3>{`Quote input amount: ${CurrentConfig.tokens.amountIn} ${CurrentConfig.tokens.in.symbol}`}</h3>
      <h3>{`Quote output amount: ${outputAmount} ${CurrentConfig.tokens.out.symbol}`}</h3>
      <button onClick={onQuote}>
        <p>Quote</p>
      </button>
    </>
  );
};
