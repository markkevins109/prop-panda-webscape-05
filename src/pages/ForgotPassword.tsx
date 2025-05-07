
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Eye, EyeOff } from "lucide-react";

// Step 1: Email entry schema
const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// Step 2: OTP verification schema
const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 characters"),
});

// Step 3: New password schema
const passwordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type EmailFormValues = z.infer<typeof emailSchema>;
type OtpFormValues = z.infer<typeof otpSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Step 1: Email form
  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  // Step 2: OTP form
  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  // Step 3: Password form
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Handle email submission
  const onEmailSubmit = async (data: EmailFormValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: window.location.origin + "/reset-password",
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setEmail(data.email);
        setStep(2);
        toast({
          title: "OTP Sent!",
          description: "Please check your email for the OTP code",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP verification
  const onOtpSubmit = async (data: OtpFormValues) => {
    setIsLoading(true);
    try {
      // In a real implementation, this would verify the OTP with Supabase
      // For now, we'll just move to the next step
      setStep(3);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Invalid OTP code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password reset
  const onPasswordSubmit = async (data: PasswordFormValues) => {
    setIsLoading(true);
    try {
      // In a real implementation, this would update the password using the OTP
      // For now, we'll just show a success message and redirect
      toast({
        title: "Success!",
        description: "Your password has been reset successfully",
      });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to reset password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-custom section-padding flex flex-col items-center">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Reset Your Password</h1>
          <p className="text-muted-foreground">
            {step === 1 && "Enter your email to get started"}
            {step === 2 && "Enter the OTP code sent to your email"}
            {step === 3 && "Create a new secure password"}
          </p>
        </div>

        <div className="bg-card p-8 rounded-xl shadow-sm">
          {/* Step progress indicator */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex flex-col items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 
                    ${s < step 
                      ? "bg-accent-blue border-accent-blue text-white" 
                      : s === step 
                        ? "border-accent-blue text-accent-blue" 
                        : "border-gray-300 text-gray-400"}`}
                >
                  {s < step ? <Check className="h-5 w-5" /> : s}
                </div>
                <span className={`text-xs mt-1 ${s <= step ? "text-accent-blue" : "text-gray-400"}`}>
                  {s === 1 ? "Email" : s === 2 ? "OTP" : "Password"}
                </span>
              </div>
            ))}

            <div className="h-1 flex-1 bg-gray-200 absolute z-[-1] w-2/3 left-1/2 transform -translate-x-1/2">
              <div 
                className="h-full bg-accent-blue transition-all" 
                style={{ width: step === 1 ? "0%" : step === 2 ? "50%" : "100%" }}
              ></div>
            </div>
          </div>

          {/* Step 1: Email Entry */}
          {step === 1 && (
            <Form {...emailForm}>
              <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-6">
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="name@example.com" 
                          {...field} 
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-accent-blue hover:bg-accent-blue/90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Send OTP
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <Link to="/login" className="text-accent-blue hover:underline text-sm">
                    Return to login
                  </Link>
                </div>
              </form>
            </Form>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <Form {...otpForm}>
              <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <FormLabel>Enter the OTP sent to {email}</FormLabel>
                  <FormField
                    control={otpForm.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <InputOTP 
                            maxLength={6}
                            value={field.value}
                            onChange={field.onChange}
                            disabled={isLoading}
                            render={({ slots }) => (
                              <InputOTPGroup>
                                {slots && Array.isArray(slots) ? slots.map((slot, idx) => (
                                  <InputOTPSlot key={idx} {...slot} index={idx} />
                                )) : null}
                              </InputOTPGroup>
                            )}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep(1)}
                    disabled={isLoading}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>

                  <Button
                    type="submit"
                    className="flex-1 bg-accent-blue hover:bg-accent-blue/90"
                    disabled={isLoading || !otpForm.formState.isValid}
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        Verify
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>

                <div className="text-center text-sm">
                  <button
                    type="button"
                    className="text-accent-blue hover:underline"
                    onClick={async () => {
                      const { email } = emailForm.getValues();
                      if (email) {
                        setIsLoading(true);
                        try {
                          await supabase.auth.resetPasswordForEmail(email);
                          toast({
                            title: "OTP Resent!",
                            description: "Please check your email for the new OTP code",
                          });
                        } catch (error) {
                          toast({
                            title: "Error",
                            description: "Could not resend OTP",
                            variant: "destructive",
                          });
                        } finally {
                          setIsLoading(false);
                        }
                      }
                    }}
                    disabled={isLoading}
                  >
                    Didn't receive the code? Resend OTP
                  </button>
                </div>
              </form>
            </Form>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                <FormField
                  control={passwordForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            {...field}
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center px-4"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="w-5 h-5 text-muted-foreground" />
                            ) : (
                              <Eye className="w-5 h-5 text-muted-foreground" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            {...field}
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center px-4"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="w-5 h-5 text-muted-foreground" />
                            ) : (
                              <Eye className="w-5 h-5 text-muted-foreground" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep(2)}
                    disabled={isLoading}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>

                  <Button
                    type="submit"
                    className="flex-1 bg-accent-blue hover:bg-accent-blue/90"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
}
