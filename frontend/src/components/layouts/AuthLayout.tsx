import { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const showBack = location.pathname !== "/";

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left panel */}
      <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-8 relative">
        <img
          src="/assets/logo.png"
          alt="Cvatar Logo"
          className="w-96 h-96 mb-0"
        />
        <p className="text-center text-lg max-w-xs -mt-10 z-10">
          Your AI-powered interactive profile that speaks on your behalf
        </p>
      </div>

      {/* Right panel */}
      <div className="relative flex justify-center items-center bg-white p-6 sm:p-10">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 text-gray-600 hover:text-black transition"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
