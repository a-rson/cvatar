import { axios } from "./axios";
import { AuthCredentials, AuthResponse } from "@/types";

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

export async function createTypedProfile(
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

export async function getMyProfiles() {
  const token = localStorage.getItem("token");
  const res = await axios.get("/me/profiles", {
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

export async function createTokenForProfile(
  profileId: string,
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
      profileId,
      name: options?.name ?? "Unnamed Token",
      expiresIn: options?.expiresIn ?? 60 * 60 * 24 * 7, // default: 7 days
      isOneTime: options?.isOneTime ?? true,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data; // includes token, qrUrl, qrImage
}

export async function deleteToken(id: string) {
  const token = localStorage.getItem("token");
  return await axios.delete(`/token/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
