import { useState } from "react";

interface CompanyProfileData {
  name: string;
  companyName: string;
  description: string;
  logoUrl: string;
  services: string;
  languages: string;
  frameworks: string;
  tools: string;
  teamSize: string;
  contactEmail: string;
  contactPhone: string;
}

interface Props {
  initialValues: CompanyProfileData;
  onSubmit: (data: CompanyProfileData) => Promise<void>;
  disabled?: boolean;
}

export default function CompanyProfileForm({
  initialValues,
  onSubmit,
  disabled = false,
}: Props) {
  const [form, setForm] = useState(initialValues);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await onSubmit(form);
    } catch {
      setError("Failed to save company profile.");
    }
  };

  const fields: {
    name: keyof CompanyProfileData;
    label: string;
    type?: string;
    textarea?: boolean;
  }[] = [
    { name: "name", label: "Profile Name", type: "text" },
    { name: "companyName", label: "Company Name", type: "text" },
    { name: "description", label: "Description", textarea: true },
    { name: "logoUrl", label: "Logo URL", type: "text" },
    { name: "services", label: "Services (comma-separated)", type: "text" },
    { name: "languages", label: "Languages (comma-separated)", type: "text" },
    { name: "frameworks", label: "Frameworks (comma-separated)", type: "text" },
    { name: "tools", label: "Tools (comma-separated)", type: "text" },
    { name: "teamSize", label: "Team Size", type: "number" },
    { name: "contactEmail", label: "Contact Email", type: "email" },
    { name: "contactPhone", label: "Contact Phone", type: "text" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name} className="flex flex-col">
          <label htmlFor={field.name} className="font-medium text-sm mb-1">
            {field.label}
          </label>
          {field.textarea ? (
            <textarea
              id={field.name}
              name={field.name}
              value={form[field.name]}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              disabled={disabled}
              rows={3}
            />
          ) : (
            <input
              id={field.name}
              name={field.name}
              type={field.type || "text"}
              value={form[field.name]}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              disabled={disabled}
            />
          )}
        </div>
      ))}

      {error && <p className="text-red-500">{error}</p>}

      {!disabled && (
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          type="submit"
        >
          Save Profile
        </button>
      )}
    </form>
  );
}
