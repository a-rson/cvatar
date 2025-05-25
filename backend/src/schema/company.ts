import { z } from "zod";

export const companyProfileSchema = z.object({
  name: z.string(),
  companyName: z.string(),
  description: z.string().optional(),
  logoUrl: z.string().url().optional(),
  services: z.array(z.string()).optional(),
  techStack: z
    .object({
      languages: z.array(z.string()),
      frameworks: z.array(z.string()),
      tools: z.array(z.string()),
    })
    .optional(),
  teamSize: z.number().int().min(1),
  contactEmail: z.string().email(),
  contactPhone: z.string().optional(),
});
