import { SelectChangeEvent, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import { useCallback } from 'react';
import { setSelectedChainId } from '~/store/appSlice';
import { useAppDispatch, useAppSelector } from '~/store/hooks';
import { CHAINS_TO_DISPLAY, CHAINS } from '~/walletActions/chains';
import { ChainId } from '~/walletActions/types';
import { ChainIcon } from './common/ChainIcon';
import { useSwitchNetwork } from '~/hooks/useSwitchNetwork';

export const SelectChain: React.FC = () => {
  const dispatch = useAppDispatch();
  const { selectedChainId } = useAppSelector(({ app }) => app);
  const switchNetwork = useSwitchNetwork();

  const handleChange = useCallback(
    async (event: SelectChangeEvent<ChainId>) => {
      const chainId = event.target.value as ChainId;

      try {
        await switchNetwork(chainId);
        dispatch(setSelectedChainId(chainId));
      } catch (error) {
        console.error(error);
        throw new Error(`Failed to switch to chain ${chainId}`);
      }
    },
    [switchNetwork, dispatch],
  );

  return (
    <FormControl>
      <InputLabel>{'Chain'}</InputLabel>
      <Select label="Chain" value={selectedChainId} onChange={handleChange}>
        {CHAINS_TO_DISPLAY.map((chain) => (
          <MenuItem value={chain} key={chain}>
            <Box display={'flex'} alignItems={'center'} gap={2}>
              <ChainIcon chainId={chain as ChainId} />
              {CHAINS[chain as ChainId].name}
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
