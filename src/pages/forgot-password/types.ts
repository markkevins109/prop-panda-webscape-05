
import { z } from "zod";

// Step 1: Email entry schema
export const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// Step 2: OTP verification schema
export const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 characters"),
});

// Step 3: New password schema
export const passwordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type EmailFormValues = z.infer<typeof emailSchema>;
export type OtpFormValues = z.infer<typeof otpSchema>;
export type PasswordFormValues = z.infer<typeof passwordSchema>;
