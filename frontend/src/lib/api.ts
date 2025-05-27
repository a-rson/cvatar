import { axios } from "./axios";
import { AuthCredentials, AuthResponse, AgentData } from "@/types";

export async function login(data: AuthCredentials): Promise<string> {
  const res = await axios.post<AuthResponse>("/auth/login", data);
  const token = res.data.token;
  localStorage.setItem("token", token);
  return token;
}

export async function register(data: AuthCredentials): Promise<string> {
  const res = await axios.post<AuthResponse>("/auth/register", {
    ...data,
    type: "provider", // fixed type for now
  });
  const token = res.data.token;
  localStorage.setItem("token", token);
  return token;
}

export async function getMe() {
  const res = await axios.get("/me");
  return res.data;
}

export async function createTypedSubProfile(
  profileType: "candidate" | "company",
  data: any
) {
  const token = localStorage.getItem("token");
  const endpoint =
    profileType === "candidate" ? "/candidate-profile" : "/company-profile";

  return axios.post(endpoint, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getMySubProfiles() {
  const token = localStorage.getItem("token");
  const res = await axios.get("/me/sub-profiles", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function getMyTokens() {
  const token = localStorage.getItem("token");
  const res = await axios.get("/me/tokens", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function createTokenForSubProfile(
  subProfileId: string,
  options?: {
    name?: string;
    expiresIn?: number;
    isOneTime?: boolean;
  }
) {
  const token = localStorage.getItem("token");

  // TODO: move to config
  const res = await axios.post(
    "/token",
    {
      subProfileId,
      name: options?.name ?? "Unnamed Token",
      expiresIn: options?.expiresIn ?? 60 * 60 * 24 * 7, // default: 7 days
      isOneTime: options?.isOneTime ?? true,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data;
}

export async function deleteToken(id: string) {
  const token = localStorage.getItem("token");
  return await axios.delete(`/token/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getMySubProfile(subProfileId: string) {
  const token = localStorage.getItem("token");
  const res = await axios.get(`/me/sub-profile/${subProfileId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export async function updateSubProfile(subProfileId: string, data: any) {
  const token = localStorage.getItem("token");
  const res = await axios.patch(`/me/sub-profile/${subProfileId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export async function deleteSubProfile(subProfileId: string) {
  const token = localStorage.getItem("token");
  return await axios.delete(`/me/sub-profile/${subProfileId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function updateAgent(subProfileId: string, data: AgentData) {
  const token = localStorage.getItem("token");

  const res = await axios.patch(`/agent/${subProfileId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export async function sendChatMessage({
  subProfileId,
  message,
  profileType,
}: {
  subProfileId: string;
  message: string;
  profileType: string;
}): Promise<string> {
  const token = localStorage.getItem("token");
  const accessToken = localStorage.getItem("access-token");

  const headers = token
    ? { Authorization: `Bearer ${token}` }
    : { "authorization-token": accessToken ?? "" };

  const res = await axios.post(
    `/chat/${subProfileId}?profileType=${profileType}`,
    { message },
    { headers }
  );
  return res.data.response;
}

export async function deleteDocument(docId: string) {
  const token = localStorage.getItem("token");
  return await axios.delete(`/document/${docId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function createDocument(title: string, content: string) {
  const token = localStorage.getItem("token");
  const res = await axios.post(
    "/document",
    { title, content },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
}

export async function uploadDocument(file: File) {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post("/document/upload", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}
