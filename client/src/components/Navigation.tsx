import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TrendingUp, LogOut } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Navigation() {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  const navLinks = [
    { path: "/", label: "Dashboard", id: "dashboard" },
    { path: "/signals", label: "Sinais", id: "signals" },
    { path: "/education", label: "Educação", id: "education" },
    { path: "/plans", label: "Planos", id: "plans" },
    ...(user?.role === "admin" ? [{ path: "/admin", label: "Admin", id: "admin" }] : []),
  ];

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await logout();
  };

  return (
    <nav className="bg-slate-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center space-x-2">
                <TrendingUp className="h-6 w-6 text-amber-400" />
                <h1 className="text-xl font-bold text-amber-400">TradeSignal Pro</h1>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.id}
                    href={link.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location === link.path
                        ? "bg-blue-700 text-white"
                        : "text-gray-300 hover:bg-blue-700 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.profileImageUrl} alt={user?.firstName || "User"} />
                <AvatarFallback>
                  {user?.firstName?.charAt(0) || user?.email?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">
                {user?.firstName || user?.email || "Trader"}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-300 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
