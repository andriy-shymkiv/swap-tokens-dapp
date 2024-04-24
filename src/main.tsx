import { ThemeProvider } from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { App } from './App';
import { ReactQueryProvider } from './providers/ReactQueryProvider';
import { WalletProvider } from './providers/WalletProvider';
import { store } from './store';
import '~/styles/index.css';
import { theme } from './theme';
import { SnackBar } from './components/Snackbar';
import { UniswapComponent } from './UniswapComponent';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <ReactQueryProvider>
        <WalletProvider>
          <ThemeProvider theme={theme}>
            {/* <App /> */}
            <UniswapComponent />
            <SnackBar />
          </ThemeProvider>
        </WalletProvider>
      </ReactQueryProvider>
    </Provider>
  </React.StrictMode>,
);
