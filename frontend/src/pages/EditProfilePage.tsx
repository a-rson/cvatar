import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMyProfile, updateBotPersona } from "@/lib/api";
import { AppLayout, Button } from "@/components";

export default function EditProfilePage() {
  const { profileId } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [botForm, setBotForm] = useState({ language: "en", style: "formal", introPrompt: "" });
  const [profileForm, setProfileForm] = useState({ firstName: "", lastName: "", description: "" });
  const [docTitle, setDocTitle] = useState("");
  const [docContent, setDocContent] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const profile = await getMyProfile(profileId!);
        setProfile(profile);

        const bp = profile.botPersona || {};
        setBotForm({
          language: bp.language || "en",
          style: bp.style || "formal",
          introPrompt: bp.introPrompt || "",
        });

        const c = profile.candidate;
        if (c) {
          setProfileForm({
            firstName: c.firstName || "",
            lastName: c.lastName || "",
            description: c.description || "",
          });
        }
      } catch (err) {
        setError("Failed to load profile or unauthorized.");
      }
    }

    load();
  }, [profileId]);

  const handleBotChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setBotForm({ ...botForm, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleSavePersona = async () => {
    try {
      await updateBotPersona(profileId!, botForm);
      setSaved(true);
      setError("");
    } catch (err) {
      setError("Failed to save bot persona.");
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Edit Profile</h1>

        {/* PROFILE INFO */}
        <section className="bg-white rounded shadow p-4 space-y-4">
          <h2 className="text-lg font-medium">🧍 Profile Information</h2>
          <input
            name="firstName"
            value={profileForm.firstName}
            onChange={handleProfileChange}
            placeholder="First Name"
            className="w-full p-2 border rounded"
          />
          <input
            name="lastName"
            value={profileForm.lastName}
            onChange={handleProfileChange}
            placeholder="Last Name"
            className="w-full p-2 border rounded"
          />
          <textarea
            name="description"
            value={profileForm.description}
            onChange={handleProfileChange}
            placeholder="Profile Description"
            className="w-full p-2 border rounded"
            rows={3}
          />
          <Button disabled>Save Profile Info (TODO)</Button>
        </section>

        {/* BOT SETTINGS */}
        <section className="bg-white rounded shadow p-4 space-y-4">
          <h2 className="text-lg font-medium">🤖 Bot Persona</h2>
          <select
            name="language"
            value={botForm.language}
            onChange={handleBotChange}
            className="w-full p-2 border rounded"
          >
            <option value="en">English</option>
            <option value="pl">Polish</option>
          </select>
          <select
            name="style"
            value={botForm.style}
            onChange={handleBotChange}
            className="w-full p-2 border rounded"
          >
            <option value="formal">Formal</option>
            <option value="casual">Casual</option>
            <option value="concise">Concise</option>
            <option value="enthusiastic">Enthusiastic</option>
          </select>
          <textarea
            name="introPrompt"
            value={botForm.introPrompt}
            onChange={handleBotChange}
            placeholder="Custom instructions for the bot..."
            className="w-full p-2 border rounded"
            rows={4}
          />
          <Button onClick={handleSavePersona}>Save Bot Persona</Button>
        </section>

        {/* DOCUMENTS */}
        <section className="bg-white rounded shadow p-4 space-y-4">
          <h2 className="text-lg font-medium">📄 Documents</h2>
          <form
            className="space-y-2"
            onSubmit={async (e) => {
              e.preventDefault();
              console.log("TODO: Upload doc", docTitle, docContent);
            }}
          >
            <input
              type="text"
              placeholder="Document Title"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <textarea
              placeholder="Document Content"
              value={docContent}
              onChange={(e) => setDocContent(e.target.value)}
              className="w-full p-2 border rounded"
              rows={4}
            />
            <Button type="submit">Upload Document (TODO)</Button>
          </form>

          <ul className="divide-y">
            {profile?.candidate?.documents?.map((doc: any) => (
              <li key={doc.id} className="py-2 flex justify-between items-center">
                <span>{doc.title}</span>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => console.log("TODO: Remove doc", doc.id)}
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        </section>

        {error && <p className="text-red-500">{error}</p>}
        {saved && <p className="text-green-600">Bot persona saved!</p>}
      </div>
    </AppLayout>
  );
}
