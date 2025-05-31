export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface Token {
  id: string;
  name: string;
  token: string;
  type: string;
  used: boolean;
  expiresAt?: string;
}
