
import { useState } from "react";

export default function LiveChat() {
  const [message, setMessage] = useState("");

  return (
    <div>
      <section className="py-12">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">Experience Prop Panda</h1>
            <p className="text-lg text-muted-foreground">
              Try our interactive demo and see how Prop Panda transforms real estate communication.
            </p>
          </div>

          {/* Main Chat/Aavatar Card */}
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow border overflow-hidden flex flex-col md:flex-row">
            {/* Chat Section (Left) */}
            <div className="flex-1 flex flex-col justify-between px-6 py-6 min-h-[320px]">
              {/* Chat Header */}
              <div className="bg-black text-white px-0 py-2 mb-6 rounded-t-xl rounded-b-md md:rounded-tl-xl md:rounded-tr-none">
                <span className="font-semibold text-lg px-6 block text-left">
                  Prop Panda Chat
                </span>
              </div>
              {/* Chat Body */}
              <div className="flex flex-col flex-1">
                <div className="mb-2">
                  <div className="bg-muted px-4 py-3 rounded-md text-base max-w-xl">
                    Hello! I'm Prop Panda, your AI real estate assistant. How can I help you today?
                  </div>
                </div>
                <div className="flex-1"></div>
              </div>
              {/* Chat Input */}
              <div className="border-t flex flex-col gap-1 pt-4 mt-8 bg-transparent">
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
                    {/* No icon */}
                    <span className="font-semibold">Send</span>
                  </button>
                </div>
                <div className="text-sm text-muted-foreground mt-2 pl-1">Try asking:</div>
              </div>
            </div>
            {/* Avatar Section (Right) */}
            <div className="hidden md:flex flex-col items-center justify-center w-[320px] bg-[#f6faff] border-l px-8 py-10 relative">
              <img
                src="/lovable-uploads/199d658f-bb57-47b7-958a-6f541715c4e5.png"
                alt="Prop Panda AI Avatar"
                className="w-40 h-40 rounded-full mx-auto border-4 border-accent-blue object-cover bg-white shadow-lg"
                style={{
                  background: "radial-gradient(ellipse at center, #e6f0fa 0%, #fafcfd 100%)"
                }}
              />
              <p className="mt-6 text-center text-accent-blue font-semibold text-lg">I'm your assistant<br />Prop Panda</p>
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
        </div>
      </section>
    </div>
  );
}
