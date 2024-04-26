import { ethers, providers } from 'ethers';

const browserExtensionProvider = createBrowserExtensionProvider();
let walletExtensionAddress: string | null = null;

// Interfaces

export enum TransactionState {
  Failed = 'Failed',
  New = 'New',
  Rejected = 'Rejected',
  Sending = 'Sending',
  Sent = 'Sent',
}

export function getProvider(): providers.Provider | null {
  return browserExtensionProvider;
}

export function getWalletAddress(): string | null {
  return walletExtensionAddress;
}

export async function sendTransaction(
  transaction: ethers.providers.TransactionRequest,
): Promise<TransactionState> {
  try {
    console.log('sending transaction...');
    const signer = browserExtensionProvider?.getSigner();
    const receipt = await signer?.sendTransaction(transaction);

    if (receipt) {
      return TransactionState.Sent;
    } else {
      return TransactionState.Failed;
    }
  } catch (e) {
    console.log(e);
    return TransactionState.Rejected;
  }
}

export async function connectBrowserExtensionWallet(): Promise<
  string | null | undefined
> {
  if (!window.ethereum) {
    return null;
  }

  const { ethereum } = window;
  const provider = new ethers.providers.Web3Provider(ethereum);
  const accounts = await provider.send('eth_requestAccounts', []);

  if (accounts.length !== 1) {
    return;
  }

  walletExtensionAddress = accounts[0];
  return walletExtensionAddress;
}

function createBrowserExtensionProvider(): ethers.providers.Web3Provider {
  try {
    return new ethers.providers.Web3Provider(window?.ethereum, 'any');
  } catch (e) {
    throw new Error('No Wallet Extension Found');
  }
}
