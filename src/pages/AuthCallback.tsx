
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle the OAuth callback
    const handleAuthCallback = async () => {
      // Get the session and check if we're authenticated
      const { data } = await supabase.auth.getSession();
      
      // Redirect to the home page or a protected route
      if (data.session) {
        navigate("/", { replace: true });
      } else {
        navigate("/auth", { replace: true });
      }
    };
    
    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-heartfelt-burgundy"></div>
    </div>
  );
};

export default AuthCallback;
