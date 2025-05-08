
import { useState } from "react";
import { PageContainer, PageHero, SectionContainer } from "@/components/ui/page-container";

export default function LiveChat() {
  const [message, setMessage] = useState("");

  return (
    <PageContainer>
      <PageHero
        title="Experience Prop Panda" 
        description="Try our interactive demo and see how Prop Panda transforms real estate communication."
      />
      
      {/* Chat Demo Section */}
      <SectionContainer bgColor="bg-gradient-to-br from-white to-secondary/60">
        {/* Main Chat/Avatar Card - Increased max-width and adjusted layout */}
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg border overflow-hidden flex flex-col md:flex-row transform transition-all hover:shadow-xl animate-fade-in">
          {/* Chat Section (Left) - Increased padding and minimum height */}
          <div className="flex-1 flex flex-col justify-between px-8 py-8 min-h-[480px]">
            {/* Chat Header */}
            <div className="bg-black text-white px-0 py-3 mb-6 rounded-t-xl rounded-b-md md:rounded-tl-xl md:rounded-tr-none">
              <span className="font-semibold text-lg px-6 block text-left">
                Prop Panda Chat
              </span>
            </div>
            {/* Chat Body - Increased space */}
            <div className="flex flex-col flex-1">
              <div className="mb-4 flex items-start">
                <img
                  src="/lovable-uploads/7a66aa22-072b-4bf9-bf1e-ec32f5d99726.png"
                  alt="Prop Panda Logo"
                  className="w-12 h-12 rounded-full mr-3 border-2 border-accent-blue shadow"
                  style={{
                    background: "#fff",
                  }}
                />
                <div className="bg-muted px-4 py-3 rounded-md text-base max-w-xl flex-1">
                  Hello! I'm Prop Panda, your AI real estate assistant. How can I help you today?
                </div>
              </div>
              <div className="flex-1"></div>
            </div>
            {/* Chat Input - Slightly wider input */}
            <div className="border-t flex flex-col gap-2 pt-4 mt-8 bg-transparent">
              <div className="flex">
                <input
                  type="text"
                  className="flex-1 rounded-l-md border border-input bg-background px-3 py-3 text-base placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-accent-blue focus:outline-none"
                  placeholder="Type your question here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled
                />
                <button
                  className="bg-black text-white px-4 rounded-r-md flex items-center justify-center ml-2 disabled:opacity-60"
                  disabled
                  tabIndex={-1}
                >
                  <span className="font-semibold">Send</span>
                </button>
              </div>
            </div>
          </div>
          {/* Avatar Section (Right) - Increased width and padding */}
          <div className="hidden md:flex flex-col items-center justify-center w-[400px] bg-[#f6faff] border-l px-10 py-12 relative">
            <img
              src="/lovable-uploads/199d658f-bb57-47b7-958a-6f541715c4e5.png"
              alt="Prop Panda AI Avatar"
              className="w-48 h-48 rounded-full mx-auto border-4 border-accent-blue object-cover bg-white shadow-lg"
              style={{
                background: "radial-gradient(ellipse at center, #e6f0fa 0%, #fafcfd 100%)"
              }}
            />
            <p className="mt-6 text-center text-accent-blue font-semibold text-xl">I'm your assistant<br />Prop Panda</p>
          </div>
          {/* Responsive avatar for mobile */}
          <div className="md:hidden flex items-center justify-center w-full bg-[#f6faff] border-t px-8 py-8">
            <img
              src="/lovable-uploads/199d658f-bb57-47b7-958a-6f541715c4e5.png"
              alt="Prop Panda AI Avatar"
              className="w-24 h-24 rounded-full border-2 border-accent-blue object-cover bg-white shadow"
            />
            <span className="ml-4 text-base text-accent-blue font-semibold">
              I'm your assistant<br />Prop Panda
            </span>
          </div>
        </div>
      </SectionContainer>
    </PageContainer>
  );
}
