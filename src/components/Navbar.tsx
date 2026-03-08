import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const links = [
    { to: "/", label: "Home" },
    { to: "/profile", label: "Find Opportunities" },
    { to: "/tracker", label: "My Tracker" },
  ];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-display text-primary tracking-wider">SheSignal</span>
        </Link>
        <div className="flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {!user ? (
            <Link
              to="/login"
              className="ml-2 px-4 py-2 rounded-md text-sm font-medium border border-primary text-primary hover:bg-primary/10 transition-colors"
            >
              Sign In
            </Link>
          ) : (
            <div className="flex items-center gap-2 ml-2">
              <span className="text-xs text-muted-foreground max-w-[120px] truncate hidden sm:block">
                {user.email}
              </span>
              <button
                onClick={handleSignOut}
                className="px-3 py-1.5 rounded-md text-xs font-medium text-muted-foreground border border-border hover:border-primary hover:text-primary transition-colors"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
