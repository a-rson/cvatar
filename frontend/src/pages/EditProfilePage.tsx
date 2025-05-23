import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMyProfile, updateBotPersona } from "@/lib/api";
import {
  AppLayout,
  CandidateProfileForm,
  BotPersonaForm,
  DocumentManager,
} from "@/components";

export default function EditProfilePage() {
  const { profileId } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"general" | "bot" | "documents">(
    "general"
  );
  const [botForm, setBotForm] = useState({
    language: "en",
    style: "formal",
    introPrompt: "",
  });
  const [savingPersona, setSavingPersona] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const profileData = await getMyProfile(profileId!);
        setProfile(profileData);

        const bp = profileData.botPersona || {};
        setBotForm({
          language: bp.language || "en",
          style: bp.style || "formal",
          introPrompt: bp.introPrompt || "",
        });
      } catch (err) {
        setError("Failed to load profile or unauthorized.");
      }
    }

    load();
  }, [profileId]);

  const handleBotChange = (field: string, value: string) => {
    setBotForm((prev) => ({ ...prev, [field]: value }));
    setSuccess("");
  };

  const handleSavePersona = async () => {
    setSavingPersona(true);
    try {
      await updateBotPersona(profileId!, botForm);
      setSuccess("Bot persona saved!");
      setError("");
    } catch {
      setError("Failed to save bot persona.");
    } finally {
      setSavingPersona(false);
    }
  };

  const handleProfileSubmit = async (data: any) => {
    console.log("TODO: Send updated profile data", data);
    setSuccess("Profile info saved! (Mocked)");
  };

  const handleUpload = (file: File) => {
    console.log("TODO: Upload file", file.name);
  };

  const handleCreateDocument = (title: string, content: string) => {
    console.log("TODO: Create internal document", { title, content });
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Edit Profile</h1>

        {/* TABS */}
        <div className="flex gap-4 border-b mb-4">
          {["general", "bot", "documents"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-2 capitalize ${
                activeTab === tab
                  ? "border-b-2 border-blue-600 font-medium"
                  : "text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* PROFILE FORM */}
        {activeTab === "general" && profile?.candidate && (
          <CandidateProfileForm
            initialValues={{
              name: profile.candidate.name || "",
              firstName: profile.candidate.firstName,
              lastName: profile.candidate.lastName,
              description: profile.candidate.description || "",
              maritalStatus: profile.candidate.maritalStatus || "",
              education: (profile.candidate.education || []).join(","),
              spokenLanguages: (profile.candidate.spokenLanguages || []).join(
                ","
              ),
              yearsOfExperience:
                profile.candidate.yearsOfExperience?.toString() || "0",
              softSkills: (profile.candidate.softSkills || []).join(","),
              avatarUrl: profile.candidate.avatarUrl || "",
            }}
            onSubmit={handleProfileSubmit}
          />
        )}

        {/* BOT PERSONA FORM */}
        {activeTab === "bot" && (
          <BotPersonaForm
            value={botForm}
            onChange={handleBotChange}
            onSubmit={handleSavePersona}
            loading={savingPersona}
          />
        )}

        {/* DOCUMENTS */}
        {activeTab === "documents" && (
          <DocumentManager
            documents={profile?.candidate?.documents || []}
            onUpload={handleUpload}
            onCreate={handleCreateDocument}
          />
        )}

        {/* MESSAGES */}
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}
      </div>
    </AppLayout>
  );
}
