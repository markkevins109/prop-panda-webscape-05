
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/ui/page-container";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <PageContainer className="flex items-center justify-center">
      <div className="text-center max-w-md px-4 py-16">
        <div className="bg-gradient-to-br from-white to-secondary p-8 rounded-xl shadow-md animate-fade-in">
          <h1 className="text-6xl font-bold mb-4 text-accent-blue">404</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Oops! We couldn't find the page you're looking for.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <NavLink to="/" className="btn-accent inline-flex items-center justify-center">
              <Home className="mr-2 h-5 w-5" /> Return to Home
            </NavLink>
            <Button variant="outline" onClick={() => window.history.back()} className="inline-flex items-center justify-center">
              <ArrowLeft className="mr-2 h-5 w-5" /> Go Back
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default NotFound;
