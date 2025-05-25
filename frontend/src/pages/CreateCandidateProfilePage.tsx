import { useNavigate } from "react-router-dom";
import { AppLayout, CandidateProfileForm } from "@/components";
import { createTypedSubProfile } from "@/lib";

export default function CreateCandidateProfilePage() {
  const navigate = useNavigate();

  const handleCreate = async (data: any) => {
    await createTypedSubProfile("candidate", data);
    navigate("/dashboard");
  };

  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-xl">
          <h1 className="text-2xl font-semibold mb-6 text-center">
            Create Candidate Profile
          </h1>
          <CandidateProfileForm
            initialValues={{
              name: "",
              firstName: "",
              lastName: "",
              description: "",
              maritalStatus: "",
              education: [],
              spokenLanguages: [],
              yearsOfExperience: "0",
              softSkills: [],
              avatar: null,
            }}
            onSubmit={handleCreate}
          />
        </div>
      </div>
    </AppLayout>
  );
}
