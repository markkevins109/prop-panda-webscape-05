
import { FileSpreadsheet, BarChart3, MessageSquare, Share2, FileText, DatabaseZap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer, PageHero, SectionContainer } from "@/components/ui/page-container";
import { PandaAvatar } from "@/components/PandaAvatar";

export default function Integrations() {
  const integrations = [
    {
      title: "Custom CRM Integration",
      description: "Connect with your preferred CRM system for seamless data flow",
      icon: DatabaseZap,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Google Sheets",
      description: "Automatically sync chats, leads, and data into your sheets.",
      icon: FileSpreadsheet,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "XERO",
      description: "Integrate client interactions with accounting and invoicing.",
      icon: BarChart3,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Hubspot",
      description: "Push new leads and contacts from conversations to your CRM.",
      icon: FileText,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Zapier",
      description: "Automate repetitive tasks and connect with 5000+ apps.",
      icon: Share2,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "WhatsApp",
      description: "Offer real-time client assistance directly through messaging.",
      icon: MessageSquare,
      color: "text-green-600",
      bgColor: "bg-green-50",
    }
  ];

  return (
    <PageContainer>
      <PageHero
        title="Powerful Integrations"
        description="Connect Prop Panda with your favorite tools and platforms to streamline your workflow."
      />

      {/* Integrations Grid */}
      <SectionContainer bgColor="bg-gradient-to-br from-white to-secondary/60">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Available Integrations</h2>
          <p className="text-muted-foreground">
            Enhance your real estate business by connecting Prop Panda with these powerful tools
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {integrations.map((integration, index) => (
            <div
              key={index}
              className="card hover-scale border-t-4 border-t-accent-blue bg-white shadow-lg animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex flex-col items-start space-y-4">
                <div className={`p-3 rounded-lg ${integration.bgColor}`}>
                  <integration.icon className={`h-6 w-6 ${integration.color}`} />
                </div>
                <h3 className="text-xl font-semibold">{integration.title}</h3>
                <p className="text-muted-foreground">{integration.description}</p>
                <Button 
                  variant="outline" 
                  className="mt-4 border-accent-blue text-accent-blue hover:bg-accent-blue/10"
                >
                  Connect
                </Button>
              </div>
            </div>
          ))}
        </div>
      </SectionContainer>

      {/* CTA Section */}
      <SectionContainer bgColor="bg-white">
        <div className="rounded-xl bg-gradient-to-r from-black to-neutral-800 text-white p-8 md:p-12 shadow-xl transform hover:scale-[1.01] transition-transform duration-300">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold">Need a custom integration?</h2>
              <p className="text-lg opacity-90">
                Our team can build custom integrations for your specific business requirements.
              </p>
              <Button className="bg-accent-blue hover:bg-accent-blue/90 border-none">
                Contact Sales Team
              </Button>
            </div>
            <div className="flex items-center justify-center">
              <div className="h-32 w-32 bg-white/10 rounded-full p-4 backdrop-blur-sm">
                <PandaAvatar size="large" />
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>

      {/* Integration Benefits */}
      <SectionContainer bgColor="bg-gradient-to-br from-secondary/30 to-secondary/80">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="card bg-white shadow-lg animate-fade-in">
            <h3 className="text-xl font-semibold mb-3">Streamlined Workflows</h3>
            <p className="text-muted-foreground">
              Automate repetitive tasks and create seamless data flows between Prop Panda and your existing tools.
            </p>
          </div>
          <div className="card bg-white shadow-lg animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <h3 className="text-xl font-semibold mb-3">Data Synchronization</h3>
            <p className="text-muted-foreground">
              Keep your property data, client information, and analytics synchronized across all platforms.
            </p>
          </div>
          <div className="card bg-white shadow-lg animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <h3 className="text-xl font-semibold mb-3">Enhanced Reporting</h3>
            <p className="text-muted-foreground">
              Generate comprehensive reports by combining data from multiple sources for better decision making.
            </p>
          </div>
        </div>
      </SectionContainer>
    </PageContainer>
  );
}
