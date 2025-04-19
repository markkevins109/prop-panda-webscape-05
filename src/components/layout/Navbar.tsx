
import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { PandaAvatar } from "../PandaAvatar";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Capabilities", path: "/capabilities" },
  { name: "Live Chat", path: "/live-chat" },
  { name: "Integrations", path: "/integrations" },
  { name: "Pricing", path: "/pricing" },
  { name: "Case Studies", path: "/case-studies" }
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

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

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-background/95 shadow-md backdrop-blur-sm py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container-custom flex items-center justify-between">
        <NavLink to="/" className="flex items-center space-x-3">
          <PandaAvatar />
          <span className="text-xl font-bold">Prop Panda</span>
        </NavLink>

        <nav className="hidden md:flex items-center space-x-8">
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

        <NavLink 
          to="/live-chat" 
          className="hidden md:block btn-primary"
        >
          Try the Demo
        </NavLink>

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
            <NavLink 
              to="/live-chat" 
              className="btn-primary text-center mt-2"
            >
              Try the Demo
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
}
