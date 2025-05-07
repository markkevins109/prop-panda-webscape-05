
import { z } from "zod";

// Step 1: Email entry schema
export const emailSchema = z.object({
  email: z.string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
});

// Step 2: OTP verification schema
export const otpSchema = z.object({
  otp: z.string()
    .length(6, "OTP must be 6 characters")
    .refine((val) => /^\d{6}$/.test(val), {
      message: "OTP must contain only numbers",
    }),
});

// Step 3: New password schema with stronger validation
export const passwordSchema = z.object({
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string()
    .min(8, "Password must be at least 8 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type EmailFormValues = z.infer<typeof emailSchema>;
export type OtpFormValues = z.infer<typeof otpSchema>;
export type PasswordFormValues = z.infer<typeof passwordSchema>;
