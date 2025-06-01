import { useState } from "react";
import { createTokenForSubProfile } from "@/lib/api";
import { Button } from "@/components";
import { X } from "lucide-react";

interface Props {
  profileId: string;
  onClose: () => void;
  onCreated: (tokenData: any) => void;
}

const presetOptions = [
  { label: "1 Hour", value: 3600 },
  { label: "1 Day", value: 86400 },
  { label: "1 Week", value: 604800 },
  { label: "Custom", value: -1 },
];

export default function CreateTokenModal({
  profileId,
  onClose,
  onCreated,
}: Props) {
  const [name, setName] = useState("");
  const [preset, setPreset] = useState(604800);
  const [custom, setCustom] = useState<number>(3600);
  const [isOneTime, setIsOneTime] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const expiresIn = preset === -1 ? custom : preset;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      const tokenData = await createTokenForSubProfile(profileId, {
        name,
        expiresIn,
        isOneTime,
      });
      onCreated(tokenData);
      onClose();
    } catch (err: any) {
      setError("Token creation failed. Please try again.");
      console.error("Token creation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 shadow max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold mb-4">Create Access Token</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Token Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <select
            value={preset}
            onChange={(e) => setPreset(parseInt(e.target.value))}
            className="w-full p-2 border rounded"
          >
            {presetOptions.map((opt) => (
              <option key={opt.label} value={opt.value}>
                {opt.label === "Custom"
                  ? "Custom Duration"
                  : `Expires in ${opt.label}`}
              </option>
            ))}
          </select>
          {preset === -1 && (
            <input
              type="number"
              placeholder="Enter duration in seconds"
              value={custom}
              onChange={(e) => setCustom(parseInt(e.target.value))}
              className="w-full p-2 border rounded"
              min={1}
              required
            />
          )}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isOneTime}
              onChange={() => setIsOneTime(!isOneTime)}
            />
            One-time use
          </label>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Token"}
          </Button>
        </form>
      </div>
    </div>
  );
}
