import { useState } from "react";
import { Send, Bot } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function LiveChat() {
  // Sample conversation starter
  const initialMessages = [
    {
      role: "assistant",
      content: "Hello! I'm Prop Panda, your AI real estate assistant. How can I help you today?"
    }
  ];

  // Demo conversation flows
  const demoScenarios = [
    "I'm looking for a 3-bedroom house under $500,000",
    "What are the current mortgage rates?",
    "Can you schedule a viewing for 123 Main Street?",
    "Tell me about property tax in San Francisco"
  ];

  // Sample responses for demo
  const demoResponses: { [key: string]: string } = {
    "I'm looking for a 3-bedroom house under $500,000": "I'd be happy to help you find a 3-bedroom house under $500,000. To provide the most relevant options, could you tell me which neighborhoods or areas you're interested in, and any specific features you're looking for (like garage, yard size, etc.)?",
    
    "What are the current mortgage rates?": "As of today, average mortgage rates are around 6.8% for a 30-year fixed mortgage and 6.1% for a 15-year fixed rate. These can vary based on your credit score, down payment, and specific lender. Would you like me to connect you with a mortgage specialist who can provide personalized rates?",
    
    "Can you schedule a viewing for 123 Main Street?": "I'd be happy to help schedule a viewing for 123 Main Street. Could you provide me with a few date and time options that work for you? Also, is this your first viewing with our agency, or are you already working with a specific agent?",
    
    "Tell me about property tax in San Francisco": "Property tax in San Francisco is approximately 1.18% of the assessed value. For example, a property assessed at $1 million would have annual property taxes of around $11,800. Additionally, San Francisco has several special assessment districts that may add supplemental taxes depending on the property's location. Would you like more specific information about a particular neighborhood?"
  };

  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = { role: "user", content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    
    // Show typing indicator
    setIsTyping(true);

    // Simulate AI response after a delay
    setTimeout(() => {
      const response = demoResponses[inputValue] || 
        "Thank you for your message. This is a demo version of Prop Panda. In the full version, I would provide detailed information about your real estate inquiry. Would you like to know more about our capabilities?";
      
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleDemoClick = (scenario: string) => {
    setInputValue(scenario);
  };

  return (
    <div>
      {/* Header */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center space-y-4 mb-12">
            <h1 className="text-4xl md:text-5xl font-bold">Experience Prop Panda</h1>
            <p className="text-lg text-muted-foreground">
              Try our interactive demo and see how Prop Panda transforms real estate communication.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
            {/* Chat Demo - Full Width */}
            <div className="w-full">
              <div className="border rounded-xl overflow-hidden shadow-sm bg-card h-[600px] flex flex-col">
                <div className="bg-primary text-white p-4 flex items-center">
                  <Bot className="h-5 w-5 mr-2" />
                  <span className="font-medium">Prop Panda Chat</span>
                </div>
                
                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                  {messages.map((message, index) => (
                    <div 
                      key={index} 
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.role === "assistant" && (
                        <div className="mr-2">
                          <Avatar className="h-8 w-8 border border-primary">
                            <AvatarImage src="/panda-ai-logo.svg" alt="Prop Panda" />
                            <AvatarFallback>
                              <Bot className="h-5 w-5" />
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      )}
                      <div 
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === "user" 
                            ? "bg-primary text-white" 
                            : "bg-secondary"
                        }`}
                      >
                        <p>{message.content}</p>
                      </div>
                      {message.role === "user" && (
                        <div className="ml-2">
                          <Avatar className="h-8 w-8 bg-muted">
                            <AvatarFallback>You</AvatarFallback>
                          </Avatar>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="mr-2">
                        <Avatar className="h-8 w-8 border border-primary">
                          <AvatarImage src="/panda-ai-logo.svg" alt="Prop Panda" />
                          <AvatarFallback>
                            <Bot className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="bg-secondary rounded-lg p-3 max-w-[80%]">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 rounded-full bg-neutral-400 animate-pulse"></div>
                          <div className="w-2 h-2 rounded-full bg-neutral-400 animate-pulse delay-100"></div>
                          <div className="w-2 h-2 rounded-full bg-neutral-400 animate-pulse delay-200"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <form onSubmit={handleSubmit} className="p-4 border-t bg-card">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Type your question here..."
                      className="flex-grow border rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <button 
                      type="submit"
                      className="btn-primary px-4"
                      disabled={!inputValue.trim()}
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-2">Try asking:</p>
                    <div className="flex flex-wrap gap-2">
                      {demoScenarios.map((scenario, index) => (
                        <button
                          key={index}
                          onClick={() => handleDemoClick(scenario)}
                          className="bg-secondary hover:bg-secondary/80 text-sm rounded-full px-3 py-1 transition-colors"
                        >
                          {scenario}
                        </button>
                      ))}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <svg className="w-10 h-10 mx-auto mb-4 text-neutral-400" fill="currentColor" viewBox="0 0 32 32">
              <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
            </svg>
            <p className="text-xl md:text-2xl italic mb-6">
              "Prop Panda has completely transformed how we handle client inquiries. Our response time has decreased from hours to seconds, and we've seen a 40% increase in lead conversions since implementation."
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
