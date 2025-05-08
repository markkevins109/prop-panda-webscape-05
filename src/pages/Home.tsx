import { ArrowRight, Book, MessageSquare, Clock, Shield, BarChart, BadgeCheck } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PandaAvatar } from "@/components/PandaAvatar";
import { useState } from 'react';
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Home() {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [conversation, setConversation] = useState([
    { id: 1, sender: 'panda', message: 'Hello! I\'m Prop Panda, your AI real estate assistant. How can I help you today?' }
  ]);

  const isMobile = useIsMobile();

  const handleSendMessage = () => {
    if (userMessage.trim()) {
      setConversation(prev => [
        ...prev, 
        { id: prev.length + 1, sender: 'user', message: userMessage }
      ]);
      
      // Simulate a response
      setTimeout(() => {
        const pandaResponse = generatePandaResponse(userMessage);
        setConversation(prev => [
          ...prev, 
          { id: prev.length + 2, sender: 'panda', message: pandaResponse }
        ]);
      }, 1000);

      setUserMessage('');
    }
  };

  const generatePandaResponse = (userQuery: string) => {
    const queries = {
      'house': 'I can help you find properties! What type of house are you looking for?',
      'price': 'Prices vary based on location and property type. Can you tell me more about your budget range?',
      'view': 'We offer virtual property tours. Would you like to schedule one?',
      'default': 'Interesting query! How can I assist you with your real estate needs today?'
    };

    const matchedResponse = Object.entries(queries).find(([keyword]) => 
      userQuery.toLowerCase().includes(keyword)
    );

    return matchedResponse ? matchedResponse[1] : queries['default'];
  };

  // ... keep existing code (Hero Section)

  // Demo Dialog
  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="section-padding min-h-[80vh] flex items-center bg-gradient-to-br from-white to-secondary">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="inline-block text-sm font-semibold px-3 py-1 bg-accent-blue/10 text-accent-blue rounded-full uppercase tracking-wider">
                AI for Real Estate Professionals
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-primary">
                Your 24/7 Digital <br className="hidden md:block" /> Real Estate Assistant
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Prop Panda automates client interactions, answers property questions, 
                schedules viewings, and provides market insights.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
                <Button 
                  onClick={() => setIsDemoOpen(true)} 
                  className="btn-accent flex items-center justify-center sm:justify-start"
                  size="lg"
                >
                  Try Demo Chat <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <NavLink 
                  to="/tutorials" 
                  className="btn-secondary flex items-center justify-center sm:justify-start"
                >
                  <Book className="mr-2 h-5 w-5" />
                  Explore Tutorials
                </NavLink>
              </div>
            </div>
            <div className="relative hidden lg:block animate-fade-in">
              <div className="relative bg-white rounded-lg p-8 shadow-lg border border-border/50">
                <div className="absolute -left-4 -top-4 bg-accent-blue text-white p-4 rounded-lg shadow-md">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="bg-secondary p-3 rounded-lg max-w-[80%]">
                      <p className="text-sm">Hi there! I'm looking for a 3-bedroom house near downtown.</p>
                    </div>
                    <div className="bg-accent-blue text-white p-3 rounded-lg max-w-[80%] ml-auto">
                      <p className="text-sm">I can help with that! What's your budget range and when are you looking to move?</p>
                    </div>
                  </div>
                  <div className="text-center text-sm text-muted-foreground">
                    <p>Prop Panda responds instantly, 24/7</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 h-full w-full bg-neutral-200 -z-10 rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Dialog */}
      <Dialog open={isDemoOpen} onOpenChange={setIsDemoOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PandaAvatar size="small" /> Chat with Prop Panda
            </DialogTitle>
            <DialogDescription>
              Ask about properties, scheduling viewings, or market insights
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col h-[300px] sm:h-[400px] space-y-4">
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary/30 rounded-md">
              {conversation.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`${
                    msg.sender === 'panda' 
                      ? 'bg-accent-blue text-white ml-auto sm:ml-0 sm:mr-auto' 
                      : 'bg-secondary ml-auto'
                  } p-3 rounded-lg max-w-[80%] animate-fade-in`}
                >
                  {msg.sender === 'panda' && (
                    <div className="flex items-center mb-1 gap-2">
                      <PandaAvatar size="xs" />
                      <span className="font-medium">Prop Panda</span>
                    </div>
                  )}
                  <p className="text-sm">{msg.message}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button onClick={handleSendMessage}>Send</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Features Overview */}
      <section className="bg-white section-padding">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-sm font-semibold px-3 py-1 bg-accent-blue/10 text-accent-blue rounded-full mb-4">
              CORE FEATURES
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How Prop Panda Powers Your Business</h2>
            <p className="text-muted-foreground text-lg">
              Our AI assistant streamlines your workflow, letting you focus on closing deals while we handle client communications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="card hover-scale border-t-4 border-t-accent-blue">
              <MessageSquare className="h-12 w-12 text-accent-blue mb-4" />
              <h3 className="text-xl font-semibold mb-2">Intelligent Conversations</h3>
              <p className="text-muted-foreground">
                Natural, human-like interactions with clients to answer questions and provide assistance.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card hover-scale border-t-4 border-t-accent-blue">
              <Clock className="h-12 w-12 text-accent-blue mb-4" />
              <h3 className="text-xl font-semibold mb-2">24/7 Availability</h3>
              <p className="text-muted-foreground">
                Never miss an inquiry with round-the-clock response to client questions.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card hover-scale border-t-4 border-t-accent-blue">
              <Shield className="h-12 w-12 text-accent-blue mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure & Compliant</h3>
              <p className="text-muted-foreground">
                Enterprise-grade security and real estate compliance built into every interaction.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card hover-scale border-t-4 border-t-accent-blue">
              <BarChart className="h-12 w-12 text-accent-blue mb-4" />
              <h3 className="text-xl font-semibold mb-2">Market Insights</h3>
              <p className="text-muted-foreground">
                Real-time data and analytics on property trends and market conditions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="section-padding bg-gradient-to-br from-secondary/80 to-secondary">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-sm font-semibold px-3 py-1 bg-accent-blue/10 text-accent-blue rounded-full mb-4">
              TESTIMONIALS
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-muted-foreground text-lg">
              Hear from real estate professionals who have transformed their business with Prop Panda
            </p>
          </div>

          {isMobile ? (
            <Carousel 
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {/* Review 1 */}
                <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                  <div className="card hover-scale p-6 h-full">
                    <div className="flex items-center mb-6">
                      <div className="mr-4">
                        <img 
                          src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7" 
                          alt="Sarah Chen" 
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Sarah Chen</h3>
                        <p className="text-muted-foreground">Real Estate Agent</p>
                      </div>
                    </div>
                    <div className="flex items-center mb-4">
                      <BadgeCheck className="h-6 w-6 text-green-500 mr-2" />
                      <span className="font-semibold text-green-700">5/5 Excellent</span>
                    </div>
                    <p className="text-muted-foreground">
                      "Prop Panda has revolutionized how I handle client inquiries. The 24/7 availability means I never miss an opportunity, and the AI responses are remarkably accurate and professional."
                    </p>
                  </div>
                </CarouselItem>

                {/* Review 2 */}
                <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                  <div className="card hover-scale p-6 h-full">
                    <div className="flex items-center mb-6">
                      <div className="mr-4">
                        <img 
                          src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" 
                          alt="Michael Tan" 
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Michael Tan</h3>
                        <p className="text-muted-foreground">Property Developer</p>
                      </div>
                    </div>
                    <div className="flex items-center mb-4">
                      <BadgeCheck className="h-6 w-6 text-green-500 mr-2" />
                      <span className="font-semibold text-green-700">4.5/5 Outstanding</span>
                    </div>
                    <p className="text-muted-foreground">
                      "The market insights and analytics provided by Prop Panda are invaluable. It helps me make data-driven decisions and stay ahead of market trends. A game-changer for my business."
                    </p>
                  </div>
                </CarouselItem>

                {/* Review 3 */}
                <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                  <div className="card hover-scale p-6 h-full">
                    <div className="flex items-center mb-6">
                      <div className="mr-4">
                        <img 
                          src="https://images.unsplash.com/photo-1581092795360-fd1ca04f0952" 
                          alt="Lisa Wong" 
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Lisa Wong</h3>
                        <p className="text-muted-foreground">Property Manager</p>
                      </div>
                    </div>
                    <div className="flex items-center mb-4">
                      <BadgeCheck className="h-6 w-6 text-green-500 mr-2" />
                      <span className="font-semibold text-green-700">5/5 Exceptional</span>
                    </div>
                    <p className="text-muted-foreground">
                      "Managing multiple properties became much easier with Prop Panda. The automated responses and scheduling features save me hours each week. Highly recommended!"
                    </p>
                  </div>
                </CarouselItem>
              </CarouselContent>
              <div className="flex justify-center mt-6">
                <CarouselPrevious className="static transform-none mx-2" />
                <CarouselNext className="static transform-none mx-2" />
              </div>
            </Carousel>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Review 1 */}
              <div className="card hover-scale p-8 bg-white">
                <div className="flex items-center mb-6">
                  <div className="mr-4">
                    <img 
                      src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7" 
                      alt="Sarah Chen" 
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Sarah Chen</h3>
                    <p className="text-muted-foreground">Real Estate Agent</p>
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  <BadgeCheck className="h-6 w-6 text-green-500 mr-2" />
                  <span className="font-semibold text-green-700">5/5 Excellent</span>
                </div>
                <p className="text-muted-foreground">
                  "Prop Panda has revolutionized how I handle client inquiries. The 24/7 availability means I never miss an opportunity, and the AI responses are remarkably accurate and professional."
                </p>
              </div>

              {/* Review 2 */}
              <div className="card hover-scale p-8 bg-white">
                <div className="flex items-center mb-6">
                  <div className="mr-4">
                    <img 
                      src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" 
                      alt="Michael Tan" 
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Michael Tan</h3>
                    <p className="text-muted-foreground">Property Developer</p>
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  <BadgeCheck className="h-6 w-6 text-green-500 mr-2" />
                  <span className="font-semibold text-green-700">4.5/5 Outstanding</span>
                </div>
                <p className="text-muted-foreground">
                  "The market insights and analytics provided by Prop Panda are invaluable. It helps me make data-driven decisions and stay ahead of market trends. A game-changer for my business."
                </p>
              </div>

              {/* Review 3 */}
              <div className="card hover-scale p-8 bg-white">
                <div className="flex items-center mb-6">
                  <div className="mr-4">
                    <img 
                      src="https://images.unsplash.com/photo-1581092795360-fd1ca04f0952" 
                      alt="Lisa Wong" 
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Lisa Wong</h3>
                    <p className="text-muted-foreground">Property Manager</p>
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  <BadgeCheck className="h-6 w-6 text-green-500 mr-2" />
                  <span className="font-semibold text-green-700">5/5 Exceptional</span>
                </div>
                <p className="text-muted-foreground">
                  "Managing multiple properties became much easier with Prop Panda. The automated responses and scheduling features save me hours each week. Highly recommended!"
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="bg-gradient-to-r from-accent-blue/90 to-accent-blue rounded-xl p-8 md:p-12 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="text-white">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Ready to transform your real estate business?
                </h2>
                <p className="mb-6 text-white/90">
                  Join hundreds of successful real estate professionals who are growing their business with Prop Panda.
                </p>
                <NavLink to="/case-studies" className="bg-white text-accent-blue hover:bg-white/90 px-6 py-3 rounded-md transition-all duration-300 inline-flex items-center font-medium">
                  See Success Stories <ArrowRight className="ml-2 h-5 w-5" />
                </NavLink>
              </div>
              <div className="rounded-lg overflow-hidden border shadow-sm">
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f" 
                  alt="Real estate professionals collaborating" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
