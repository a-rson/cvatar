import { z } from "zod";

export const updateCandidateProfileSchema = z.object({
  name: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  description: z.string().optional(),
  maritalStatus: z.string().optional(),
  education: z.array(z.string()).optional(),
  spokenLanguages: z.array(z.string()).optional(),
  softSkills: z.array(z.string()).optional(),
  yearsOfExperience: z.coerce.number().int().nonnegative(),
});

export const updateCompanyProfileSchema = z.object({
  name: z.string().min(1),
  companyName: z.string().min(1),
  description: z.string().optional(),
  logoUrl: z.string().url().optional(),
  services: z.array(z.string()).optional(),
  teamSize: z.coerce.number().int().positive(),
  contactEmail: z.string().email(),
  contactPhone: z.string().optional(),
});
