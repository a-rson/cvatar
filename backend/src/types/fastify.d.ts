import "fastify";
import { UserType } from "./UserType";

declare module "fastify" {
  interface FastifyRequest {
    user?: {
      id: string;
      email: string;
      type: UserType;
    };
  }
}
