
import { SignJWT, jwtVerify } from "jose";


const secret = process.env.JWT_SECRET;
if (!secret) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}
const key = new TextEncoder().encode(secret);

export async function encrypt(payload: any, expiresInSec = 30 * 60) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + expiresInSec) // in seconds
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  try {
    const {payload} = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
  return payload;
  } catch (err) {
    console.error("JWT decryption failed:", err);
    return null;
  }
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });

    return payload; 
  } catch (error) {
    console.error("Token verification failed:", error);
    return null; 
  }
}



