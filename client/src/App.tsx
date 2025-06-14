import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import AdminDashboard from "@/components/AdminDashboard";
import AdminReports from "@/pages/AdminReports";
import Signals from "@/pages/Signals";
import Education from "@/pages/Education";
import Community from "@/pages/Community";
import Plans from "@/pages/Plans";
import Admin from "@/pages/Admin";
import Demo from "@/pages/Demo";
import Subscribe from "@/pages/Subscribe";
import Checkout from "@/pages/Checkout";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  const [location] = useLocation();

  // If still loading, show loading screen only if we're not on public routes
  if (isLoading && !['/', '/login', '/demo', '/plans'].includes(location)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Switch>
      {/* Login page should always be accessible */}
      <Route path="/login" component={Login} />
      
      {!isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/demo" component={Demo} />
          <Route path="/plans" component={Plans} />
        </>
      ) : (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/signals" component={Signals} />
          <Route path="/education" component={Education} />
          <Route path="/community" component={Community} />
          <Route path="/plans" component={Plans} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/profile" component={Profile} />
          <Route path="/admin" component={Admin} />
          <Route path="/admin-dashboard" component={AdminDashboard} />
          <Route path="/admin/reports" component={AdminReports} />
          <Route path="/demo" component={Demo} />
          <Route path="/subscribe" component={Subscribe} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
