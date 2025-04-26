import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import Layout from "./components/layout/Layout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import Selection from "./pages/Selection";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
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
              <Route path="/tutorials" element={<Layout><Tutorials /></Layout>} />
              <Route path="/agent-data" element={<Layout><AgentDataForm /></Layout>} />
              <Route path="/login" element={<Layout><Login /></Layout>} />
              <Route path="/signup" element={<Layout><Signup /></Layout>} />
              <Route
                path="/property-listing"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <PropertyListing />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/property-listings"
                element={
                  <Layout>
                    <PropertyListings />
                  </Layout>
                }
              />
              <Route path="/selection" element={
                <ProtectedRoute>
                  <Layout>
                    <Selection />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="*" element={<Layout><NotFound /></Layout>} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
