import { useEffect, useState } from "react";
import { getUserFromToken, JWTUserPayload } from "../lib/auth";
import { getMe } from "../lib/api";

export function useAuth(options?: { verifyWithMe?: boolean }) {
  const [user, setUser] = useState<JWTUserPayload | null>(getUserFromToken());
  const [loading, setLoading] = useState(!!options?.verifyWithMe);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!options?.verifyWithMe) return;

    getMe()
      .then((validatedUser) => setUser(validatedUser))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [options?.verifyWithMe]);

  return {
    user,
    isAuthenticated: !!user,
    loading,
    error,
  };
}
