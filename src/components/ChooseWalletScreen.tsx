import { useConnectWallet } from '~/hooks/useConnectWallet';
import { AVAILABLE_CONNECTIONS } from '~/walletActions/connections';
import { PrimaryButton } from './common/PrimaryButton';

export const ChooseWalletScreen: React.FC = (): JSX.Element => {
  const { mutate: connectWalletMutate } = useConnectWallet();

  return (
    <>
      {AVAILABLE_CONNECTIONS.map((connection) => (
        <PrimaryButton
          fullWidth
          variant={'contained'}
          key={connection.type}
          onClick={(): void => connectWalletMutate(connection)}
        >
          {connection.type}
        </PrimaryButton>
      ))}
    </>
  );
};
