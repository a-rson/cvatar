import { useState } from "react";

interface Props {
  initialValues: any;
  onSubmit: (data: any) => Promise<void>;
  disabled?: boolean;
}

export default function CandidateProfileForm({
  initialValues,
  onSubmit,
  disabled = false,
}: Props) {
  console.log("initialValues: ", initialValues);
  const [form, setForm] = useState(initialValues);
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
      await onSubmit({
        ...form,
        education: form.education.split(","),
        spokenLanguages: form.spokenLanguages.split(","),
        softSkills: form.softSkills.split(","),
        yearsOfExperience: parseInt(form.yearsOfExperience),
      });
    } catch (err) {
      setError("Failed to save profile data.");
    }
  };

  console.log("FORM: ", form);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {[
        "name",
        "firstName",
        "lastName",
        "description",
        "maritalStatus",
        "education",
        "spokenLanguages",
        "softSkills",
        "avatarUrl",
      ].map((field) => (
        <input
          key={field}
          name={field}
          placeholder={field
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (s) => s.toUpperCase())}
          value={form[field] || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          disabled={disabled}
        />
      ))}
      <input
        name="yearsOfExperience"
        type="number"
        placeholder="Years of Experience"
        value={form.yearsOfExperience}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        disabled={disabled}
      />
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
