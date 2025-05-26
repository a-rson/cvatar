import { z } from "zod";

export const candidateProfileSchema = z.object({
  name: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  description: z.string().optional(),
  maritalStatus: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  education: z.array(z.string()),
  spokenLanguages: z.array(z.string()),
  yearsOfExperience: z.number().int().min(0),
  softSkills: z.array(z.string()),
  workExperience: z
    .array(
      z.object({
        position: z.string(),
        company: z.string(),
        years: z.number().int().min(0),
      })
    )
    .optional(),
  techStack: z
    .object({
      languages: z.array(z.string()),
      frameworks: z.array(z.string()),
      tools: z.array(z.string()),
    })
    .optional(),
});
