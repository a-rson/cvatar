import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout, Button } from "@/components";
import { getMyProfile, sendChatMessage } from "@/lib";

export default function ChatPage() {
  const { profileId } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isOwner, setIsOwner] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const profileData = await getMyProfile(profileId!);
        setProfile(profileData);
        setIsOwner(true);
      } catch (err: any) {
        console.error("Not authorized to view this profile.", err);
      }
    }

    fetchProfile();
  }, [profileId]);

  async function handleSend() {
    if (!input.trim()) return;
    try {
      console.log(profileId, input);
      const response = await sendChatMessage(profileId!, input);
      setMessages((prev) => [
        ...prev,
        { role: "client", content: input },
        { role: "bot", content: response },
      ]);
      setInput("");
    } catch (err) {
      console.error("Message failed", err);
    }
  }

  return (
    <AppLayout>
      <div className="flex flex-col md:flex-row gap-6 h-full">
        {/* LEFT: Sidebar with profile info */}
        <div className="md:w-1/3 w-full space-y-4">
          <div className="bg-white rounded shadow p-4 text-center">
            <img
              src={profile?.candidate?.avatarUrl || "/default-avatar.png"}
              alt="Candidate avatar"
              className="w-32 h-32 rounded-full object-cover mx-auto mb-2"
            />
            <h2 className="text-lg font-semibold">
              {profile?.candidate?.firstName} {profile?.candidate?.lastName}
            </h2>
            <p className="text-sm text-gray-600">
              {profile?.candidate?.description}
            </p>
          </div>

          {isOwner ? (
            <div className="bg-white rounded shadow p-4 space-y-2">
              <h3 className="text-sm font-medium text-gray-700">
                Bot Settings
              </h3>
              <Button
                onClick={() => navigate(`/edit-profile/${profileId}`)}
                variant="outline"
              >
                Edit Bot Persona
              </Button>
            </div>
          ) : (
            <div className="bg-white rounded shadow p-4 text-center text-sm text-gray-700 space-y-2">
              <p>Want your own Cvatar?</p>
              <Button
                variant="outline"
                onClick={() => window.open("/", "_blank")}
              >
                Create Your Avatar
              </Button>
            </div>
          )}
        </div>

        {/* RIGHT: Chat window */}
        <div className="md:w-2/3 w-full flex flex-col bg-white rounded shadow p-4 h-[70vh]">
          <div className="flex-grow overflow-y-auto space-y-2 mb-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`text-sm ${
                  msg.role === "bot" ? "text-blue-700" : "text-gray-800"
                }`}
              >
                <strong>{msg.role === "bot" ? "Bot:" : "You:"}</strong>{" "}
                {msg.content}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-grow border p-2 rounded"
              placeholder="Ask something..."
            />
            <Button onClick={handleSend}>Send</Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
