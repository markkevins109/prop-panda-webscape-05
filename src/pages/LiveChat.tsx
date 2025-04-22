
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export default function LiveChat() {
  return (
    <div className="section-padding">
      <div className="container-custom max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold mb-4">Experience Prop Panda</h1>
          <p className="text-lg text-muted-foreground">
            Try our interactive demo and see how Prop Panda transforms real estate communication.
          </p>
        </div>

        <Card className="overflow-hidden">
          {/* Chat Header */}
          <div className="bg-black text-white p-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <h2 className="text-lg">Prop Panda Chat</h2>
          </div>

          {/* Chat Messages */}
          <ScrollArea className="h-[400px] p-4">
            <div className="space-y-4">
              <div className="bg-gray-100 rounded-lg p-4 max-w-[80%]">
                <p>Hello! I'm Prop Panda, your AI real estate assistant. How can I help you today?</p>
              </div>
            </div>
          </ScrollArea>

          {/* Input Area */}
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
            <p className="text-sm text-muted-foreground mt-4">Try asking:</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
