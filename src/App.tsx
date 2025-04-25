import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Layout from "./components/layout/Layout";

import PropertiesPage from "./pages/properties/PropertiesPage";
import NewPropertyPage from "./pages/properties/NewPropertyPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile/setup" element={<Layout><ProfileSetup /></Layout>} />
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/capabilities" element={<Layout><Capabilities /></Layout>} />
            <Route path="/blog" element={<Layout><Blog /></Layout>} />
            <Route path="/community" element={<Layout><Community /></Layout>} />
            <Route path="/pricing" element={<Layout><Pricing /></Layout>} />
            <Route path="/case-studies" element={<Layout><CaseStudies /></Layout>} />
            <Route path="/integrations" element={<Layout><Integrations /></Layout>} />
            <Route path="/live-chat" element={<Layout><LiveChat /></Layout>} />
            <Route path="/demo" element={<Layout><Demo /></Layout>} />
            <Route path="/book-demo" element={<Layout><BookDemo /></Layout>} />
            <Route path="/profile" element={<Layout><Profile /></Layout>} />
            <Route path="/user-profile" element={<Layout><UserProfile /></Layout>} />
            <Route path="/tutorials" element={<Layout><Tutorials /></Layout>} />
            <Route path="/agent-data" element={<Layout><AgentDataForm /></Layout>} />
            <Route path="/properties" element={<Layout><PropertiesPage /></Layout>} />
            <Route path="/properties/new" element={<Layout><NewPropertyPage /></Layout>} />
            <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
