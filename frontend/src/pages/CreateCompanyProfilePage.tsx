import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout, Button } from "@/components";
import { createTypedSubProfile } from "@/lib";

export default function CreateCompanyProfilePage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    companyName: "",
    description: "",
    logoUrl: "",
    services: "",
    languages: "",
    frameworks: "",
    tools: "",
    teamSize: "",
    contactEmail: "",
    contactPhone: "",
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
      await createTypedSubProfile("company", {
        ...form,
        services: form.services.split(","),
        techStack: {
          languages: form.languages
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          frameworks: form.frameworks
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          tools: form.tools
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        },
        teamSize: parseInt(form.teamSize),
      });
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to create company profile.");
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-xl">
          <h1 className="text-2xl font-semibold mb-6 text-center">
            Create Company Profile
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
            <input
              name="name"
              placeholder="Profile Name"
              className="w-full p-2 border rounded"
              onChange={handleChange}
              required
            />
            <input
              name="companyName"
              placeholder="Company Name"
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
              name="logoUrl"
              placeholder="Logo URL"
              className="w-full p-2 border rounded"
              onChange={handleChange}
            />
            <input
              name="services"
              placeholder="Services (comma-separated)"
              className="w-full p-2 border rounded"
              onChange={handleChange}
            />
            <input
              name="languages"
              placeholder="Languages (comma-separated)"
              className="w-full p-2 border rounded"
              onChange={handleChange}
            />
            <input
              name="frameworks"
              placeholder="Frameworks (comma-separated)"
              className="w-full p-2 border rounded"
              onChange={handleChange}
            />
            <input
              name="tools"
              placeholder="Tools (comma-separated)"
              className="w-full p-2 border rounded"
              onChange={handleChange}
            />
            <input
              name="teamSize"
              type="number"
              placeholder="Team Size"
              className="w-full p-2 border rounded"
              onChange={handleChange}
            />
            <input
              name="contactEmail"
              type="email"
              placeholder="Contact Email"
              className="w-full p-2 border rounded"
              onChange={handleChange}
            />
            <input
              name="contactPhone"
              placeholder="Contact Phone"
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
