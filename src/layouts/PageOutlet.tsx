import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { LoadingState } from '@/components/common/LoadingState';

// suspense wrapper for lazy loaded pages, every layout uses this
export function PageOutlet() {
  return (
    <Suspense fallback={<LoadingState />}>
      <Outlet />
    </Suspense>
  );
}
