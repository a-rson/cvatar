import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth } from "@/hooks";

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth({ verifyWithMe: true });

  if (loading) return <p className="p-6">Checking auth...</p>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
}
