import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error in auth callback:", error);
        navigate("/auth/login");
        return;
      }
      
      // Check if we have stored user type data from GitHub signup
      const userType = localStorage.getItem('userType');
      const companyName = localStorage.getItem('companyName');
      
      if (data.session?.user && userType) {
        // Update the user's profile with the stored user type
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.session.user.id,
            email: data.session.user.email,
            full_name: data.session.user.user_metadata?.full_name,
            avatar_url: data.session.user.user_metadata?.avatar_url,
            user_type: userType,
            company_name: userType === 'company' ? companyName : null,
            updated_at: new Date().toISOString()
          });
          
        if (profileError) {
          console.error("Error updating profile:", profileError);
        }
        
        // Clear the stored data
        localStorage.removeItem('userType');
        localStorage.removeItem('companyName');
        
        // Redirect to the appropriate dashboard based on user type
        navigate(userType === 'company' ? '/app/company' : '/app');
      } else {
        // If no user type was stored, redirect to /app where DashboardRedirect will handle routing
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
