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

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (key === "avatar" && value instanceof File) {
          formData.append("avatar", value);
        } else if (Array.isArray(value)) {
          value.forEach((item) => formData.append(key, item));
        } else if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      await onSubmit(formData);
    } catch (err) {
      console.error(err);
      setError("Failed to save profile data.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {[
        { name: "name", label: "Full Name" },
        { name: "firstName", label: "First Name" },
        { name: "lastName", label: "Last Name" },
        { name: "maritalStatus", label: "Marital Status" },
        { name: "yearsOfExperience", label: "Years of Experience" },
        { name: "description", label: "Profile Description", multiline: true },
      ].map(({ name, label, multiline }) => (
        <div key={name}>
          <label className="block mb-1 font-medium">{label}</label>
          {multiline ? (
            <textarea
              name={name}
              value={(form as any)[name] || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              disabled={disabled}
              rows={3}
            />
          ) : (
            <input
              type="text"
              name={name}
              value={(form as any)[name] || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              disabled={disabled}
            />
          )}
        </div>
      ))}

      <div>
        <label className="block mb-1 font-medium">Avatar</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={disabled}
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={disabled}
      >
        Save Profile
      </button>
    </form>
  );
}
