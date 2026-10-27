import { Check } from 'lucide-react';
import { BrandLogo } from '@/components/common/BrandLogo';
import { PageOutlet } from './PageOutlet';

const FOR_STUDENTS = ['Book sessions with mentors who made the same move', 'Get guidance from your first year to your first job'];
const FOR_MENTORS = ['Share your experience in hours that suit you', 'Help the next generation find their way'];

function Benefits({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-ink">{title}</h2>
      <ul className="mt-2 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-ink-secondary">
            <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden /> {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// welcome panel is hidden on phones so the form takes the full width
export function AuthLayout() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="hidden flex-col justify-between bg-brand-soft p-12 lg:flex">
        <BrandLogo size="lg" />
        <div className="max-w-md space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-ink">Your first step into industry starts here</h1>
            <p className="mt-3 text-ink-secondary">
              University teaches the theory. MentorConnect connects you with professionals who can show you the rest.
            </p>
          </div>
          <Benefits title="For students" items={FOR_STUDENTS} />
          <Benefits title="For mentors" items={FOR_MENTORS} />
        </div>
        <p className="text-sm text-ink-secondary">Connect. Learn. Grow.</p>
      </aside>

      <div className="flex flex-col items-center justify-center bg-page px-4 py-10">
        <BrandLogo size="lg" className="mb-8 lg:hidden" />
        <main className="w-full max-w-md">
          <PageOutlet />
        </main>
      </div>
    </div>
  );
}
