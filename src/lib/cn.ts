import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// later tailwind classes override earlier ones via twMerge
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
