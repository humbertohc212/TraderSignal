import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Signal, 
  BookOpen, 
  Star, 
  Settings, 
  User, 
  LogOut,
  Menu,
  X,
  Bell,
  TrendingUp
} from "lucide-react";

export default function ModernNavigation() {
  const { user } = useAuth();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { href: "/", label: "Dashboard", icon: BarChart3 },
    { href: "/signals", label: "Sinais", icon: Signal },
    { href: "/education", label: "Educação", icon: BookOpen },
    { href: "/plans", label: "Planos", icon: Star },
  ];

  if (user?.role === "admin") {
    menuItems.push({ href: "/admin", label: "Admin", icon: Settings });
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer group">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                TradePro
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={`relative px-4 py-2 rounded-xl transition-all duration-300 ${
                    location === item.href
                      ? "bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-white"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.label}
                  {location === item.href && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl border border-purple-500/30" />
                  )}
                </Button>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Notifications */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative text-gray-300 hover:text-white hover:bg-white/5 rounded-xl"
                >
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs flex items-center justify-center p-0">
                    3
                  </Badge>
                </Button>

                {/* User Profile */}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="hidden md:block">
                    <div className="text-sm font-medium text-white">
                      {user.firstName || "Usuário"}
                    </div>
                    <div className="text-xs text-gray-400">
                      {user.role === "admin" ? "Administrador" : "Trader"}
                    </div>
                  </div>
                </div>

                {/* Logout */}
                <Link href="/api/logout">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-300 hover:text-white hover:bg-red-500/10 rounded-xl"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </Link>
              </>
            ) : (
              <Link href="/api/login">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl px-6 py-2 font-semibold transform hover:scale-105 transition-all duration-300">
                  Entrar
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-gray-300 hover:text-white hover:bg-white/5 rounded-xl"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-slate-800/90 backdrop-blur-xl rounded-xl m-4 p-4 border border-white/10">
            <div className="space-y-2">
              {menuItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start rounded-xl transition-all duration-300 ${
                      location === item.href
                        ? "bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-white"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}