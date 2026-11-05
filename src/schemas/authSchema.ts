import { z } from 'zod';

/**
 * Zod Validation Schema for Login Form
 * Ensures email is valid and password meets minimum length requirements.
 */
export const loginSchema = z.object({
  email: z.string().email({ message: 'कृपया ඇතුළත් කළ ইමෙල් ලිපිනය වැරදියි (Invalid email address)' }),
  password: z.string().min(6, { message: 'මුළු මුරපදය අකුරු 6 කට වඩා වැඩි විය යුතුය (Minimum 6 characters)' }),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Zod Validation Schema for Register Form
 */
export const registerSchema = z.object({
  name: z.string().min(2, { message: 'නම අකුරු 2 කට වඩා වැඩි විය යුතුය (Name is required)' }),
  email: z.string().email({ message: 'වලංගු ইමෙල් ලිපිනයක් ඇතුළත් කරන්න (Valid email is required)' }),
  password: z.string().min(6, { message: 'මුරපදය අවම වශයෙන් අකුරු 6ක් විය යුතුය (Password must be at least 6 characters)' }),
});

export type RegisterFormData = z.infer<typeof registerSchema>;