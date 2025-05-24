import { useState } from "react";
import { Button } from "@/components";

interface DocumentManagerProps {
  documents: any[];
  onUpload?: (file: File) => void;
  onCreate?: (title: string, content: string) => void;
}

export default function DocumentManager({
  documents = [],
  onUpload,
  onCreate,
}: DocumentManagerProps) {
  const [mode, setMode] = useState<"upload" | "create">("create");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      onUpload?.(e.target.files[0]);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate?.(title, content);
    setTitle("");
    setContent("");
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          variant={mode === "create" ? "default" : "outline"}
          onClick={() => setMode("create")}
        >
          Create
        </Button>
        <Button
          variant={mode === "upload" ? "default" : "outline"}
          onClick={() => setMode("upload")}
        >
          Upload
        </Button>
      </div>

      {mode === "create" ? (
        <form onSubmit={handleCreate} className="space-y-2">
          <input
            type="text"
            placeholder="Document Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <textarea
            placeholder="Document Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded"
            rows={4}
          />
          <Button type="submit">Save Document</Button>
        </form>
      ) : (
        <input type="file" accept=".pdf,.txt" onChange={handleFileUpload} />
      )}

      <ul className="divide-y">
        {documents.map((doc) => (
          <li key={doc.id} className="py-2 flex justify-between items-center">
            <span>{doc.title}</span>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => console.log("TODO: remove doc", doc.id)}
            >
              Remove
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
