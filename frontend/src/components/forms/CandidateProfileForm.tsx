import { useState } from "react";
import { CandidateProfileData } from "@/types";

interface Props {
  initialValues: CandidateProfileData;
  onSubmit: (data: FormData) => Promise<void>;
  disabled?: boolean;
}

export default function CandidateProfileForm({
  initialValues,
  onSubmit,
  disabled = false,
}: Props) {
  const [form, setForm] = useState<CandidateProfileData>(initialValues);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, avatar: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    for (const key in form) {
      if (key === "avatar" && form.avatar) {
        formData.append("avatar", form.avatar);
      } else {
        formData.append(key, (form as any)[key]);
      }
    }

    try {
      await onSubmit(formData);
    } catch {
      setError("Failed to save profile data.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {(
        [
          { name: "name", label: "Full Name" },
          { name: "firstName", label: "First Name" },
          { name: "lastName", label: "Last Name" },
          { name: "description", label: "Profile Description" },
          { name: "maritalStatus", label: "Marital Status" },
          { name: "education", label: "Education (comma-separated)" },
          {
            name: "spokenLanguages",
            label: "Spoken Languages (comma-separated)",
          },
          { name: "softSkills", label: "Soft Skills (comma-separated)" },
          { name: "yearsOfExperience", label: "Years of Experience" },
        ] as const
      ).map((field) => (
        <div key={field.name} className="flex flex-col">
          <label htmlFor={field.name} className="font-medium text-sm mb-1">
            {field.label}
          </label>
          <input
            id={field.name}
            name={field.name}
            type={field.name === "yearsOfExperience" ? "number" : "text"}
            value={form[field.name]}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            disabled={disabled}
          />
        </div>
      ))}

      <div className="flex flex-col">
        <label htmlFor="avatar" className="font-medium text-sm mb-1">
          Profile Picture
        </label>
        <input
          type="file"
          name="avatar"
          id="avatar"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
          className="w-full"
          disabled={disabled}
        />
      </div>

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
