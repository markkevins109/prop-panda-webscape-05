import { Download, ArrowRight } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function CaseStudies() {
  // Case study data
  const caseStudies = [
    {
      company: "Metropolitan Realty",
      title: "How Metropolitan Realty increased lead generation by 40%",
      description: "Learn how this mid-size agency transformed its digital presence and client engagement with Prop Panda.",
      metrics: [
        { label: "Increase in qualified leads", value: "40%" },
        { label: "Reduction in response time", value: "95%" },
        { label: "Increase in client satisfaction", value: "35%" }
      ],
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
    },
    {
      company: "Horizon Properties",
      title: "Scaling operations while keeping the personal touch",
      description: "Discover how Horizon Properties managed to scale their business while maintaining quality client interactions.",
      metrics: [
        { label: "Hours saved per agent monthly", value: "20+" },
        { label: "Growth in property listings", value: "65%" },
        { label: "Increase in agent productivity", value: "30%" }
      ],
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c"
    },
    {
      company: "EastCoast Homes",
      title: "From traditional to tech-forward: A digital transformation",
      description: "See how this traditional real estate agency embraced technology to stay competitive in a digital market.",
      metrics: [
        { label: "Increase in online engagement", value: "85%" },
        { label: "New digital leads per month", value: "120+" },
        { label: "Return on investment", value: "310%" }
      ],
      image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80"
    }
  ];

  // Agent testimonials
  const testimonials = [
    {
      quote: "Prop Panda has completely transformed how I handle client inquiries. I can focus on high-value activities while the AI takes care of initial questions and lead qualification.",
      name: "Jennifer Martinez",
      role: "Senior Agent",
      company: "Metropolitan Realty"
    },
    {
      quote: "As a new agent, Prop Panda gave me the support I needed to handle multiple clients professionally. It's like having a 24/7 assistant that knows everything about real estate.",
      name: "David Chen",
      role: "Real Estate Agent",
      company: "Horizon Properties"
    }
  ];

  return (
    <div>
      {/* Header */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">Success Stories</h1>
            <p className="text-lg text-muted-foreground">
              See how real estate professionals are transforming their businesses with Prop Panda
            </p>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="pb-20">
        <div className="container-custom">
          <div className="space-y-16">
            {caseStudies.map((study, index) => (
              <div 
                key={index} 
                className={`grid grid-cols-1 ${
                  index % 2 === 0 ? "lg:grid-cols-[1fr,1.5fr]" : "lg:grid-cols-[1.5fr,1fr]"
                } gap-8 items-center`}
              >
                <div className={index % 2 === 0 ? "order-1" : "order-1 lg:order-2"}>
                  <img 
                    src={study.image} 
                    alt={study.company} 
                    className="rounded-lg w-full h-[300px] object-cover"
                  />
                </div>
                
                <div className={index % 2 === 0 ? "order-2" : "order-2 lg:order-1"}>
                  <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    {study.company}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold mt-2 mb-4">{study.title}</h2>
                  <p className="text-muted-foreground mb-6">{study.description}</p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {study.metrics.map((metric, i) => (
                      <div key={i} className="text-center p-3 bg-secondary rounded-lg">
                        <div className="text-2xl font-bold text-primary">{metric.value}</div>
                        <div className="text-xs text-muted-foreground">{metric.label}</div>
                      </div>
                    ))}
                  </div>
                  
                  <NavLink to="/case-studies" className="btn-primary inline-flex items-center">
                    Read Full Case Study <ArrowRight className="ml-2 h-5 w-5" />
                  </NavLink>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-12 text-center">Agent Testimonials</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <svg className="w-8 h-8 text-primary/30 mb-4" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104-6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.855-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
                <p className="mb-4 italic">{testimonial.quote}</p>
                <div className="font-medium">{testimonial.name}</div>
                <div className="text-sm text-muted-foreground">{testimonial.role}, {testimonial.company}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="bg-gradient-to-r from-black to-neutral-800 text-white rounded-xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Download Our Resources</h2>
                <p className="opacity-90 mb-6">
                  Get access to our free resources, including our brochure, ROI calculator, and implementation guide.
                </p>
                <div className="space-y-4">
                  <div className="flex space-x-4">
                    <Download className="h-6 w-6 text-white" />
                    <div>
                      <h3 className="font-medium">Prop Panda Brochure</h3>
                      <p className="text-sm opacity-75">Complete overview of features and benefits (PDF, 4.2MB)</p>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <Download className="h-6 w-6 text-white" />
                    <div>
                      <h3 className="font-medium">ROI Calculator</h3>
                      <p className="text-sm opacity-75">Calculate your potential return on investment (XLSX, 1.8MB)</p>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <Download className="h-6 w-6 text-white" />
                    <div>
                      <h3 className="font-medium">Implementation Guide</h3>
                      <p className="text-sm opacity-75">Step-by-step setup instructions (PDF, 3.5MB)</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Get the Resource Pack</h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input 
                      type="text" 
                      className="w-full p-2 rounded-md bg-white/20 border border-white/20 text-white placeholder:text-white/50"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input 
                      type="email" 
                      className="w-full p-2 rounded-md bg-white/20 border border-white/20 text-white placeholder:text-white/50"
                      placeholder="Your email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Company</label>
                    <input 
                      type="text" 
                      className="w-full p-2 rounded-md bg-white/20 border border-white/20 text-white placeholder:text-white/50"
                      placeholder="Your company"
                    />
                  </div>
                  <NavLink 
                    to="/case-studies" 
                    className="bg-white text-black hover:bg-white/90 w-full py-2 rounded-md font-medium text-center block transition-colors"
                  >
                    Download Resources
                  </NavLink>
                  <p className="text-xs opacity-75 text-center">
                    By downloading, you agree to our privacy policy and terms of service.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-20">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold">Ready to Transform Your Real Estate Business?</h2>
            <p className="text-muted-foreground">
              Join hundreds of successful real estate professionals who are growing their business with Prop Panda.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
              <NavLink to="/live-chat" className="btn-primary">
                Try the Demo
              </NavLink>
              <NavLink to="/pricing" className="btn-secondary">
                View Pricing
              </NavLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
