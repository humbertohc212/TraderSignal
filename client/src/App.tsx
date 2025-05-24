import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Signals from "@/pages/Signals";
import Education from "@/pages/Education";
import Plans from "@/pages/Plans";
import Admin from "@/pages/Admin";
import Demo from "@/pages/Demo";
import Subscribe from "@/pages/Subscribe";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading, hasToken } = useAuth();

  // Show loading only if we have a token and are checking auth
  if (hasToken && isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/login" component={Login} />
          <Route path="/demo" component={Demo} />
          <Route path="/plans" component={Plans} />
        </>
      ) : (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/signals" component={Signals} />
          <Route path="/education" component={Education} />
          <Route path="/plans" component={Plans} />
          <Route path="/admin" component={Admin} />
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
