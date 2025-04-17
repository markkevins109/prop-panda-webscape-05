
import { SearchCheck, Clock, CalendarCheck, BarChart3, UserCheck, MessageSquareText, Building2, LineChart, BrainCircuit, ShieldCheck } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Capabilities() {
  const capabilities = [
    {
      icon: MessageSquareText,
      title: "Intelligent Conversations",
      description: "Natural language processing allows Prop Panda to understand and respond to client inquiries with human-like conversation."
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Never miss a lead with round-the-clock availability to answer questions and capture client information."
    },
    {
      icon: SearchCheck,
      title: "Property Search Assistance",
      description: "Help clients find their ideal properties by understanding their preferences and showing matching listings."
    },
    {
      icon: CalendarCheck,
      title: "Scheduling & Reminders",
      description: "Automatically schedule property viewings, follow-ups, and send reminders to both clients and agents."
    },
    {
      icon: BarChart3,
      title: "Market Trends & Updates",
      description: "Provide clients with real-time information about market conditions, pricing trends, and neighborhood statistics."
    },
    {
      icon: UserCheck,
      title: "Lead Qualification",
      description: "Pre-qualify leads by collecting necessary information and determining client readiness before agent involvement."
    }
  ];

  const advancedFeatures = [
    {
      icon: Building2,
      title: "Comprehensive Property Knowledge",
      description: "Access to detailed information about properties, including history, amenities, and neighborhood data."
    },
    {
      icon: LineChart,
      title: "Performance Analytics",
      description: "Track conversation metrics, lead conversion rates, and identify areas for business improvement."
    },
    {
      icon: BrainCircuit,
      title: "Continuous Learning",
      description: "Prop Panda improves over time by learning from interactions and adapting to your business needs."
    },
    {
      icon: ShieldCheck,
      title: "Security & Compliance",
      description: "Enterprise-grade security and compliance with real estate regulations built into every interaction."
    }
  ];

  return (
    <div>
      {/* Header */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">Prop Panda Capabilities</h1>
            <p className="text-lg text-muted-foreground">
              Discover how our AI assistant transforms your real estate business with these powerful features.
            </p>
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-12 text-center">Core Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {capabilities.map((capability, index) => (
              <div key={index} className="card hover-scale">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <capability.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{capability.title}</h3>
                <p className="text-muted-foreground">{capability.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-12 text-center">Advanced Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {advancedFeatures.map((feature, index) => (
              <div key={index} className="card hover-scale flex">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4 shrink-0">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Seamless Integration</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Prop Panda connects effortlessly with your existing tools and platforms
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Integration logos - using gray rectangles as placeholders */}
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-white rounded-lg p-6 h-24 flex items-center justify-center shadow-sm">
                <div className="w-full h-8 bg-gray-300 rounded opacity-50"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="rounded-xl bg-gradient-to-r from-black to-neutral-800 text-white p-8 md:p-12">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold">Experience Prop Panda in Action</h2>
              <p className="text-lg opacity-90">
                See how these features work together to transform your real estate business.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <NavLink to="/live-chat" className="btn-primary bg-white text-black">
                  Try Interactive Demo
                </NavLink>
                <NavLink to="/pricing" className="btn-secondary bg-transparent border border-white hover:bg-white/10">
                  View Pricing
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
