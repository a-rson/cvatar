import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "@/lib/auth";
import { ArrowLeft, LogOut } from "lucide-react";

export default function AppLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Top bar */}
      <header className="bg-white shadow px-4 py-3 flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-700 hover:text-black flex items-center gap-1"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <button
          onClick={logout}
          className="text-gray-700 hover:text-black flex items-center gap-1"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </header>

      {/* Page content */}
      <main className="p-6 flex-grow">{children}</main>
    </div>
  );
}
