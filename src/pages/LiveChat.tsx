
import { Video } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const videoSections = [
  {
    title: "Getting Started with Live Chat",
    description: "Learn how to set up and start using our live chat feature",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
  },
  {
    title: "AI-Powered Responses",
    description: "See how our AI helps you respond to queries instantly",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
  },
  {
    title: "Customizing Your Chat Interface",
    description: "Customize the chat widget to match your brand",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
  },
  {
    title: "Real Estate Chat Automation",
    description: "Automate common real estate queries and responses",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
  }
];

export default function LiveChat() {
  return (
    <div>
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
            <h1 className="text-4xl md:text-5xl font-bold">Live Chat Demo</h1>
            <p className="text-lg text-muted-foreground">
              Learn how to leverage our AI-powered live chat to enhance your real estate business
            </p>
          </div>

          <div className="grid gap-8">
            {videoSections.map((section, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="relative aspect-video">
                    <img
                      src={section.image}
                      alt={section.title}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Video className="w-16 h-16 text-white opacity-80" />
                    </div>
                  </div>
                  <CardContent className="flex items-center p-6">
                    <div>
                      <CardTitle className="text-2xl mb-4">{section.title}</CardTitle>
                      <p className="text-muted-foreground">{section.description}</p>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
