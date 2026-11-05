import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { queryClient } from './data/queryClient';
import { router } from './app/router';
import { AsgardeoSession } from './auth/AsgardeoSession';
import { USE_MOCKS } from './config/env';
import './styles/globals.css';

const app = (
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>{USE_MOCKS ? app : <AsgardeoSession>{app}</AsgardeoSession>}</StrictMode>,
);
