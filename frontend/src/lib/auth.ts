import { jwtDecode } from "jwt-decode";

export interface JWTUserPayload {
  id: string;
  type: "provider" | "admin";
  email: string;
  exp?: number;
}

export function getUserFromToken(): JWTUserPayload | null {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    return jwtDecode<JWTUserPayload>(token);
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}
