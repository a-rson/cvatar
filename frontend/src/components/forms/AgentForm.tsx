interface Props {
  value: {
    name: string;
    language: string;
    style: string;
    tone: string;
    answerLength: string;
    introPrompt: string;
    disclaimerText: string;
    customInstructions: string;
    profileType: string;
  };
  onChange: (field: string, value: string) => void;
  onSubmit: () => void;
  loading?: boolean;
}

export default function AgentForm({
  value,
  onChange,
  onSubmit,
  loading,
}: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Agent Name</label>
        <input
          type="text"
          name="name"
          value={value.name}
          onChange={(e) => onChange("name", e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Language</label>
        <select
          name="language"
          value={value.language}
          onChange={(e) => onChange("language", e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="en">English</option>
          <option value="pl">Polish</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Style</label>
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
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Tone</label>
        <select
          name="tone"
          value={value.tone}
          onChange={(e) => onChange("tone", e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="neutral">Neutral</option>
          <option value="friendly">Friendly</option>
          <option value="professional">Professional</option>
          <option value="humorous">Humorous</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Answer Length</label>
        <select
          name="answerLength"
          value={value.answerLength}
          onChange={(e) => onChange("answerLength", e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="short">Short</option>
          <option value="medium">Medium</option>
          <option value="long">Long</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Intro Prompt</label>
        <textarea
          name="introPrompt"
          value={value.introPrompt}
          onChange={(e) => onChange("introPrompt", e.target.value)}
          placeholder="Greeting or opening message"
          className="w-full p-2 border rounded"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Disclaimer Message (optional)
        </label>
        <textarea
          name="disclaimerText"
          value={value.disclaimerText}
          onChange={(e) => onChange("disclaimerText", e.target.value)}
          placeholder="E.g., 'This is a simulated assistant.'"
          className="w-full p-2 border rounded"
          rows={2}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Custom Instructions (advanced)
        </label>
        <textarea
          name="customInstructions"
          value={value.customInstructions}
          onChange={(e) => onChange("customInstructions", e.target.value)}
          placeholder="Additional raw prompt for advanced control"
          className="w-full p-2 border rounded"
          rows={3}
        />
      </div>

      <button
        onClick={onSubmit}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
