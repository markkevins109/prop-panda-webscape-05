
import { ArrowRight, MessageSquare, Clock, Shield, BarChart } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Home() {
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
                <NavLink to="/live-chat" className="btn-primary flex items-center justify-center sm:justify-start">
                  Try the Demo <ArrowRight className="ml-2 h-5 w-5" />
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
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1073&q=80" 
                  alt="Real estate professionals using Prop Panda" 
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
