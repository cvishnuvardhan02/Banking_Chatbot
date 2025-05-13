
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md px-4">
        <h1 className="text-6xl font-bold text-bank-purple mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">
          Oops! We couldn't find the page you're looking for.
        </p>
        <Button 
          onClick={() => navigate('/')}
          className="bg-bank-purple hover:bg-bank-light-purple"
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
