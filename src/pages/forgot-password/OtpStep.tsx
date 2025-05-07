
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { otpSchema, OtpFormValues } from "./types";

interface OtpStepProps {
  onSubmit: (data: OtpFormValues) => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
  email: string;
  handleResendOTP: () => void;
  otpResendCooldown: number;
}

export default function OtpStep({ 
  onSubmit, 
  onBack, 
  isLoading, 
  email,
  handleResendOTP,
  otpResendCooldown
}: OtpStepProps) {
  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <FormLabel>Enter the OTP sent to {email}</FormLabel>
          <FormField
            control={form.control}
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
            onClick={onBack}
            disabled={isLoading}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <Button
            type="submit"
            className="flex-1 bg-accent-blue hover:bg-accent-blue/90"
            disabled={isLoading || !form.formState.isValid}
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
            onClick={handleResendOTP}
            disabled={isLoading || otpResendCooldown > 0}
          >
            {otpResendCooldown > 0 
              ? `Resend OTP in ${otpResendCooldown}s` 
              : "Didn't receive the code? Resend OTP"}
          </button>
        </div>
      </form>
    </Form>
  );
}
