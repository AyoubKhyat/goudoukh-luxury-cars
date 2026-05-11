import { SignJWT, jwtVerify } from "jose";
import { hash, compare } from "bcryptjs";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "goudoukh-luxury-cars-secret-key-2024"
);

export async function signToken(payload: {
  adminId: string;
  email: string;
}): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET);
}

export async function verifyToken(
  token: string
): Promise<{ adminId: string; email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as { adminId: string; email: string };
  } catch {
    return null;
  }
}

export async function getAdminFromRequest(
  request: Request
): Promise<{ adminId: string; email: string } | null> {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;

  const cookies = Object.fromEntries(
    cookieHeader.split("; ").map((c) => {
      const [key, ...rest] = c.split("=");
      return [key, rest.join("=")];
    })
  );

  const token = cookies["admin-token"];
  if (!token) return null;

  return verifyToken(token);
}

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12);
}

export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return compare(password, hashedPassword);
}
