
import { NavLink } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="bg-secondary py-12 border-t">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Prop Panda</h3>
            <p className="text-muted-foreground mb-4">
              AI-powered chatbot revolutionizing communication in real estate.
            </p>
            <div className="flex space-x-4">
              {/* Social Media Icons Placeholder */}
              
              <a href="#" className="hover:text-primary/80 transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links - First Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <NavLink to="/" className="hover:text-primary/80 transition-colors">
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/capabilities" className="hover:text-primary/80 transition-colors">
                  Capabilities
                </NavLink>
              </li>
              <li>
                <NavLink to="/pricing" className="hover:text-primary/80 transition-colors">
                  Pricing
                </NavLink>
              </li>
              <li>
                <NavLink to="/community" className="hover:text-primary/80 transition-colors">
                  Community
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Quick Links - Second Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4">&nbsp;</h3>
            <ul className="space-y-2">
              <li>
                <NavLink to="/case-studies" className="hover:text-primary/80 transition-colors">
                  Case Studies
                </NavLink>
              </li>
              <li>
                <NavLink to="/live-chat" className="hover:text-primary/80 transition-colors">
                  Live Chat Demo
                </NavLink>
              </li>
              <li>
                <NavLink to="/blog" className="hover:text-primary/80 transition-colors">
                  Blog
                </NavLink>
              </li>
              <li>
                <NavLink to="/agent-data" className="hover:text-primary/80 transition-colors">
                  Agent Data
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-primary shrink-0 mt-0.5" />
                <span>21 Tan Quee Lan Street, #02-04 Heritage place, Singapore, 188108.</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-primary" />
                <a href="tel:+65 8795 8800" className="hover:text-primary/80 transition-colors">
                  +65 8795 8800
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-primary" />
                <a href="mailto:info@proppanda.ai" className="hover:text-primary/80 transition-colors">
                  hello@genzi.ai
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Prop Panda. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

