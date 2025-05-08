
import { SearchCheck, Clock, CalendarCheck, BarChart3, UserCheck, MessageSquareText, Building2, LineChart, BrainCircuit, ShieldCheck, HandCoins, Target, Users, FileText, PieChart } from "lucide-react";
import { NavLink } from "react-router-dom";
import { PageContainer, PageHero, SectionContainer } from "@/components/ui/page-container";

export default function Capabilities() {
  const capabilities = [
    {
      icon: UserCheck,
      title: "Lead Qualification",
      description: "Pre-qualify leads by collecting necessary information and determining client readiness before agent involvement."
    },
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
      icon: HandCoins,
      title: "Rent Negotiation",
      description: "Assist in rental price negotiations by providing market data and comparable property insights."
    },
    {
      icon: Target,
      title: "Objection Handling",
      description: "Professionally address and resolve common client concerns and objections during the property search process."
    },
    {
      icon: Users,
      title: "Persona Matching",
      description: "Match clients with properties that align with their lifestyle, preferences, and specific needs."
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
    },
    {
      icon: FileText,
      title: "Competitor Price Tracking",
      description: "Monitor competitor property prices and provide insights for optimal pricing strategies."
    },
    {
      icon: PieChart,
      title: "Persona to Property Match Scoring",
      description: "Score and suggest the best property matches for each client persona using advanced matching algorithms."
    }
  ];

  return (
    <PageContainer>
      <PageHero
        title="Prop Panda Capabilities"
        description="Discover how our AI assistant transforms your real estate business with these powerful features."
      />

      {/* Core Capabilities */}
      <SectionContainer bgColor="bg-gradient-to-br from-white to-secondary/60">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Core Capabilities</h2>
          <p className="text-muted-foreground">Powerful features designed to enhance your real estate business operations</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((capability, index) => (
            <div key={index} className="card hover-scale border-t-4 border-t-accent-blue bg-white shadow-lg animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="h-14 w-14 bg-accent-blue/10 rounded-xl flex items-center justify-center mb-5">
                <capability.icon className="h-8 w-8 text-accent-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{capability.title}</h3>
              <p className="text-muted-foreground">{capability.description}</p>
            </div>
          ))}
        </div>
      </SectionContainer>

      {/* Advanced Features */}
      <SectionContainer bgColor="bg-white">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Advanced Features</h2>
          <p className="text-muted-foreground">Cutting-edge capabilities that set Prop Panda apart from other solutions</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {advancedFeatures.map((feature, index) => (
            <div key={index} className="card hover-scale flex border-l-4 border-l-accent-blue bg-white shadow-lg animate-fade-in" style={{ animationDelay: `${index * 0.1 + 0.9}s` }}>
              <div className="h-14 w-14 bg-accent-blue/10 rounded-xl flex items-center justify-center mr-5 shrink-0">
                <feature.icon className="h-8 w-8 text-accent-blue" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionContainer>

      {/* CTA */}
      <SectionContainer bgColor="bg-gradient-to-br from-secondary/30 to-secondary/80">
        <div className="rounded-xl bg-gradient-to-r from-black to-neutral-800 text-white p-8 md:p-12 shadow-xl transform hover:scale-[1.01] transition-transform duration-300">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold">Experience Prop Panda in Action</h2>
            <p className="text-lg opacity-90">
              See how these features work together to transform your real estate business.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <NavLink to="/live-chat" className="btn-primary bg-accent-blue text-white border-none">
                Try Interactive Demo
              </NavLink>
              <NavLink to="/pricing" className="btn-secondary bg-transparent border border-white hover:bg-white/10">
                View Pricing
              </NavLink>
            </div>
          </div>
        </div>
      </SectionContainer>
    </PageContainer>
  );
}
