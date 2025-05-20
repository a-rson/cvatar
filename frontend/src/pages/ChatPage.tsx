import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppLayout, Button } from "@/components";
import { getMyProfile } from "@/lib";

export default function ChatPage() {
  const { profileId } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const profileData = await getMyProfile(profileId!);
        setProfile(profileData);
        setIsOwner(true);
      } catch (err: any) {
        console.error("Not authorized to view this profile.", err);
        // Optionally redirect or show an error
      }
    }

    fetchProfile();
  }, [profileId]);

  async function sendMessage() {
    if (!input.trim()) return;
    const token = localStorage.getItem("token");
    const accessToken = localStorage.getItem("access-token");
    try {
      const res = await axios.post(
        `/chat/${profileId}`,
        { message: input },
        {
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : { "authorization-token": accessToken ?? "" },
        }
      );
      setMessages((prev) => [
        ...prev,
        { role: "client", content: input },
        { role: "bot", content: res.data.response },
      ]);
      setInput("");
    } catch (err) {
      console.error("Message failed", err);
    }
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-4">
        <h1 className="text-xl font-semibold">Chat with CVATAR</h1>

        {isOwner && (
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-medium mb-2">Bot Settings</h2>
            <p>Language: {profile?.botPersona?.language}</p>
            <p>Style: {profile?.botPersona?.style}</p>
            <p>Description: {profile?.botPersona?.introPrompt}</p>
            {/* Add editing form later */}
          </div>
        )}

        <div className="bg-gray-100 p-4 rounded h-96 overflow-y-scroll space-y-2">
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
            placeholder="Type your message..."
          />
          <Button onClick={sendMessage}>Send</Button>
        </div>
      </div>
    </AppLayout>
  );
}
