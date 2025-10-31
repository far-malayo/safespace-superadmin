// /lib/auth.ts
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRY = "7d";

if (!JWT_SECRET) {
  throw new Error("❌ Missing JWT_SECRET in environment variables");
}

export function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}
