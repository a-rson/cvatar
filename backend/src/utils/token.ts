import jwt from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
  throw new Error("Missing JWT_SECRET in .env");
}
const JWT_SECRET = process.env.JWT_SECRET!;

export function createToken(user: { id: string; email: string }) {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "7d",
  });
}
