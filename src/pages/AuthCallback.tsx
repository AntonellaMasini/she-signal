import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate("/login");
      return;
    }

    const checkProfileAndRedirect = async () => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("field")
        .eq("id", user.id)
        .single();

      if (!profile?.field) {
        navigate("/profile");
      } else {
        navigate("/signals");
      }
    };

    checkProfileAndRedirect();
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-primary font-display text-2xl tracking-wider animate-pulse">
        SheSignal
      </div>
    </div>
  );
};

export default AuthCallback;
