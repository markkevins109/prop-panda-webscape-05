import React from "react";
import { Link } from "react-router-dom";
import { Book } from "lucide-react";

const demoSections = [
  {
    title: "Getting Started with Prop Panda",
    description: "See how easy it is to start chatting with your AI real estate assistant.",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    videoUrl: "#",
  },
  {
    title: "Instant Market Insights",
    description: "Learn how Prop Panda helps you schedule and manage property viewings.",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    videoUrl: "#",
  },
  {
    title: "Scheduling Property Tours",
    description: "Watch how you can get instant analytics and market data inside your chat.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    videoUrl: "#",
  },
  {
    title: "Secure and Compliant Chats",
    description: "Understand Prop Panda's security and compliance features in action.",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    videoUrl: "#",
  },
];

export default function Demo() {
  return (
    <div className="min-h-[80vh] bg-[#f7fafc]">
      <section className="py-12">
        <div className="container-custom">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Prop Panda Demo</h1>
            <p className="text-lg text-muted-foreground">
              Experience how Prop Panda transforms real estate communication! 
              <Link 
                to="/tutorials" 
                className="text-accent-blue underline ml-2 inline-flex items-center"
              >
                <Book className="mr-2 h-4 w-4" />
                More Tutorials
              </Link>
            </p>
          </div>
          <div className="grid gap-10 md:grid-cols-2">
            {demoSections.map((section, idx) => (
              <div key={section.title} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="relative w-full aspect-video overflow-hidden rounded-lg mb-5 group">
                  <img 
                    src={section.image}
                    alt={section.title}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      className="bg-accent-blue text-white px-6 py-3 rounded-full flex items-center space-x-2 transform hover:scale-105 transition-transform"
                      onClick={() => window.open(section.videoUrl, '_blank')}
                    >
                      Watch Demo
                    </button>
                  </div>
                </div>
                <h2 className="text-xl font-semibold mb-2">{section.title}</h2>
                <p className="text-muted-foreground">{section.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
