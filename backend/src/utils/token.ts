import jwt from "jsonwebtoken";
import { JWTUserPayload } from "../types";

const JWT_SECRET = process.env.JWT_SECRET!;

export function createToken(user: JWTUserPayload) {
  return jwt.sign(user, JWT_SECRET, {
    expiresIn: "7d",
  });
}
