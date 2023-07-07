import { Token } from '~/types/tokens';
import { CHAINS } from '~/walletActions/chains';
import { ChainId } from '~/walletActions/types';

export const ONE_HOUR = 60 * 60 * 1000;

export const UNISWAP_TOKEN_LIST_URL = 'https://gateway.ipfs.io/ipns/tokens.uniswap.org';

const USDC_TOKEN_LOGO_URL =
  'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png';

export const USDC_TOKEN: Record<ChainId, Token> = {
  [ChainId.MAINNET]: {
    chainId: Number(ChainId.MAINNET),
    name: 'USDC',
    symbol: 'USDC',
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    decimals: 6,
    logoURI: USDC_TOKEN_LOGO_URL,
  },
  [ChainId.OPTIMISM]: {
    chainId: Number(ChainId.OPTIMISM),
    name: 'USDC',
    symbol: 'USDC',
    address: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
    decimals: 6,
    logoURI: USDC_TOKEN_LOGO_URL,
  },
  [ChainId.BSC]: {
    chainId: Number(ChainId.BSC),
    name: 'USDC',
    symbol: 'USDC',
    address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
    decimals: 18,
    logoURI: USDC_TOKEN_LOGO_URL,
  },
  [ChainId.POLYGON]: {
    chainId: Number(ChainId.POLYGON),
    name: 'USDC',
    symbol: 'USDC',
    address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    decimals: 6,
    logoURI: USDC_TOKEN_LOGO_URL,
  },
  [ChainId.ARBITRUM]: {
    chainId: Number(ChainId.ARBITRUM),
    name: 'USDC',
    symbol: 'USDC',
    address: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
    decimals: 6,
    logoURI: USDC_TOKEN_LOGO_URL,
  },
  [ChainId.AVALANCHE]: {
    chainId: Number(ChainId.AVALANCHE),
    name: 'USDC',
    symbol: 'USDC',
    address: '0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664',
    decimals: 6,
    logoURI: USDC_TOKEN_LOGO_URL,
  },
  [ChainId.FANTOM]: {
    chainId: Number(ChainId.FANTOM),
    name: 'USDC',
    symbol: 'USDC',
    address: '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
    decimals: 6,
    logoURI: USDC_TOKEN_LOGO_URL,
  },
};
