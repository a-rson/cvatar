import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-xl w-full">
        <h1 className="text-3xl font-bold text-center mb-4">
          Welcome to Cvatar
        </h1>
        <p className="text-gray-700 text-center text-lg mb-6">
          Cvatar helps <strong>candidates</strong> and{" "}
          <strong>companies</strong> build AI-powered interactive profiles that
          speak on your behalf.
        </p>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <img
              src="/assets/profile-icon.svg"
              alt="Profile"
              className="w-6 h-6 mt-1"
            />
            <span>
              Create your profile with experience, skills, or company services
            </span>
          </li>
          <li className="flex items-start gap-3">
            <img
              src="/assets/chat-icon.svg"
              alt="Customize AI"
              className="w-6 h-6 mt-1"
            />
            <span>Customize how your AI communicates</span>
          </li>
          <li className="flex items-start gap-3">
            <img
              src="/assets/qr-icon.svg"
              alt="QR code"
              className="w-6 h-6 mt-1"
            />
            <span>Generate a secure link or QR code</span>
          </li>
          <li className="flex items-start gap-3">
            <img
              src="/assets/send-icon.svg"
              alt="Share"
              className="w-6 h-6 mt-1"
            />
            <span>Share it — and let your AI handle the conversation</span>
          </li>
        </ul>
        <div className="flex justify-center gap-4 mt-6">
          <Button onClick={() => navigate("/register")}>Register</Button>
          <Button variant="outline" onClick={() => navigate("/login")}>
            Login
          </Button>
        </div>
      </div>
    </div>
  );
}
