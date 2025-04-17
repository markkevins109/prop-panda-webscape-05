
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Oops! We couldn't find the page you're looking for.
        </p>
        <NavLink to="/" className="btn-primary inline-flex items-center">
          <ArrowLeft className="mr-2 h-5 w-5" /> Return to Home
        </NavLink>
      </div>
    </div>
  );
};

export default NotFound;
