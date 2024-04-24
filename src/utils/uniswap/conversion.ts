import { BigNumber, ethers } from 'ethers';

const READABLE_FORM_LEN = 4;

export function fromHumanAmount(amount: number, decimals: number): BigNumber {
  return ethers.utils.parseUnits(amount.toString(), decimals);
}

export function toHumanAmount(rawAmount: number, decimals: number): string {
  return ethers.utils
    .formatUnits(rawAmount, decimals)
    .slice(0, READABLE_FORM_LEN);
}
