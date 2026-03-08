import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { NotFound as NotFoundUI } from "@/components/ui/not-found-2";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return <NotFoundUI />;
};

export default NotFound;
