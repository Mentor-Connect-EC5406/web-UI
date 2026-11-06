import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { queryClient } from './data/queryClient';
import { router } from './app/router';
import { AsgardeoSession } from './auth/AsgardeoSession';
import './styles/globals.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AsgardeoSession>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AsgardeoSession>
  </StrictMode>,
);
