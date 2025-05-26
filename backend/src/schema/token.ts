import { z } from "zod";

export const TokenRequestSchema = z.object({
  subprofileId: z.string().uuid(),
  profileType: z.enum(["candidate", "company"]),
  name: z.string().min(1),
  expiresIn: z.number().int().positive(),
  isOneTime: z.boolean(),
});
