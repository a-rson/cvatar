import { FastifyInstance } from "fastify";
import { CandidateProfile } from "../types/profile";
import { v4 as uuidv4 } from "uuid";

// Temp storing in memory 
const profiles = new Map<string, CandidateProfile>();

export async function profileRoutes(fastify: FastifyInstance) {
  // Create a profile
  fastify.post("/profile", async (request, reply) => {
    const body = request.body as Omit<CandidateProfile, "id">;
    const newProfile: CandidateProfile = {
      id: uuidv4(),
      ...body,
    };
    profiles.set(newProfile.id, newProfile);
    reply.code(201).send({ id: newProfile.id });
  });

  // Get a profile
  fastify.get("/profile/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const profile = profiles.get(id);
    if (!profile) {
      return reply.code(404).send({ error: "Profile not found" });
    }
    return profile;
  });
}
