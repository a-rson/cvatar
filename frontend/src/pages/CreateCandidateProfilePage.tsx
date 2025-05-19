import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout, Button } from "@/components";
import { createTypedProfile } from "@/lib";

export default function CreateCandidateProfilePage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    description: "",
    maritalStatus: "",
    education: "",
    spokenLanguages: "",
    yearsOfExperience: "",
    softSkills: "",
    avatarUrl: "",
  });

  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await createTypedProfile("candidate", {
        ...form,
        education: form.education.split(","),
        spokenLanguages: form.spokenLanguages.split(","),
        softSkills: form.softSkills.split(","),
        yearsOfExperience: parseInt(form.yearsOfExperience),
      });
      await navigate("/dashboard");
    } catch (err) {
      setError("Failed to create candidate profile.");
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-xl">
          <h1 className="text-2xl font-semibold mb-6 text-center">
            Create Candidate Profile
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
            <input
              name="firstName"
              placeholder="First Name"
              className="w-full p-2 border rounded"
              onChange={handleChange}
              required
            />
            <input
              name="lastName"
              placeholder="Last Name"
              className="w-full p-2 border rounded"
              onChange={handleChange}
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              className="w-full p-2 border rounded"
              onChange={handleChange}
            />
            <input
              name="maritalStatus"
              placeholder="Marital Status"
              className="w-full p-2 border rounded"
              onChange={handleChange}
            />
            <input
              name="education"
              placeholder="Education (comma-separated)"
              className="w-full p-2 border rounded"
              onChange={handleChange}
            />
            <input
              name="spokenLanguages"
              placeholder="Languages (comma-separated)"
              className="w-full p-2 border rounded"
              onChange={handleChange}
            />
            <input
              name="yearsOfExperience"
              type="number"
              placeholder="Years of Experience"
              className="w-full p-2 border rounded"
              onChange={handleChange}
            />
            <input
              name="softSkills"
              placeholder="Soft Skills (comma-separated)"
              className="w-full p-2 border rounded"
              onChange={handleChange}
            />
            <input
              name="avatarUrl"
              placeholder="Avatar URL"
              className="w-full p-2 border rounded"
              onChange={handleChange}
            />
            {error && <p className="text-red-500">{error}</p>}
            <Button type="submit">Create Profile</Button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
