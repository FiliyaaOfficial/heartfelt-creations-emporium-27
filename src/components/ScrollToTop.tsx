
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import FloatingButtons from "./FloatingButtons";

export default function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return <FloatingButtons />;
}
