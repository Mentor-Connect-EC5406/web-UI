import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/common/EmptyState';
import { paths } from '@/app/paths';

interface StatusPageProps {
  code: number;
  title: string;
  description: string;
}

/** Full-page message for 403 / 404 / unexpected errors */
function StatusPage({ code, title, description }: StatusPageProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-page p-6">
      <div className="max-w-md text-center">
        <p className="text-6xl font-bold text-ink">{code}</p>
        <h1 className="mt-2 text-2xl font-semibold text-ink">{title}</h1>
        <p className="mt-2 text-ink-secondary">{description}</p>
        <div className="mt-8 flex justify-center gap-3">
          <Button variant="secondary" onClick={() => window.history.back()}>Go back</Button>
          <Button asChild>
            <Link to={paths.home}>Go home</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

export function NotFoundPage() {
  return <StatusPage code={404} title="Page not found" description="The page you're looking for doesn't exist or has moved." />;
}

export function ForbiddenPage() {
  return <StatusPage code={403} title="Access denied" description="Your account doesn't have access to this page." />;
}

/** Error inside a layout: keeps the navigation around it and offers a reload */
export function PageErrorPage() {
  return (
    <EmptyState
      icon={AlertCircle}
      tone="error"
      title="This page ran into a problem"
      description="Try reloading. If it keeps happening, use the menu to go somewhere else."
      action={<Button variant="secondary" onClick={() => window.location.reload()}>Reload page</Button>}
    />
  );
}

/** Top-level router `errorElement`: last resort when even a layout fails */
export function RouteErrorPage() {
  const error = useRouteError();
  if (isRouteErrorResponse(error) && error.status === 404) return <NotFoundPage />;
  return <StatusPage code={500} title="Something went wrong" description="Please try again. If it keeps happening, contact support." />;
}
