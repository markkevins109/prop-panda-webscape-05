
import { ArrowRight, MessageSquare, Clock, Shield, BarChart } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PandaAvatar } from "@/components/PandaAvatar";
import { useState } from 'react';

export default function Home() {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [conversation, setConversation] = useState([
    { id: 1, sender: 'panda', message: 'Hello! I\'m Prop Panda, your AI real estate assistant. How can I help you today?' }
  ]);

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

  return (
    <div>
      {/* Hero Section */}
      <section className="section-padding min-h-[80vh] flex items-center">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                AI for Real Estate Professionals
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Your 24/7 Digital <br /> Real Estate Assistant
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Prop Panda automates client interactions, answers property questions, 
                schedules viewings, and provides market insights.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
                <NavLink
                  to="/book-demo"
                  className="btn-primary flex items-center justify-center sm:justify-start"
                >
                  Book a free Demo <ArrowRight className="ml-2 h-5 w-5" />
                </NavLink>
                <NavLink to="/capabilities" className="btn-secondary flex items-center justify-center sm:justify-start">
                  Explore Features
                </NavLink>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="relative bg-secondary rounded-lg p-8 shadow-lg">
                <div className="absolute -left-4 -top-4 bg-primary text-white p-4 rounded-lg">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="bg-accent p-3 rounded-lg max-w-[80%]">
                      <p className="text-sm">Hi there! I'm looking for a 3-bedroom house near downtown.</p>
                    </div>
                    <div className="bg-primary text-white p-3 rounded-lg max-w-[80%] ml-auto">
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

      {/* Features Overview */}
      <section className="bg-secondary section-padding">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How Prop Panda Powers Your Business</h2>
            <p className="text-muted-foreground text-lg">
              Our AI assistant streamlines your workflow, letting you focus on closing deals while we handle client communications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="card hover-scale">
              <MessageSquare className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Intelligent Conversations</h3>
              <p className="text-muted-foreground">
                Natural, human-like interactions with clients to answer questions and provide assistance.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card hover-scale">
              <Clock className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">24/7 Availability</h3>
              <p className="text-muted-foreground">
                Never miss an inquiry with round-the-clock response to client questions.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card hover-scale">
              <Shield className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure & Compliant</h3>
              <p className="text-muted-foreground">
                Enterprise-grade security and real estate compliance built into every interaction.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card hover-scale">
              <BarChart className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Market Insights</h3>
              <p className="text-muted-foreground">
                Real-time data and analytics on property trends and market conditions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="bg-secondary rounded-xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Ready to transform your real estate business?
                </h2>
                <p className="text-muted-foreground mb-6">
                  Join hundreds of successful real estate professionals who are growing their business with Prop Panda.
                </p>
                <NavLink to="/case-studies" className="btn-primary inline-flex items-center">
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
