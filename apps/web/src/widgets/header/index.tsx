import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuthStore } from "@/shared/lib";
import Button from "@/shared/components/ui/button";

export function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="bg-zinc-950 border-b border-zinc-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/feed" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center">
              <span className="text-zinc-950 font-bold text-sm">Q</span>
            </div>
            <span className="text-zinc-100 font-semibold text-lg">Quotes</span>
          </Link>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <Link
              to={`/${user?.username}`}
              className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-zinc-950 font-bold text-xs uppercase">
                {user?.username?.[0] ?? "?"}
              </div>
              <span className="text-sm font-medium hidden sm:block">
                {user?.username}
              </span>
            </Link>

            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              icon={<LogOut size={16} />}
              className="text-zinc-400 hover:text-zinc-100"
            >
              <span className="hidden sm:block">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;