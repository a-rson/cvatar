import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../lib";
import { AuthLayout } from "@/components";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await register({
        email,
        password,
      });
      navigate("/login");
    } catch (err) {
      setError("Registration failed.");
    }
  }

  return (
    <AuthLayout>
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8">
        <h2 className="text-2xl font-semibold">Register</h2>
        <form onSubmit={handleRegister} className="flex flex-col gap-4 w-80">
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
          <input
            type="password"
            placeholder="Confirm Password"
            className="p-2 border rounded"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="p-2 bg-green-600 text-white rounded">
            Register
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
