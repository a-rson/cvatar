import { useNavigate } from "react-router-dom";
import { AuthLayout, Button } from "@/components";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <AuthLayout>
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold text-center">
          Welcome to Cvatar
        </h2>
        <p className="text-gray-700 text-center">
          Create your profile and let AI handle your recruitment conversations.
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <Button onClick={() => navigate("/register")}>Register</Button>
          <Button variant="outline" onClick={() => navigate("/login")}>
            Login
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
}
