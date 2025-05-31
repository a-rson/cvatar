import { useAuth } from "@/hooks";
import { useEffect, useState } from "react";
import { AppLayout, Button, CreateTokenModal } from "@/components";
import { useNavigate } from "react-router-dom";
import {
  SlidersHorizontal,
  Trash2,
  Copy,
  MessageCircle,
  Link,
} from "lucide-react";
import {
  getMySubProfiles,
  getMyTokens,
  deleteToken,
  deleteSubProfile,
} from "@/lib";
import { copyToClipboard } from "@/utils";
import { SubProfile } from "@/types";
import type { Token } from "@/types/auth";

interface TokenWithQR extends Token {
  qrUrl?: string;
  qrImage?: string;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth({ verifyWithMe: true });

  const [showModalFor, setShowModalFor] = useState<string | null>(null);
  const [tokenInfo, setTokenInfo] = useState<TokenWithQR | null>(null);
  const [subProfiles, setSubProfiles] = useState<SubProfile[]>([]);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    Promise.all([getMySubProfiles(), getMyTokens()])
      .then(([profiles, tokens]) => {
        setSubProfiles(profiles);
        setTokens(tokens);
      })
      .catch((err) => {
        console.error(err);
        setLoadError("Failed to load dashboard data.");
      });
  }, [tokenInfo]);

  return (
    <AppLayout>
      <div className="min-h-screen p-10 bg-gray-100">
        <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

        {loadError && (
          <p className="text-sm text-red-600 mb-4">{loadError}</p>
        )}

        {/* User Info */}
        <div className="mb-8 bg-white shadow p-6 rounded">
          <h2 className="text-xl font-medium mb-2">User Info</h2>
          <p>Email: {user?.email}</p>
          <p>Account Type: {user?.type}</p>
        </div>

        {/* Create Profile Buttons */}
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

        {/* SubProfiles Table */}
        <div className="mb-8 bg-white shadow p-6 rounded">
          <h2 className="text-xl font-medium mb-4">Your Profiles</h2>

          {subProfiles.length === 0 ? (
            <p className="text-sm text-gray-500">No profiles found.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr>
                  <th className="py-2">ID</th>
                  <th>Profile Name</th>
                  <th>Type</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subProfiles.map((subProfile) => (
                  <tr key={subProfile.id} className="border-t">
                    <td className="py-2">{subProfile.id}</td>
                    <td>{subProfile.name}</td>
                    <td>{subProfile.profileType}</td>
                    <td>
                      {new Date(subProfile.createdAt).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </td>
                    <td className="flex gap-2 py-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          navigate(`/edit-sub-profile/${subProfile.id}`)
                        }
                      >
                        <SlidersHorizontal className="w-4 h-4" />
                      </Button>

                      <Button
                        size="icon"
                        variant="outline"
                        disabled={!subProfile.hasAgent}
                        onClick={() => navigate(`/chat/${subProfile.id}`)}
                        title={
                          subProfile.hasAgent
                            ? "Chat with your Agent"
                            : "Add an Agent to enable chat"
                        }
                      >
                        <MessageCircle className="w-4 h-4" />
                      </Button>

                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => setShowModalFor(subProfile.id)}
                      >
                        <Link className="w-4 h-4" />
                      </Button>

                      <Button
                        size="icon"
                        variant="outline"
                        onClick={async () => {
                          await deleteSubProfile(subProfile.id);
                          getMySubProfiles().then(setSubProfiles);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Tokens Table */}
        <div className="bg-white shadow p-6 rounded">
          <h2 className="text-xl font-medium mb-4">Your Profile Tokens</h2>

          {tokens.length === 0 ? (
            <p className="text-sm text-gray-500">No tokens generated yet.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr>
                  <th className="py-2">ID</th>
                  <th>Token Name</th>
                  <th>Type</th>
                  <th>Used</th>
                  <th>Expires At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tokens.map((t) => (
                  <tr key={t.id} className="border-t">
                    <td className="py-2">{t.id}</td>
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
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => copyToClipboard(t.token)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={async () => {
                          await deleteToken(t.id);
                          getMyTokens().then(setTokens);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Token Created Modal */}
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

          {/* Token Creation Modal */}
          {showModalFor && (
            <CreateTokenModal
              profileId={showModalFor}
              onClose={() => setShowModalFor(null)}
              onCreated={(data) => {
                setTokenInfo(data);
              }}
            />
          )}
        </div>
      </div>
    </AppLayout>
  );
}
