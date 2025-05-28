import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout, Button } from "@/components";
import { getMySubProfile, sendChatMessage } from "@/lib";

export default function ChatPage() {
  const { subProfileId } = useParams();
  const [subProfile, setSubProfile] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isOwner, setIsOwner] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const subProfileData = await getMySubProfile(subProfileId!);
        setSubProfile(subProfileData);
        setIsOwner(true);
      } catch (err: any) {
        console.error("Not authorized to view this sub-profile.", err);
        // fallback for external access (anonymous/token)
      }
    }

    fetchProfile();
  }, [subProfileId]);

  async function handleSend() {
    if (!input.trim()) return;
    try {
      const profileType = subProfile?.profileType?.toLowerCase();

      if (!profileType) {
        console.error("Missing profileType, cannot send chat.");
        return;
      }

      const response = await sendChatMessage({
        subProfileId: subProfileId!,
        message: input,
        profileType,
      });

      setMessages((prev) => [
        ...prev,
        { role: "client", content: input },
        { role: "agent", content: response },
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
              src={subProfile?.avatarUrl || "/default-avatar.png"}
              alt="Avatar"
              className="w-32 h-32 rounded-full object-cover mx-auto mb-2"
            />
            <h2 className="text-lg font-semibold">
              {subProfile?.firstName} {subProfile?.lastName}
            </h2>
            <p className="text-sm text-gray-600">{subProfile?.description}</p>
          </div>

          {isOwner ? (
            <div className="bg-white rounded shadow p-4 space-y-2">
              <Button
                onClick={() => navigate(`/edit-sub-profile/${subProfile.id}`)}
                variant="outline"
              >
                Edit Profile
              </Button>
              <Button onClick={() => {}} variant="outline">
                Create Token
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
                  msg.role === "agent" ? "text-blue-700" : "text-gray-800"
                }`}
              >
                <strong>{msg.role === "agent" ? "Agent:" : "You:"}</strong>{" "}
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
