import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, getUserFromToken } from "@/lib";
import { AuthLayout } from "@/components";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    try {
      await login({ email, password });

      const user = getUserFromToken();

      if (!user) {
        setError("Could not decode user from token.");
        return;
      }

      if (user.type === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    }
  }

  return (
    <AuthLayout>
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8">
        <h2 className="text-2xl font-semibold">Provider Login</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4 w-80">
          <input
            type="email"
            placeholder="Email"
            className="p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="p-2 bg-blue-600 text-white rounded">
            Log In
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
