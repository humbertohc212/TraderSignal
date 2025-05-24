import { useAuth } from "@/hooks/useAuth";
import { 
  BarChart3, 
  Signal, 
  TrendingUp, 
  GraduationCap, 
  Crown,
  Settings,
  Video,
  Users,
  Tags,
  Bell
} from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Sidebar() {
  const { user } = useAuth();
  const [location] = useLocation();

  const userLinks = [
    { path: "/", icon: BarChart3, label: "Overview", id: "overview" },
    { path: "/signals", icon: Signal, label: "Sinais Ativos", id: "signals" },
    { path: "/", icon: TrendingUp, label: "Performance", id: "performance" },
    { path: "/education", icon: GraduationCap, label: "Educação", id: "education" },
    { path: "/plans", icon: Crown, label: "Minha Assinatura", id: "subscription" },
  ];

  const adminLinks = user?.role === "admin" ? [
    { path: "/admin", icon: Settings, label: "Painel Admin", id: "admin-panel" },
    { path: "/admin-dashboard", icon: BarChart3, label: "Admin Dashboard", id: "admin-dashboard" },
    { path: "/admin/reports", icon: BarChart3, label: "Relatórios", id: "admin-reports" },
    { path: "/admin?tab=signals", icon: Signal, label: "Gerenciar Sinais", id: "admin-signals" },
    { path: "/admin?tab=lessons", icon: Video, label: "Gerenciar Aulas", id: "admin-courses" },
    { path: "/admin?tab=users", icon: Users, label: "Usuários", id: "admin-users" },
    { path: "/admin?tab=plans", icon: Tags, label: "Planos", id: "admin-plans" },
    { path: "/admin?tab=subscriptions", icon: Bell, label: "Solicitações", id: "admin-requests" },
  ] : [];

  return (
    <aside className="w-64 bg-white shadow-lg min-h-screen">
      <div className="p-6">
        <div className="space-y-1">
          {userLinks.map((link) => (
            <Link
              key={link.id}
              href={link.path}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                location === link.path
                  ? "bg-blue-50 border-r-2 border-blue-500 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <link.icon 
                className={`mr-3 h-5 w-5 ${
                  location === link.path 
                    ? "text-blue-500" 
                    : "text-gray-400 group-hover:text-gray-500"
                }`} 
              />
              {link.label}
            </Link>
          ))}
        </div>

        {/* Admin Section */}
        {adminLinks.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Administração
            </h3>
            <div className="mt-2 space-y-1">
              {adminLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.path}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    location === link.path
                      ? "bg-blue-50 border-r-2 border-blue-500 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <link.icon 
                    className={`mr-3 h-5 w-5 ${
                      location === link.path 
                        ? "text-blue-500" 
                        : "text-gray-400 group-hover:text-gray-500"
                    }`} 
                  />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
