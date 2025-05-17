import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from "lucide-react";

const DashboardRedirect = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    const checkUserType = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user type:', error);
          setLoading(false);
          return;
        }
        
        setUserType(data?.user_type);
        setLoading(false);
      } catch (err) {
        console.error('Error checking user type:', err);
        setLoading(false);
      }
    };

    checkUserType();
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-arena-600" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Redirect to the type selection page if user type is not set
  if (!userType) {
    return <Navigate to="/app/select-type" replace />;
  }

  // Redirect to company or participant dashboard based on user type
  if (userType === 'company') {
    return <Navigate to="/app/company" replace />;
  }

  return <Navigate to="/app" replace />;
};

export default DashboardRedirect; 