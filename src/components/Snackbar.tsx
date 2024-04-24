import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';
import { useSnackbar } from '~/hooks/useSnackbar';
import { SNACKBAR_DURATION } from '~/utils/constants';

export const SnackBar = (): JSX.Element => {
  const { isOpen, message, severity, hideSnackbar } = useSnackbar();

  return (
    <>
      <Snackbar
        open={isOpen}
        autoHideDuration={SNACKBAR_DURATION}
        onClose={hideSnackbar}
      >
        <Alert onClose={hideSnackbar} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};
