import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Define authorized test email for development
const AUTHORIZED_TEST_EMAIL = "genzi.learning@gmail.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface DemoBookingRequest {
  name: string;
  email: string;
  preferredDate: string;
  preferredTime: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, preferredDate, preferredTime }: DemoBookingRequest = await req.json();
    
    console.log("Received email request for:", email);
    
    if (!email) {
      throw new Error("Email is required");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    console.log("Sending confirmation email to:", email);

    // In development/test mode, always send to the authorized test email
    // while keeping the original content
    const recipientEmail = AUTHORIZED_TEST_EMAIL;
    
    const emailResponse = await resend.emails.send({
      from: "Prop Panda <onboarding@resend.dev>",
      to: [recipientEmail],
      subject: "Your Prop Panda Demo Booking Confirmation",
      html: `
        <h1>Thank you for booking a demo with Prop Panda!</h1>
        <p>Dear ${name},</p>
        <p>We're excited to confirm your demo booking for:</p>
        <p><strong>Date:</strong> ${preferredDate}<br>
        <strong>Time:</strong> ${preferredTime} SGT</p>
        <p>We'll be sending you a calendar invite shortly with the meeting details.</p>
        <p>If you need to reschedule or have any questions, please don't hesitate to contact us.</p>
        <p>Best regards,<br>The Prop Panda Team</p>
        <hr>
        <p><small>Note: This is a test email. The actual recipient would be: ${email}</small></p>
      `,
    });

    console.log("Email send response:", JSON.stringify(emailResponse));

    if (emailResponse.error) {
      throw new Error(`Resend API error: ${JSON.stringify(emailResponse.error)}`);
    }

    return new Response(JSON.stringify({
      success: true,
      message: "Confirmation email sent",
      originalRecipient: email,
      testMode: true,
      testRecipient: recipientEmail,
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-demo-confirmation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
