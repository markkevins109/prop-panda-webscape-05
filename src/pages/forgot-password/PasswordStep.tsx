
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Eye, EyeOff, Check, X } from "lucide-react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { passwordSchema, PasswordFormValues } from "./types";

interface PasswordStepProps {
  onSubmit: (data: PasswordFormValues) => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
  error?: string | null;
}

export default function PasswordStep({ onSubmit, onBack, isLoading, error }: PasswordStepProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const password = form.watch("password");

  // Password strength criteria check
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
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

              {/* Password strength indicators */}
              <div className="space-y-2 mt-3">
                <p className="text-xs font-medium">Password must contain:</p>
                <ul className="space-y-1 text-xs">
                  <li className="flex items-center">
                    {hasMinLength ? 
                      <Check className="w-3 h-3 mr-1 text-green-500" /> : 
                      <X className="w-3 h-3 mr-1 text-red-500" />
                    }
                    <span className={hasMinLength ? "text-green-500" : "text-muted-foreground"}>
                      At least 8 characters
                    </span>
                  </li>
                  <li className="flex items-center">
                    {hasUppercase ? 
                      <Check className="w-3 h-3 mr-1 text-green-500" /> : 
                      <X className="w-3 h-3 mr-1 text-red-500" />
                    }
                    <span className={hasUppercase ? "text-green-500" : "text-muted-foreground"}>
                      At least one uppercase letter
                    </span>
                  </li>
                  <li className="flex items-center">
                    {hasLowercase ? 
                      <Check className="w-3 h-3 mr-1 text-green-500" /> : 
                      <X className="w-3 h-3 mr-1 text-red-500" />
                    }
                    <span className={hasLowercase ? "text-green-500" : "text-muted-foreground"}>
                      At least one lowercase letter
                    </span>
                  </li>
                  <li className="flex items-center">
                    {hasNumber ? 
                      <Check className="w-3 h-3 mr-1 text-green-500" /> : 
                      <X className="w-3 h-3 mr-1 text-red-500" />
                    }
                    <span className={hasNumber ? "text-green-500" : "text-muted-foreground"}>
                      At least one number
                    </span>
                  </li>
                  <li className="flex items-center">
                    {hasSpecialChar ? 
                      <Check className="w-3 h-3 mr-1 text-green-500" /> : 
                      <X className="w-3 h-3 mr-1 text-red-500" />
                    }
                    <span className={hasSpecialChar ? "text-green-500" : "text-muted-foreground"}>
                      At least one special character
                    </span>
                  </li>
                </ul>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
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
              "Reset Password"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
