import type { ReactNode } from 'react';
import { Label } from '@/components/ui/Input';

interface FormFieldProps {
  // must match the id of the control inside
  htmlFor: string;
  label: string;
  required?: boolean;
  // inline error shown below the control
  error?: string;
  children: ReactNode;
}

// label above the control with an optional error message below
export function FormField({ htmlFor, label, required, error, children }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>
        {label}
        {required && <span className="ml-0.5 text-accent" aria-hidden>*</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-accent">{error}</p>}
    </div>
  );
}
