import { ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { App } from './App';
import { WalletProvider } from './providers/WalletProvider';
import { store } from './store';
import './styles/index.css';
import { theme } from './theme';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <WalletProvider>
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </WalletProvider>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>,
);
