import { OutlinedInput, styled } from '@mui/material';
import { useAppSelector } from '~/store/hooks';

const StyledAssetInput = styled(OutlinedInput, {
  name: 'StyledAssetInput',
})(({ theme }) => ({
  fontSize: 14,
  paddingRight: theme.spacing(2),
  paddingLeft: theme.spacing(2),
  '& input': {
    padding: 0,
    marginRight: theme.spacing(2),
  },
}));

export const StyledTokenImage = styled('img', {
  name: 'StyledTokenImage',
})(() => ({
  width: 24,
  height: 24,
}));

export enum AssetInputType {
  PAY = 'PAY',
  RECEIVE = 'RECEIVE',
}

interface AssetInputProps {
  type: AssetInputType;
}

export const AssetInput: React.FC<AssetInputProps> = ({ type }): JSX.Element => {
  const { youPay, youReceive } = useAppSelector(({ app }) => app);
  const { amount, token } = type === AssetInputType.PAY ? youPay : youReceive;

  return <StyledAssetInput value={amount} fullWidth endAdornment={<StyledTokenImage src={token.logoURI} />} />;
};
