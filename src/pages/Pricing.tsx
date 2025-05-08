
import { useState } from "react";
import { Check, X, HelpCircle, ArrowRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import { PageContainer, PageHero, SectionContainer } from "@/components/ui/page-container";

export default function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");

  // Pricing plans with features
  const plans = [
    {
      name: "Starter",
      description: "Perfect for individual agents",
      monthlyPrice: 99,
      annualPrice: 79,
      features: [
        { name: "You can connect with up to 100 potential customers", included: true },
        { name: "Basic property search", included: true },
        { name: "Lead capture", included: true },
        { name: "Email notifications", included: true },
        { name: "Website embedding", included: true },
        { name: "Advanced analytics", included: false },
        { name: "CRM integration", included: false },
        { name: "Custom training", included: false }
      ]
    },
    {
      name: "Professional",
      description: "Ideal for growing teams",
      monthlyPrice: 499,
      annualPrice: 399,
      popular: true,
      features: [
        { name: "You can connect with up to 500 potential customers", included: true },
        { name: "Advanced property search", included: true },
        { name: "Lead capture & qualification", included: true },
        { name: "Email & SMS notifications", included: true },
        { name: "Website & WhatsApp integration", included: true },
        { name: "Advanced analytics", included: true },
        { name: "CRM integration", included: true },
        { name: "Custom training", included: false }
      ]
    },
    {
      name: "Enterprise",
      description: "For established brokerages",
      monthlyPrice: 999,
      annualPrice: 799,
      features: [
        { name: "You can connect with unlimited potential customers", included: true },
        { name: "Full property database access", included: true },
        { name: "Advanced lead qualification", included: true },
        { name: "Multi-channel notifications", included: true },
        { name: "Full integration suite", included: true },
        { name: "Advanced analytics & reporting", included: true },
        { name: "Custom CRM integration", included: true },
        { name: "Custom training & setup", included: true }
      ]
    }
  ];

  // FAQ items
  const faqs = [
    {
      question: "Can I upgrade or downgrade my plan later?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll be charged the prorated difference. When downgrading, the new rate will apply at the next billing cycle."
    },
    {
      question: "What happens if I exceed my monthly conversation limit?",
      answer: "If you reach your conversation limit, you'll receive a notification. You can either upgrade to a higher tier or wait until your next billing cycle when your limit resets."
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes, all plans come with a 14-day free trial so you can test out Prop Panda before committing to a subscription."
    },
    {
      question: "How does the website integration work?",
      answer: "We provide a simple code snippet that you can add to your website. This will create a chat widget that visitors can use to interact with Prop Panda."
    }
  ];

  return (
    <PageContainer>
      <PageHero
        title="Simple, Transparent Pricing" 
        description="Choose the plan that's right for your real estate business"
      />

      {/* Pricing Toggle */}
      <SectionContainer bgColor="bg-gradient-to-br from-white to-secondary/60" className="pb-6">
        <div className="flex justify-center items-center space-x-4">
          <span className={`font-medium ${billingPeriod === "monthly" ? "text-primary" : "text-muted-foreground"}`}>
            Monthly
          </span>
          <button 
            onClick={() => setBillingPeriod(billingPeriod === "monthly" ? "annual" : "monthly")}
            className="relative h-6 w-12 rounded-full bg-primary flex items-center p-1 transition-all"
          >
            <span 
              className={`h-4 w-4 rounded-full bg-white block transition-all ${
                billingPeriod === "annual" ? "translate-x-6" : ""
              }`} 
            />
          </button>
          <span className={`font-medium flex items-center ${billingPeriod === "annual" ? "text-primary" : "text-muted-foreground"}`}>
            Annual
            <span className="ml-2 text-xs bg-green-100 text-green-800 rounded-full px-2 py-0.5">
              Save 20%
            </span>
          </span>
        </div>
      </SectionContainer>

      {/* Pricing Cards */}
      <SectionContainer bgColor="bg-gradient-to-br from-white to-secondary/60" className="pt-0 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`border rounded-xl overflow-hidden shadow-sm transition-all animate-fade-in hover:shadow-xl ${
                plan.popular ? "border-accent-blue relative transform md:-translate-y-4 scale-105" : ""
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {plan.popular && (
                <div className="bg-accent-blue text-white py-1 px-4 text-center text-sm font-medium">
                  Most Popular
                </div>
              )}
              <div className="p-6">
                <h2 className="text-2xl font-bold">{plan.name}</h2>
                <p className="text-muted-foreground mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">
                    ${billingPeriod === "monthly" ? plan.monthlyPrice : plan.annualPrice}
                  </span>
                  <span className="text-muted-foreground">/month</span>
                  {billingPeriod === "annual" && (
                    <div className="text-sm text-muted-foreground">Billed annually</div>
                  )}
                </div>

                <NavLink 
                  to="/case-studies" 
                  className={`w-full text-center block py-2 px-4 rounded-md transition-all mb-6 ${
                    plan.popular 
                      ? "bg-accent-blue text-white hover:bg-accent-blue/90" 
                      : "bg-secondary hover:bg-secondary/80"
                  }`}
                >
                  Get Started
                </NavLink>

                <div className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      {feature.included ? (
                        <Check 
                          className="h-5 w-5 text-emerald-600 mr-2" 
                          strokeWidth={3} 
                        />
                      ) : (
                        <X className="h-5 w-5 text-neutral-300 mr-2" />
                      )}
                      <span className={feature.included ? "" : "text-muted-foreground"}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionContainer>

      {/* Enterprise CTA */}
      <SectionContainer bgColor="bg-gradient-to-br from-secondary/30 to-secondary/80">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 animate-fade-in">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Need a custom solution?</h2>
            <p className="text-muted-foreground">
              Contact our team to create a tailored plan for your large brokerage or special requirements.
            </p>
            <NavLink to="/case-studies" className="btn-accent inline-flex items-center mt-4">
              Contact Sales <ArrowRight className="ml-2 h-5 w-5" />
            </NavLink>
          </div>
        </div>
      </SectionContainer>

      {/* FAQ */}
      <SectionContainer bgColor="bg-gradient-to-br from-white to-secondary/60">
        <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="space-y-2 card hover-scale animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <h3 className="font-semibold text-lg flex items-center">
                <HelpCircle className="h-5 w-5 mr-2 text-accent-blue" />
                {faq.question}
              </h3>
              <p className="text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </SectionContainer>

      {/* Money-back Guarantee */}
      <SectionContainer bgColor="bg-gradient-to-br from-white to-secondary/30">
        <div className="bg-gradient-to-r from-accent-blue/10 to-secondary/80 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between shadow-lg">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="h-12 w-12 rounded-full bg-accent-blue/20 flex items-center justify-center mr-4">
              <svg className="h-6 w-6 text-accent-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-xl">30-Day Money-Back Guarantee</h3>
              <p className="text-muted-foreground">Not satisfied? Get a full refund within 30 days, no questions asked.</p>
            </div>
          </div>
          <NavLink to="/case-studies" className="btn-accent whitespace-nowrap transform transition-transform hover:scale-105">
            Try Risk-Free
          </NavLink>
        </div>
      </SectionContainer>
    </PageContainer>
  );
}
