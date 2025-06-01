import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout, Button } from "@/components";
import { getMySubProfile, sendChatMessage } from "@/lib/api";
import type {
  CompanyProfileData,
  CandidateProfileData,
  SubProfile,
} from "@/types/subProfile";

interface ChatMessage {
  role: "client" | "agent";
  content: string;
}

export default function ChatPage() {
  const { subProfileId } = useParams<{ subProfileId: string }>();
  const [subProfile, setSubProfile] = useState<SubProfile | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const subProfileData = await getMySubProfile(subProfileId!);
        setSubProfile(subProfileData);
        setIsOwner(true);
      } catch (err: any) {
        setError("Not authorized or sub-profile not found.");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [subProfileId]);

  async function handleSend() {
    if (!input.trim() || !subProfileId || !subProfile) return;
    const profileType = subProfile.profileType?.toLowerCase();
    if (!profileType) {
      setError("Invalid profile type.");
      return;
    }

    try {
      const response = await sendChatMessage({
        subProfileId,
        message: input,
        profileType,
      });

      setMessages((prev) => [
        ...prev,
        { role: "client", content: input },
        { role: "agent", content: response },
      ]);
      setInput("");
      setError("");
    } catch {
      setError("Failed to send message. Try again.");
    }
  }

  function isCandidate(
    profile: SubProfile | null
  ): profile is CandidateProfileData {
    return profile?.profileType === "Candidate";
  }

  function isCompany(
    profile: SubProfile | null
  ): profile is CompanyProfileData {
    return profile?.profileType === "Company";
  }

  if (loading)
    return (
      <AppLayout>
        <p>Loading profile...</p>
      </AppLayout>
    );
  if (error && !subProfile)
    return (
      <AppLayout>
        <p>{error}</p>
      </AppLayout>
    );

  return (
    <AppLayout>
      <div className="flex flex-col md:flex-row gap-6 h-full">
        {/* LEFT: Sidebar with profile info */}
        <div className="md:w-1/3 w-full space-y-4">
          <div className="bg-white rounded shadow p-4 text-center">
            {isCandidate(subProfile) && (
              <img
                src={subProfile.avatarUrl || "/default-avatar.png"}
                alt="Avatar"
                className="w-32 h-32 rounded-full object-cover mx-auto mb-2"
              />
            )}

            <h2 className="text-lg font-semibold">
              {isCandidate(subProfile) &&
                `${subProfile.firstName} ${subProfile.lastName}`}
              {isCompany(subProfile) && subProfile.name}
            </h2>

            <p className="text-sm text-gray-600">{subProfile?.description}</p>
          </div>

          {isOwner ? (
            <div className="bg-white rounded shadow p-4 space-y-2">
              {
                <Button
                  onClick={() =>
                    navigate(`/edit-sub-profile/${(subProfile as any).id}`)
                  }
                  variant="outline"
                >
                  Edit Profile
                </Button>
              }
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

          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        </div>
      </div>
    </AppLayout>
  );
}
