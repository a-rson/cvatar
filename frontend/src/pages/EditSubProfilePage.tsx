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
import {
  AppLayout,
  CandidateProfileForm,
  CompanyProfileForm,
  AgentForm,
  DocumentManager,
} from "@/components";
import { AgentData, CandidateProfileData, CompanyProfileData } from "@/types";

const DEFAULT_CANDIDATE_FORM: CandidateProfileData = {
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

const DEFAULT_COMPANY_FORM: CompanyProfileData = {
  name: "",
  companyName: "",
  description: "",
  logoUrl: "",
  services: "",
  languages: "",
  frameworks: "",
  tools: "",
  teamSize: "0",
  contactEmail: "",
  contactPhone: "",
  documents: [],
  profileType: "Company",
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

export default function EditSubProfilePage() {
  const { subProfileId } = useParams<{ subProfileId: string }>();
  const [activeTab, setActiveTab] = useState<"general" | "agent" | "documents">(
    "general"
  );

  const [subProfileForm, setSubProfileForm] = useState<any>(null);
  const [agentForm, setAgentForm] = useState<AgentData | null>(null);
  const [savingAgent, setSavingAgent] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const subProfile = await getMySubProfile(subProfileId!);

        setSubProfileForm(
          subProfile.profileType === "Candidate"
            ? { ...DEFAULT_CANDIDATE_FORM, ...subProfile }
            : { ...DEFAULT_COMPANY_FORM, ...subProfile }
        );

        const agentData = subProfile.agent || {};
        setAgentForm({
          ...DEFAULT_AGENT_FORM,
          ...agentData,
          profileType: subProfile.profileType.toLowerCase(),
        });
      } catch {
        setError("Failed to load profile or unauthorized.");
      }
    }

    load();
  }, [subProfileId]);

  const handleAgentChange = (field: string, value: string) => {
    if (agentForm) setAgentForm({ ...agentForm, [field]: value });
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
    }
  };

  const handleUploadDocument = async (file: File) => {
    try {
      const newDoc = await uploadDocument(file);
      setSubProfileForm((prev: any) =>
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
      setSubProfileForm((prev: any) =>
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
      setSubProfileForm((prev: any) =>
        prev
          ? {
              ...prev,
              documents: prev.documents?.filter((d: any) => d.id !== docId),
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

        {/* GENERAL TAB */}
        {activeTab === "general" &&
          subProfileForm?.profileType === "Candidate" && (
            <CandidateProfileForm
              initialValues={subProfileForm}
              onSubmit={handleSaveSubProfile}
            />
          )}

        {activeTab === "general" &&
          subProfileForm?.profileType === "Company" && (
            <>
              {subProfileForm.logoUrl && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">
                    Current Logo Preview:
                  </p>
                  <img
                    src={subProfileForm.logoUrl}
                    alt="Logo"
                    className="h-24 w-24 object-contain border bg-white p-1"
                  />
                </div>
              )}
              <CompanyProfileForm
                initialValues={{
                  name: subProfileForm.name,
                  companyName: subProfileForm.companyName,
                  description: subProfileForm.description || "",
                  logoUrl: subProfileForm.logoUrl || "",
                  services: subProfileForm.services?.join(", ") || "",
                  languages:
                    subProfileForm.techStack?.languages?.join(", ") || "",
                  frameworks:
                    subProfileForm.techStack?.frameworks?.join(", ") || "",
                  tools: subProfileForm.techStack?.tools?.join(", ") || "",
                  teamSize: subProfileForm.teamSize?.toString() || "0",
                  contactEmail: subProfileForm.contactEmail,
                  contactPhone: subProfileForm.contactPhone || "",
                }}
                onSubmit={handleSaveSubProfile}
              />
            </>
          )}

        {/* AGENT TAB */}
        {activeTab === "agent" && agentForm && (
          <AgentForm
            value={agentForm}
            onChange={handleAgentChange}
            onSubmit={handleSaveAgent}
            loading={savingAgent}
          />
        )}

        {/* DOCUMENT TAB */}
        {activeTab === "documents" && (
          <DocumentManager
            documents={subProfileForm?.documents || []}
            onUpload={handleUploadDocument}
            onCreate={handleCreateDocument}
            onDelete={handleDeleteDocument}
          />
        )}

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}
      </div>
    </AppLayout>
  );
}
