import type { ReactNode } from 'react';
import { Label } from '@/components/ui/Input';

interface FormFieldProps {
  // must match the id of the control inside
  htmlFor: string;
  label: string;
  required?: boolean;
  // inline error shown below the control
  error?: string;
  // helper text shown below the control when there is no error
  hint?: ReactNode;
  children: ReactNode;
}

// label above the control with an optional error message below
export function FormField({ htmlFor, label, required, error, hint, children }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>
        {label}
        {required && <span className="ml-0.5 text-accent" aria-hidden>*</span>}
      </Label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} className="text-xs text-accent">{error}</p>
      ) : (
        hint && <p id={`${htmlFor}-hint`} className="text-xs text-ink-muted">{hint}</p>
      )}
    </div>
  );
}
