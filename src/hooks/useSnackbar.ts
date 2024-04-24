import { useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '~/store/hooks';
import {
  SnackbarState,
  openSnackbar,
  closeSnackbar,
} from '~/store/snackbarSlice';

export const useSnackbar = (): SnackbarState & {
  showSnackbar: (props: Omit<SnackbarState, 'isOpen'>) => void;
  hideSnackbar: () => void;
} => {
  const state = useAppSelector(({ snackbar }) => snackbar);
  const dispatch = useAppDispatch();

  const showSnackbar = useCallback(
    (message: Pick<SnackbarState, 'message' | 'severity'>) => {
      dispatch(openSnackbar(message));
    },
    [dispatch],
  );
  const hideSnackbar = useCallback(() => {
    dispatch(closeSnackbar());
  }, [dispatch]);

  return {
    ...state,
    showSnackbar,
    hideSnackbar,
  };
};
