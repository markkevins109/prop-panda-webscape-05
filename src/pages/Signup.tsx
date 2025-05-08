
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/contexts/AuthContext";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const signupSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  password: z.string().refine((val) => passwordRegex.test(val), {
    message: "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character",
  }),
  confirmPassword: z.string(),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
  privacyAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the privacy policy",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
      privacyAccepted: false,
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    
    try {
      const { error } = await signUp(
        data.email, 
        data.password, 
        {
          fullName: data.fullName,
          phone: data.phone
        }
      );
      
      if (!error) {
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password: string): {strength: string, color: string} => {
    if (!password) return { strength: "", color: "" };
    
    const hasLength = password.length >= 8;
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
    
    const score = [hasLength, hasLowerCase, hasUpperCase, hasNumbers, hasSpecialChars].filter(Boolean).length;
    
    if (score <= 2) return { strength: "Weak", color: "bg-red-500" };
    if (score <= 3) return { strength: "Medium", color: "bg-yellow-500" };
    if (score <= 4) return { strength: "Strong", color: "bg-green-500" };
    return { strength: "Very Strong", color: "bg-green-700" };
  };

  const passwordStrength = getPasswordStrength(form.watch("password"));

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-secondary/80 py-10 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-lg animate-fade-in">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Create an account</h1>
          <p className="text-muted-foreground">
            Enter your details to get started with Prop Panda
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg border border-secondary/50 hover:shadow-xl transition-all duration-300">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="John Doe" 
                        {...field} 
                        disabled={isLoading} 
                        className="bg-secondary/30 border-secondary focus:border-accent-blue"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
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
                        className="bg-secondary/30 border-secondary focus:border-accent-blue"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="+1 (555) 123-4567" 
                        {...field} 
                        disabled={isLoading} 
                        className="bg-secondary/30 border-secondary focus:border-accent-blue"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
                          disabled={isLoading}
                          className="bg-secondary/30 border-secondary focus:border-accent-blue"
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
                    {field.value && (
                      <div className="mt-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">Password strength:</span>
                          <span className="text-sm font-medium">{passwordStrength.strength}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${passwordStrength.color}`} 
                            style={{ width: `${(getPasswordStrength(field.value).strength ? 
                              ["Weak", "Medium", "Strong", "Very Strong"].indexOf(passwordStrength.strength) + 1 : 0) * 25}%` }}
                          ></div>
                        </div>
                        <ul className="text-xs mt-2 text-muted-foreground">
                          <li className="flex items-center gap-1">
                            <Check className={`h-3 w-3 ${/[A-Z]/.test(field.value) ? 'text-green-500' : 'text-muted'}`} />
                            <span>Uppercase letter</span>
                          </li>
                          <li className="flex items-center gap-1">
                            <Check className={`h-3 w-3 ${/[a-z]/.test(field.value) ? 'text-green-500' : 'text-muted'}`} />
                            <span>Lowercase letter</span>
                          </li>
                          <li className="flex items-center gap-1">
                            <Check className={`h-3 w-3 ${/\d/.test(field.value) ? 'text-green-500' : 'text-muted'}`} />
                            <span>Number</span>
                          </li>
                          <li className="flex items-center gap-1">
                            <Check className={`h-3 w-3 ${/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(field.value) ? 'text-green-500' : 'text-muted'}`} />
                            <span>Special character</span>
                          </li>
                          <li className="flex items-center gap-1">
                            <Check className={`h-3 w-3 ${field.value.length >= 8 ? 'text-green-500' : 'text-muted'}`} />
                            <span>8+ characters</span>
                          </li>
                        </ul>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
                          disabled={isLoading}
                          className="bg-secondary/30 border-secondary focus:border-accent-blue"
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

              <FormField
                control={form.control}
                name="termsAccepted"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="font-normal cursor-pointer">
                        I accept the <Link to="/terms" className="text-accent-blue hover:underline">Terms and Conditions</Link>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="privacyAccepted"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="font-normal cursor-pointer">
                        I accept the <Link to="/privacy" className="text-accent-blue hover:underline">Privacy Policy</Link>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full mt-6 bg-accent-blue hover:bg-accent-blue/90 transform transition-all duration-300 hover:scale-105"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <span className="mr-2">Creating account...</span>
                  </span>
                ) : (
                  <span className="flex items-center">
                    Create account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="text-accent-blue hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
