
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export default function LiveChat() {
  return (
    <div className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold mb-4">Experience Prop Panda</h1>
          <p className="text-lg text-muted-foreground">
            Try our interactive demo and see how Prop Panda transforms real estate communication.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Chat Interface */}
          <Card className="overflow-hidden">
            <div className="bg-black text-white p-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <h2 className="text-lg">Prop Panda Chat</h2>
            </div>

            <ScrollArea className="h-[500px] p-4">
              <div className="space-y-4">
                <div className="bg-gray-100 rounded-lg p-4 max-w-[80%]">
                  <p>Hello! I'm Prop Panda, your AI real estate assistant. How can I help you today?</p>
                </div>
              </div>
            </ScrollArea>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input 
                  placeholder="Type your question here..." 
                  className="flex-grow"
                />
                <Button>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Assistant Display */}
          <div className="flex flex-col items-center justify-center">
            <img 
              src="/lovable-uploads/c824f6c9-f5c0-4dee-a822-6b363b60e917.png"
              alt="Prop Panda Assistant"
              className="w-64 h-64 mb-6"
            />
            <h2 className="text-2xl font-semibold mb-2">Meet Prop Panda</h2>
            <p className="text-muted-foreground text-center max-w-sm">
              Your AI-powered real estate assistant, equipped with advanced technology to help you with all your real estate needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
