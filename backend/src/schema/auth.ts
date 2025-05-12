import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  type: z.enum(["provider", "client", "admin"]),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type RegisterCredentials = z.infer<typeof registerSchema>;
export type LoginCredentials = z.infer<typeof loginSchema>;
