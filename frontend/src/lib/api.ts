import axios from "./axios";
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
