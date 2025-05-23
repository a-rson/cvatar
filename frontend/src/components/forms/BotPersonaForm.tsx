interface Props {
  value: {
    language: string;
    style: string;
    introPrompt: string;
  };
  onChange: (field: string, value: string) => void;
  onSubmit: () => void;
  loading?: boolean;
}

export default function BotPersonaForm({
  value,
  onChange,
  onSubmit,
  loading,
}: Props) {
  return (
    <div className="space-y-4">
      <select
        name="language"
        value={value.language}
        onChange={(e) => onChange("language", e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="en">English</option>
        <option value="pl">Polish</option>
      </select>
      <select
        name="style"
        value={value.style}
        onChange={(e) => onChange("style", e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="formal">Formal</option>
        <option value="casual">Casual</option>
        <option value="concise">Concise</option>
        <option value="enthusiastic">Enthusiastic</option>
      </select>
      <textarea
        name="introPrompt"
        value={value.introPrompt}
        onChange={(e) => onChange("introPrompt", e.target.value)}
        placeholder="Custom bot instructions..."
        className="w-full p-2 border rounded"
        rows={4}
      />
      <button
        onClick={onSubmit}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Saving..." : "Save Bot Persona"}
      </button>
    </div>
  );
}
