import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getMySubProfile,
  updateAgent,
  updateSubProfile,
  createDocument,
  uploadDocument,
  deleteDocument,
} from "@/lib";
import { AgentData, CandidateProfileData } from "@/types";
import {
  AppLayout,
  CandidateProfileForm,
  AgentForm,
  DocumentManager,
} from "@/components";

const DEFAULT_SUB_PROFILE_FORM: CandidateProfileData = {
  name: "",
  firstName: "",
  lastName: "",
  description: "",
  maritalStatus: "",
  education: [],
  spokenLanguages: [],
  softSkills: [],
  yearsOfExperience: "0",
  avatar: null,
  avatarUrl: "",
  documents: [],
  profileType: "Candidate",
};

const DEFAULT_AGENT_FORM: AgentData = {
  name: "",
  language: "en",
  style: "formal",
  tone: "neutral",
  answerLength: "short",
  introPrompt: "",
  disclaimerText: "",
  customInstructions: "",
  profileType: "candidate",
};

export default function EditProfilePage() {
  const [activeTab, setActiveTab] = useState<"general" | "agent" | "documents">(
    "general"
  );
  const { subProfileId } = useParams<{ subProfileId: string }>();

  const [subProfileForm, setSubProfileForm] =
    useState<CandidateProfileData | null>(null);
  const [agentForm, setAgentForm] = useState<AgentData | null>(null);
  // const [savingSubProfile, setSavingSubProfile] = useState(false);
  const [savingAgent, setSavingAgent] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const subProfileData = await getMySubProfile(subProfileId!);
        setSubProfileForm({ ...DEFAULT_SUB_PROFILE_FORM, ...subProfileData });

        const agentData = subProfileData.agent || {};
        setAgentForm({
          ...DEFAULT_AGENT_FORM,
          ...agentData,
          profileType:
            subProfileData.profileType === "Candidate"
              ? "candidate"
              : "company",
        });
      } catch (err) {
        setError("Failed to load profile or unauthorized.");
      }
    }

    load();
  }, [subProfileId]);

  const handleAgentChange = (field: string, value: string) => {
    setAgentForm((prev) => (prev ? { ...prev, [field]: value } : prev));
    setSuccess("");
  };

  const handleSaveAgent = async () => {
    if (!agentForm) return;
    setSavingAgent(true);
    try {
      await updateAgent(subProfileId!, agentForm);
      setSuccess("Agent saved!");
      setError("");
    } catch {
      setError("Failed to save Agent.");
    } finally {
      setSavingAgent(false);
    }
  };

  const handleSaveSubProfile = async () => {
    if (!subProfileForm) return;
    try {
      await updateSubProfile(subProfileId!, subProfileForm);
      setSuccess("Profile saved!");
      setError("");
    } catch {
      setError("Failed to save Profile.");
    } finally {
      // setSavingSubProfile(false);
    }
  };

  const handleUploadDocument = async (file: File) => {
    try {
      const newDoc = await uploadDocument(file);
      setSubProfileForm((prev) =>
        prev
          ? { ...prev, documents: [...(prev.documents || []), newDoc] }
          : prev
      );
    } catch {
      setError("Failed to upload document.");
    }
  };

  const handleCreateDocument = async (title: string, content: string) => {
    try {
      const newDoc = await createDocument(title, content);
      setSubProfileForm((prev) =>
        prev
          ? { ...prev, documents: [...(prev.documents || []), newDoc] }
          : prev
      );
    } catch {
      setError("Failed to create document.");
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    try {
      await deleteDocument(docId);
      setSubProfileForm((prev) =>
        prev
          ? {
              ...prev,
              documents: prev.documents?.filter((d) => d.id !== docId),
            }
          : prev
      );
    } catch {
      setError("Failed to delete document.");
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Edit Profile</h1>

        {/* TABS */}
        <div className="flex gap-4 border-b mb-4">
          {["general", "agent", "documents"].map((tab) => (
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

        {/* GENERAL PROFILE FORM */}
        {activeTab === "general" &&
          subProfileForm?.profileType === "Candidate" && (
            <>
              {subProfileForm.avatarUrl && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">
                    Current Profile Picture:
                  </p>
                  <img
                    src={subProfileForm.avatarUrl}
                    alt="Avatar"
                    className="h-24 w-24 rounded-full object-cover border"
                  />
                </div>
              )}
              <CandidateProfileForm
                initialValues={{
                  name: subProfileForm.name,
                  firstName: subProfileForm.firstName,
                  lastName: subProfileForm.lastName,
                  description: subProfileForm.description,
                  maritalStatus: subProfileForm.maritalStatus,
                  education: subProfileForm.education,
                  spokenLanguages: subProfileForm.spokenLanguages,
                  yearsOfExperience:
                    subProfileForm.yearsOfExperience.toString(),
                  softSkills: subProfileForm.softSkills,
                  avatar: null,
                }}
                onSubmit={handleSaveSubProfile}
              />
            </>
          )}

        {/* AGENT CONFIGURATION */}
        {activeTab === "agent" && agentForm && (
          <AgentForm
            value={agentForm}
            onChange={handleAgentChange}
            onSubmit={handleSaveAgent}
            loading={savingAgent}
          />
        )}

        {/* DOCUMENT MANAGER */}
        {activeTab === "documents" && (
          <DocumentManager
            documents={subProfileForm?.documents || []}
            onUpload={handleUploadDocument}
            onCreate={handleCreateDocument}
            onDelete={handleDeleteDocument}
          />
        )}

        {/* FEEDBACK */}
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}
      </div>
    </AppLayout>
  );
}
