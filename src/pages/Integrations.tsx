
import { FileSpreadsheet, BarChart3, MessageSquare, Share2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Integrations() {
  const integrations = [
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
    },
  ];

  return (
    <div>
      {/* Header */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">Integrations</h1>
            <p className="text-lg text-muted-foreground">
              Connect Prop Panda with your favorite tools and platforms to streamline your workflow.
            </p>
          </div>
        </div>
      </section>

      {/* Integrations Grid */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {integrations.map((integration, index) => (
              <div
                key={index}
                className="card bg-background hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex flex-col items-start space-y-4">
                  <div className={`p-3 rounded-lg ${integration.bgColor}`}>
                    <integration.icon className={`h-6 w-6 ${integration.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold">{integration.title}</h3>
                  <p className="text-muted-foreground">{integration.description}</p>
                  <Button variant="outline" className="mt-4">
                    Learn More
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
