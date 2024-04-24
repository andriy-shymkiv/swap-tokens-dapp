import { Box } from '@mui/material';
import MoodBadIcon from '@mui/icons-material/MoodBad';
import { ReactNode } from 'react';

export const ErrorCommon = ({
  message,
}: {
  message: ReactNode;
}): JSX.Element => {
  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
    >
      <MoodBadIcon fontSize="large" />
      {message}
    </Box>
  );
};
