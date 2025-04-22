
import React from "react";

const demoSections = [
  {
    title: "Getting Started with Prop Panda",
    description: "See how easy it is to start chatting with your AI real estate assistant.",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
  },
  {
    title: "Scheduling Property Tours",
    description: "Learn how Prop Panda helps you schedule and manage property viewings.",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
  },
  {
    title: "Instant Market Insights",
    description: "Watch how you can get instant analytics and market data inside your chat.",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
  },
  {
    title: "Secure and Compliant Chats",
    description: "Understand Prop Panda's security and compliance features in action.",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
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
              Explore how to use the Prop Panda live chat assistant! Watch the short examples below.
            </p>
          </div>
          <div className="grid gap-10 md:grid-cols-2">
            {demoSections.map((section, idx) => (
              <div key={section.title} className="bg-white rounded-xl p-6 shadow-md flex flex-col items-center">
                <div className="w-full aspect-[16/9] overflow-hidden rounded-lg mb-5 bg-neutral-200">
                  <img 
                    src={section.image}
                    alt={section.title}
                    className="object-cover w-full h-full"
                  />
                </div>
                <h2 className="text-xl font-semibold mb-2 text-center">{section.title}</h2>
                <p className="text-muted-foreground text-center">{section.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
