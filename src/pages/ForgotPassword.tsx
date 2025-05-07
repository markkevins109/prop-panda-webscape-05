
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { EmailFormValues, OtpFormValues, PasswordFormValues } from "./forgot-password/types";

// Import the components
import StepIndicator from "./forgot-password/StepIndicator";
import EmailStep from "./forgot-password/EmailStep";
import OtpStep from "./forgot-password/OtpStep";
import PasswordStep from "./forgot-password/PasswordStep";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [lastOtpSentTime, setLastOtpSentTime] = useState(0);
  const [otpResendCooldown, setOtpResendCooldown] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Handle email submission
  const onEmailSubmit = async (data: EmailFormValues) => {
    setError(null);
    setIsLoading(true);
    try {
      console.log("Sending password reset email to:", data.email);
      
      // Check for cooldown period
      const now = Date.now();
      if (now - lastOtpSentTime < 30000) { // 30 seconds cooldown
        const remainingCooldown = Math.ceil((30000 - (now - lastOtpSentTime)) / 1000);
        setError(`Please wait ${remainingCooldown} seconds before requesting another OTP`);
        setIsLoading(false);
        return;
      }
      
      const { error: supabaseError } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: window.location.origin + "/reset-password",
      });

      if (supabaseError) {
        console.error("Password reset error:", supabaseError);
        setError(supabaseError.message);
        toast({
          title: "Error",
          description: supabaseError.message,
          variant: "destructive",
        });
      } else {
        setEmail(data.email);
        setStep(2);
        setLastOtpSentTime(Date.now());
        toast({
          title: "OTP Sent!",
          description: "Please check your email for the OTP code. If you don't see it, check your spam folder.",
        });
        
        // Start the cooldown timer
        setOtpResendCooldown(30);
        const timer = setInterval(() => {
          setOtpResendCooldown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (error: any) {
      console.error("Unexpected error during password reset:", error);
      setError("An unexpected error occurred. Please try again.");
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
    setError(null);
    setIsLoading(true);
    try {
      // In a real implementation, this would verify the OTP with Supabase
      // For now, we'll just move to the next step
      console.log("Verifying OTP:", data.otp);
      
      // For demonstration purposes, let's simulate validation
      if (data.otp === "000000") {
        setError("Invalid OTP. Please try again or request a new code.");
        setIsLoading(false);
        return;
      }
      
      setStep(3);
    } catch (error: any) {
      console.error("OTP verification error:", error);
      setError("Failed to verify OTP. Please try again.");
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
    setError(null);
    setIsLoading(true);
    try {
      // In a real implementation, this would update the password using the OTP
      console.log("Setting new password");
      
      // For demonstration, simulate an API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast({
        title: "Success!",
        description: "Your password has been reset successfully",
      });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      console.error("Password reset error:", error);
      setError("Failed to reset password. Please try again.");
      toast({
        title: "Error",
        description: "Failed to reset password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle OTP resend
  const handleResendOTP = async () => {
    setError(null);
    if (otpResendCooldown > 0) {
      setError(`Please wait ${otpResendCooldown} seconds before requesting another OTP`);
      return;
    }
    
    setIsLoading(true);
    try {
      console.log("Resending OTP to:", email);
      const { error: supabaseError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/reset-password",
      });

      if (supabaseError) {
        console.error("OTP resend error:", supabaseError);
        setError(supabaseError.message);
        toast({
          title: "Error",
          description: supabaseError.message,
          variant: "destructive",
        });
      } else {
        setLastOtpSentTime(Date.now());
        toast({
          title: "OTP Resent!",
          description: "Please check your email for the new OTP code",
        });
        
        // Start the cooldown timer
        setOtpResendCooldown(30);
        const timer = setInterval(() => {
          setOtpResendCooldown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (error) {
      console.error("Unexpected error during OTP resend:", error);
      setError("Could not resend OTP. Please try again later.");
      toast({
        title: "Error",
        description: "Could not resend OTP",
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
          <StepIndicator currentStep={step} />

          {/* Step 1: Email Entry */}
          {step === 1 && (
            <EmailStep 
              onSubmit={onEmailSubmit} 
              isLoading={isLoading} 
              error={error}
            />
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <OtpStep 
              onSubmit={onOtpSubmit} 
              onBack={() => setStep(1)}
              isLoading={isLoading}
              email={email}
              handleResendOTP={handleResendOTP}
              otpResendCooldown={otpResendCooldown}
              error={error}
            />
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <PasswordStep 
              onSubmit={onPasswordSubmit} 
              onBack={() => setStep(2)}
              isLoading={isLoading}
              error={error}
            />
          )}
        </div>
      </div>
    </div>
  );
}
