import { Briefcase, GraduationCap, type LucideIcon } from 'lucide-react';
import type { OnboardingRole } from '@/types';
import { cn } from '@/lib/cn';

const OPTIONS: Record<OnboardingRole, { title: string; text: string; icon: LucideIcon }> = {
  STUDENT: { title: "I'm a student", text: 'Find mentors and book sessions', icon: GraduationCap },
  MENTOR: { title: "I'm a mentor", text: 'Share your industry experience', icon: Briefcase },
};

interface RoleChoiceProps {
  value: OnboardingRole;
  onChange: (role: OnboardingRole) => void;
}

// admin role is never offered here as it is not self service
export function RoleChoice({ value, onChange }: RoleChoiceProps) {
  return (
    <div role="radiogroup" aria-label="I am a" className="grid grid-cols-2 gap-4">
      {(Object.keys(OPTIONS) as OnboardingRole[]).map((role) => {
        const { title, text, icon: Icon } = OPTIONS[role];
        const selected = value === role;
        return (
          <button
            key={role}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(role)}
            className={cn(
              'flex w-full flex-col items-center gap-3 rounded-2xl border-2 p-5 text-center transition-colors',
              selected ? 'border-brand bg-brand-soft' : 'border-line bg-surface hover:border-line-strong',
            )}
          >
            <span className={cn('flex size-12 items-center justify-center rounded-full', selected ? 'bg-brand' : 'bg-surface-muted')}>
              <Icon className="size-6 text-ink" aria-hidden />
            </span>
            <span>
              <span className="block font-semibold text-ink">{title}</span>
              <span className="mt-0.5 block text-xs text-ink-secondary">{text}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
