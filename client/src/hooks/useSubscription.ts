import { useAuth } from "./useAuth";

export function useSubscription() {
  const { user } = useAuth();

  const isSubscriptionActive = () => {
    if (!user) return false;
    if (user.role === "admin") return true; // Admin always has access
    
    if (!user.subscriptionStatus || !user.subscriptionExpiry) return false;
    
    const now = new Date();
    const expiry = new Date(user.subscriptionExpiry);
    
    return user.subscriptionStatus === "active" && expiry > now;
  };

  const getSubscriptionStatus = () => {
    if (!user) return "none";
    if (user.role === "admin") return "admin";
    
    if (!user.subscriptionStatus) return "none";
    
    const now = new Date();
    const expiry = user.subscriptionExpiry ? new Date(user.subscriptionExpiry) : null;
    
    if (user.subscriptionStatus === "active" && expiry && expiry > now) {
      return "active";
    } else if (expiry && expiry <= now) {
      return "expired";
    } else {
      return user.subscriptionStatus;
    }
  };

  const getDaysUntilExpiry = () => {
    if (!user?.subscriptionExpiry) return null;
    
    const now = new Date();
    const expiry = new Date(user.subscriptionExpiry);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };

  return {
    isActive: isSubscriptionActive(),
    status: getSubscriptionStatus(),
    daysUntilExpiry: getDaysUntilExpiry(),
    plan: user?.subscriptionPlan,
    user
  };
}