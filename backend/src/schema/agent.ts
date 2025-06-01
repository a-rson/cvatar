import { z } from "zod";

export const agentSchema = z.object({
  name: z.string().min(1),
  language: z.string().min(2), // e.g., 'en', 'pl'
  style: z.enum(["formal", "casual", "concise", "enthusiastic"]),
  tone: z.enum(["neutral", "friendly", "professional", "humorous"]),
  answerLength: z.enum(["short", "medium", "long"]),
  introPrompt: z.string().optional(),
  disclaimerText: z.string().optional(),
  customInstructions: z.string().optional(),
  profileType: z.enum(["candidate", "company"]),
});
