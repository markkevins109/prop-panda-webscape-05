import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, CalendarPlus, LogIn, FileText } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserDropdown from "../auth/UserDropdown";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Capabilities", path: "/capabilities" },
  { name: "Integrations", path: "/integrations" },
  { name: "Pricing", path: "/pricing" },
  { name: "Live Chat", path: "/live-chat" },
  { name: "Tutorials", path: "/tutorials" }
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<{ name: string; email: string } | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', session.user.id)
          .maybeSingle();
          
        setUserData({
          name: profile?.full_name || session.user.user_metadata?.name || "User",
          email: session.user.email || ""
        });
      } else {
        const demoAuth = localStorage.getItem("prop-panda-demo-auth");
        const userStr = localStorage.getItem("prop-panda-demo-user");
        
        if (demoAuth === "authenticated" && !isAuthenticated) {
          setIsAuthenticated(true);
          
          if (userStr) {
            try {
              const user = JSON.parse(userStr);
              setUserData(user);
            } catch (e) {
              console.error("Failed to parse user data:", e);
            }
          }
        }
      }
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAuth();
    });
    
    const handleStorageChange = () => {
      checkAuth();
    };
    
    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      subscription.unsubscribe();
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    
    localStorage.removeItem("prop-panda-demo-auth");
    localStorage.removeItem("prop-panda-demo-user");
    setIsAuthenticated(false);
    setUserData(null);
    navigate("/");
    
    window.dispatchEvent(new Event('storage'));
    
    toast({
      title: "Signed out successfully",
      description: "You have been logged out of your account"
    });
  };

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-background/95 shadow-md backdrop-blur-sm py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container-custom flex items-center justify-between">
        <NavLink to="/" className="flex items-center space-x-3">
          <Avatar className="w-8 h-8">
            <AvatarImage 
              src="/lovable-uploads/e5e3fd4d-75ad-4c2f-a2d2-a37743ee1940.png" 
              alt="Prop Panda AI Logo" 
              className="object-contain p-1"
            />
            <AvatarFallback>
              <Bot className="h-6 w-6 text-accent-blue" />
            </AvatarFallback>
          </Avatar>
          <span className="text-lg font-bold">Prop Panda</span>
        </NavLink>

        <div className="hidden md:flex items-center space-x-8">
          <nav className="flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) => 
                  `nav-link ${isActive ? "font-medium after:scale-x-100" : ""}`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>
          
          <NavLink to="/book-demo">
            <Button variant="default" className="bg-accent-blue hover:bg-accent-blue/90">
              <CalendarPlus className="mr-2" />
              Book a Demo
            </Button>
          </NavLink>
          
          {isAuthenticated ? (
            <UserDropdown 
              userName={userData?.name || "User"}
              onSignOut={handleSignOut}
            />
          ) : (
            <NavLink to="/auth">
              <Button variant="default" className="bg-accent-blue hover:bg-accent-blue/90">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            </NavLink>
          )}
        </div>

        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background shadow-md px-4 py-5 animate-fade-in">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) => 
                  `text-lg ${isActive ? "font-medium" : ""}`
                }
              >
                {link.name}
              </NavLink>
            ))}
            
            {isAuthenticated ? (
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                className="w-full text-red-500 hover:bg-red-50"
              >
                Sign Out
              </Button>
            ) : (
              <NavLink to="/auth" className="w-full">
                <Button variant="default" className="w-full bg-accent-blue hover:bg-accent-blue/90">
                  <LogIn className="mr-2" />
                  Sign In
                </Button>
              </NavLink>
            )}
            
            <NavLink to="/book-demo" className="w-full">
              <Button variant="default" className="w-full bg-accent-blue hover:bg-accent-blue/90">
                <CalendarPlus className="mr-2" />
                Book a Demo
              </Button>
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
}
