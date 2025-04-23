
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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

    const emailResponse = await resend.emails.send({
      from: "Prop Panda <onboarding@resend.dev>",
      to: [email],
      subject: "Your Prop Panda Demo Booking Confirmation",
      html: `
        <h1>Thank you for booking a demo with Prop Panda!</h1>
        <p>Dear ${name},</p>
        <p>We're excited to confirm your demo booking for:</p>
        <p><strong>Date:</strong> ${preferredDate}<br>
        <strong>Time:</strong> ${preferredTime} SGT</p>
        <p>While you wait for your personalized demo, you can explore our interactive demo page to see Prop Panda in action:</p>
        <p><a href="/demo" style="display: inline-block; background-color: #1EAEDB; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">Watch Interactive Demo</a></p>
        <p>We'll be sending you a calendar invite shortly with the meeting details.</p>
        <p>If you need to reschedule or have any questions, please don't hesitate to contact us.</p>
        <p>Best regards,<br>The Prop Panda Team</p>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
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
