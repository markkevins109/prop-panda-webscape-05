
import { useState } from "react";
import { ArrowRight } from "lucide-react";

export default function LiveChat() {
  // For simplicity, just set the initial message from Prop Panda.
  const [message, setMessage] = useState("");
  // Later the chat messages could be an array of objects, but right now only the bot's intro is shown

  return (
    <div>
      <section className="py-12">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">Experience Prop Panda</h1>
            <p className="text-lg text-muted-foreground">
              Try our interactive demo and see how Prop Panda transforms real estate communication.
            </p>
          </div>

          {/* Chat Card */}
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow border overflow-hidden">
            {/* Chat Header */}
            <div className="bg-black text-white px-6 py-4 flex items-center rounded-t-xl">
              <span className="font-semibold">
                <span className="inline-block mr-2">🏠</span>
                Prop Panda Chat
              </span>
            </div>
            {/* Chat Body */}
            <div className="px-6 py-6 min-h-[220px] flex flex-col">
              <div className="mb-2">
                <div className="bg-muted px-4 py-3 rounded-md text-base max-w-xl">
                  Hello! I'm Prop Panda, your AI real estate assistant. How can I help you today?
                </div>
              </div>
              {/* This area intentionally left empty, for chat messages to appear */}
              <div className="flex-1"></div>
            </div>
            {/* Chat Input */}
            <div className="border-t flex flex-col gap-1 p-6 bg-[#fafafa]">
              <div className="flex">
                <input
                  type="text"
                  className="flex-1 rounded-l-md border border-input bg-background px-3 py-3 text-base placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-accent-blue focus:outline-none"
                  placeholder="Type your question here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled
                  // Disabled input as only bot message is shown for now
                />
                <button
                  className="bg-black text-white px-4 rounded-r-md flex items-center justify-center ml-2 disabled:opacity-60"
                  disabled
                  tabIndex={-1}
                >
                  <ArrowRight size={22} />
                </button>
              </div>
              <div className="text-sm text-muted-foreground mt-2 pl-1">
                Try asking:
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
