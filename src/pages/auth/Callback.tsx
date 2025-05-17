
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error in auth callback:", error);
        navigate("/auth/login");
      } else {
        navigate("/app");
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-medium">Processing authentication...</h2>
        <p className="text-muted-foreground">Please wait while we log you in.</p>
      </div>
    </div>
  );
};

export default Callback;
