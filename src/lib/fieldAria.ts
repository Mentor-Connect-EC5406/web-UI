// links a control to the error or hint text that FormField renders below it
export function fieldAria(id: string, error?: string, hasHint = false) {
  return {
    'aria-invalid': error ? (true as const) : undefined,
    'aria-describedby': error ? `${id}-error` : hasHint ? `${id}-hint` : undefined,
  };
}
