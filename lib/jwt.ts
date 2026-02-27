import { SignJWT, jwtVerify } from "jose";

type JwtPayload = Record<string, unknown>;

export async function signJwt(payload: JwtPayload, secret: string, expiresInSeconds: number) {
  const key = new TextEncoder().encode(secret);
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + expiresInSeconds)
    .sign(key);
}

export async function verifyJwt<T extends JwtPayload>(token: string, secret: string) {
  const key = new TextEncoder().encode(secret);
  const { payload } = await jwtVerify(token, key);
  return payload as T;
}
