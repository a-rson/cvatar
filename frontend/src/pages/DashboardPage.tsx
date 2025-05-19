import { useAuth } from "@/hooks";
import { useEffect, useState } from "react";
import { AppLayout, Button } from "@/components";
import { useNavigate } from "react-router-dom";
import {
  getMyProfiles,
  createTokenForProfile,
  getMyTokens,
  deleteToken,
} from "@/lib";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth({ verifyWithMe: true });
  const [tokenInfo, setTokenInfo] = useState<any | null>(null);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [tokens, setTokens] = useState<any[]>([]);

  useEffect(() => {
    getMyProfiles().then(setProfiles).catch(console.error);
    getMyTokens().then(setTokens).catch(console.error);
  }, [tokenInfo]);

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).catch(console.error);
    } else {
      const input = document.createElement("input");
      input.value = text;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen p-10 bg-gray-100">
        <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

        <div className="mb-8 bg-white shadow p-6 rounded">
          <h2 className="text-xl font-medium mb-2">User Info</h2>
          <p>Email: {user?.email}</p>
          <p>Type: {user?.type}</p>
        </div>

        <div className="mb-8 flex gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/create-candidate")}
          >
            Create Candidate Profile
          </Button>
          <Button variant="outline" onClick={() => navigate("/create-company")}>
            Create Company Profile
          </Button>
        </div>

        <div className="mb-8 bg-white shadow p-6 rounded">
          <h2 className="text-xl font-medium mb-4">Your Profiles</h2>
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="py-2">ID</th>
                <th>Profile Name</th>
                <th>Type</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="py-2">{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.type}</td>
                  <td>
                    {new Date(p.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="flex gap-2 py-2">
                    <Button
                      size="sm"
                      onClick={() => navigate(`/profile/${p.id}`)}
                    >
                      Visit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={async () => {
                        const name = prompt("Enter a name for this token:");
                        if (!name) return;
                        const data = await createTokenForProfile(p.id, {
                          name,
                        });
                        setTokenInfo(data);
                      }}
                    >
                      Create Token
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/edit-profile/${p.id}`)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => console.log(p.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white shadow p-6 rounded">
          <h2 className="text-xl font-medium mb-4">Your Tokens</h2>
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="py-2">ID</th>
                <th>Token Name</th>
                <th>Type</th>
                <th>Used</th>
                <th>Expires At</th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((t) => (
                <tr key={t.id} className="border-t">
                  <td className="py-2">{t.token}</td>
                  <td>{t.name}</td>
                  <td>{t.type}</td>
                  <td>{t.used ? "Yes" : "No"}</td>
                  <td>
                    {t.expiresAt
                      ? new Date(t.expiresAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "—"}
                  </td>
                  <td className="flex gap-2">
                    <Button size="sm" onClick={() => copyToClipboard(t.token)}>
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={async () => {
                        await deleteToken(t.id);
                        getMyTokens().then(setTokens);
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {tokenInfo && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded shadow-lg max-w-md w-full relative">
                <button
                  onClick={() => setTokenInfo(null)}
                  className="absolute top-2 right-3 text-gray-500 hover:text-black"
                >
                  ✕
                </button>
                <h2 className="text-xl font-semibold mb-4">Token Created</h2>
                <p className="mb-2">
                  <strong>Token:</strong> {tokenInfo.token}
                </p>
                <p className="mb-4">
                  <strong>Link:</strong>{" "}
                  <a
                    href={tokenInfo.qrUrl}
                    className="text-blue-600 underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {tokenInfo.qrUrl}
                  </a>
                </p>
                {tokenInfo.qrImage && (
                  <img
                    src={tokenInfo.qrImage}
                    alt="QR Code"
                    className="mx-auto max-w-[200px]"
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
