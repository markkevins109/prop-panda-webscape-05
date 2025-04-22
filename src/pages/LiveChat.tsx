
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function LiveChat() {
  return (
    <div className="section-padding">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Chat Interface */}
          <Card className="p-4">
            <div className="flex flex-col h-[600px]">
              <h2 className="text-2xl font-semibold mb-4">Live Chat Demo</h2>
              <ScrollArea className="flex-grow border rounded-md p-4 mb-4">
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage 
                        src="/lovable-uploads/e5e3fd4d-75ad-4c2f-a2d2-a37743ee1940.png" 
                        alt="Prop Panda AI"
                      />
                      <AvatarFallback>PP</AvatarFallback>
                    </Avatar>
                    <div className="bg-accent-blue/10 rounded-lg p-3 max-w-[80%]">
                      <p>Hello! How can I assist you with your real estate needs today?</p>
                    </div>
                  </div>
                </div>
              </ScrollArea>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-grow p-2 rounded-md border"
                />
                <button className="bg-accent-blue text-white px-4 py-2 rounded-md hover:bg-accent-blue/90">
                  Send
                </button>
              </div>
            </div>
          </Card>

          {/* Avatar Display */}
          <div className="flex flex-col items-center justify-center">
            <Avatar className="h-64 w-64 mb-6">
              <AvatarImage 
                src="/lovable-uploads/e5e3fd4d-75ad-4c2f-a2d2-a37743ee1940.png" 
                alt="Prop Panda AI" 
              />
              <AvatarFallback>
                <MessageCircle className="h-32 w-32" />
              </AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-semibold mb-2">Prop Panda AI</h2>
            <p className="text-muted-foreground text-center">
              Your AI-powered real estate assistant, ready to help 24/7
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
