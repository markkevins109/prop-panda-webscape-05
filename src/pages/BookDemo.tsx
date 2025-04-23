import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  phoneNumber: z
    .string()
    .regex(/^\+65\s\d{8}$/, {
      message: "Phone number must be in Singapore format (+65 XXXXXXXX).",
    }),
  organisation: z.string().optional(),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  preferredDate: z.date({
    required_error: "Please select a date for your demo.",
  }),
  preferredTime: z.string({
    required_error: "Please select a time for your demo.",
  }),
  propertyTypeInterest: z.string().optional(),
  message: z.string().optional(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the privacy policy to proceed.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const timeSlots = Array.from({ length: 19 }, (_, i) => {
  const hour = Math.floor(i / 2) + 9;
  const minute = i % 2 === 0 ? "00" : "30";
  const amPm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour > 12 ? hour - 12 : hour;
  return {
    value: `${hour.toString().padStart(2, "0")}:${minute}`,
    label: `${displayHour}:${minute} ${amPm}`,
  };
});

const propertyTypes = [
  { value: "hdb", label: "HDB" },
  { value: "condominium", label: "Condominium" },
  { value: "landed", label: "Landed Property" },
  { value: "commercial", label: "Commercial" },
];

export default function BookDemo() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [testModeInfo, setTestModeInfo] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phoneNumber: "+65 ",
      organisation: "",
      email: "",
      message: "",
      acceptTerms: false,
    },
  });

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    setErrorMessage(null);
    setDebugInfo(null);
    setTestModeInfo(null);

    try {
      console.log("Submitting demo booking for:", data.email);
      
      const { data: emailResponse, error: emailError } = await supabase.functions.invoke('send-demo-confirmation', {
        body: {
          name: data.name,
          email: data.email,
          preferredDate: format(data.preferredDate, 'PPP'),
          preferredTime: data.preferredTime
        },
      });

      if (emailError) {
        console.error("Error from edge function:", emailError);
        setDebugInfo(`Edge function error: ${JSON.stringify(emailError)}`);
        throw new Error(emailError.message || "Failed to send confirmation email");
      }
      
      console.log("Email response:", emailResponse);
      setDebugInfo(`Email API response: ${JSON.stringify(emailResponse)}`);
      
      if (emailResponse?.error) {
        throw new Error(`Email service error: ${emailResponse.error}`);
      }

      if (emailResponse?.testMode) {
        setTestModeInfo(`Note: Resend is in test mode. The confirmation was sent to ${emailResponse.testRecipient} instead of ${emailResponse.originalRecipient}`);
      }
      
      setIsSuccess(true);
      
      toast.success("Your demo has been booked successfully!", {
        description: "Check your email for confirmation details.",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      const errorMsg = error instanceof Error ? error.message : "Please try again or contact support.";
      setErrorMessage(errorMsg);
      
      toast.error("Something went wrong with the email!", {
        description: errorMsg,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-[80vh] bg-[#f7fafc]">
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Book Your Free Demo</h1>
            <p className="text-lg text-muted-foreground">
              Experience how Prop Panda can transform your real estate business. Fill out the form below to schedule your personalized demo.
            </p>
          </div>

          {errorMessage && (
            <Alert variant="destructive" className="max-w-2xl mx-auto mb-6">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {debugInfo && (
            <Alert className="max-w-2xl mx-auto mb-6 bg-gray-100">
              <AlertTitle>Debug Information</AlertTitle>
              <AlertDescription>
                <pre className="whitespace-pre-wrap text-xs">{debugInfo}</pre>
              </AlertDescription>
            </Alert>
          )}
          
          {testModeInfo && (
            <Alert className="max-w-2xl mx-auto mb-6 bg-blue-50">
              <AlertTitle>Resend Test Mode</AlertTitle>
              <AlertDescription>{testModeInfo}</AlertDescription>
            </Alert>
          )}

          {isSuccess ? (
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md text-center">
              <div className="text-accent-blue text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
              <p className="text-lg mb-6">
                Your demo is booked. Check your email for confirmation and calendar invite.
              </p>
              <Button
                onClick={() => setIsSuccess(false)}
                className="bg-accent-blue hover:bg-accent-blue/90"
              >
                Book Another Demo
              </Button>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-md">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name*</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number*</FormLabel>
                          <FormControl>
                            <Input placeholder="+65 XXXXXXXX" {...field} />
                          </FormControl>
                          <FormDescription>Singapore format: +65 XXXXXXXX</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address*</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="you@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="organisation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organisation</FormLabel>
                          <FormControl>
                            <Input placeholder="Your company name" {...field} />
                          </FormControl>
                          <FormDescription>Optional</FormDescription>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="preferredDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Preferred Date*</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Select a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                                className="p-3 pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="preferredTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Time*</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a time slot" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {timeSlots.map((slot) => (
                                <SelectItem key={slot.value} value={slot.value}>
                                  {slot.label} SGT
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="propertyTypeInterest"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Type Interest</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select property type (optional)" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {propertyTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>Optional</FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any specific features you're interested in?"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Optional</FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="acceptTerms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I accept the{" "}
                            <a
                              href="/privacy-policy"
                              className="text-accent-blue underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              privacy policy
                            </a>
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-accent-blue hover:bg-accent-blue/90 text-lg py-6"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Booking Your Demo..." : "Book Demo Now"}
                  </Button>
                </form>
              </Form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
