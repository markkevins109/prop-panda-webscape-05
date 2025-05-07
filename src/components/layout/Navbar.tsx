import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu, X, CalendarPlus, LogIn, LogOut, User } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const publicNavLinks = [
  { name: "Home", path: "/" },
  { name: "Capabilities", path: "/capabilities" },
  { name: "Integrations", path: "/integrations" },
  { name: "Pricing", path: "/pricing" },
  { name: "Live Chat", path: "/live-chat" },
  { name: "Tutorials", path: "/tutorials" }
];

const authNavLinks = [
  { name: "Properties", path: "/property-listings" }
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

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
    await signOut();
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

        <div className="hidden md:flex items-center space-x-4">
          <nav className="flex items-center space-x-8">
            {publicNavLinks.map((link) => (
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
            
            {user && authNavLinks.map((link) => (
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
          
          <div className="flex items-center space-x-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-accent-blue text-accent-blue hover:bg-accent-blue/10">
                    <User className="mr-2 h-4 w-4" />
                    My Account
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    {user.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <NavLink to="/property-listings" className="w-full flex items-center">
                      Properties
                    </NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <NavLink to="/login">
                <Button variant="outline" className="border-accent-blue text-accent-blue hover:bg-accent-blue/10">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign in
                </Button>
              </NavLink>
            )}
            
            <NavLink to="/book-demo">
              <Button variant="default" className="bg-accent-blue hover:bg-accent-blue/90">
                <CalendarPlus className="mr-2" />
                Book a Demo
              </Button>
            </NavLink>
          </div>
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
            {publicNavLinks.map((link) => (
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
            
            {user && authNavLinks.map((link) => (
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
            
            {user ? (
              <Button variant="outline" className="w-full border-accent-blue text-accent-blue hover:bg-accent-blue/10" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            ) : (
              <NavLink to="/login" className="w-full">
                <Button variant="outline" className="w-full border-accent-blue text-accent-blue hover:bg-accent-blue/10">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign in
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
