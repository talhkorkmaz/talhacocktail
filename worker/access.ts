import { createRemoteJWKSet, jwtVerify, type JWTVerifyGetKey } from "jose";

export type AccessSettings = { ACCESS_TEAM_DOMAIN?: string; ACCESS_AUD?: string };
export type Owner = { sub: string; email: string };
const ownerEmail = "talhkorkmaz@gmail.com";
const keySets = new Map<string, ReturnType<typeof createRemoteJWKSet>>();

export async function verifyOwner(
  token: string,
  settings: AccessSettings,
  testKey?: JWTVerifyGetKey,
): Promise<Owner | null> {
  const domain = settings.ACCESS_TEAM_DOMAIN;
  if (!domain || !/^[a-z0-9-]+\.cloudflareaccess\.com$/.test(domain) || !settings.ACCESS_AUD) return null;
  try {
    const issuer = `https://${domain}`;
    let keys = testKey ?? keySets.get(issuer);
    if (!keys) {
      const remoteKeys = createRemoteJWKSet(new URL(`${issuer}/cdn-cgi/access/certs`));
      keySets.set(issuer, remoteKeys);
      keys = remoteKeys;
    }
    const { payload } = await jwtVerify(token, keys, {
      algorithms: ["RS256"], issuer, audience: settings.ACCESS_AUD,
      requiredClaims: ["exp", "sub", "email"],
    });
    if (typeof payload.sub !== "string" || !payload.sub ||
        typeof payload.email !== "string" || payload.email.toLowerCase() !== ownerEmail) return null;
    return { sub: payload.sub, email: ownerEmail };
  } catch {
    return null;
  }
}

export async function authenticatedRequest(request: Request, settings: AccessSettings) {
  const headers = new Headers(request.headers);
  // Never accept Sites identity headers from the public Internet.
  for (const name of [...headers.keys()]) {
    if (name.startsWith("oai-authenticated-user-")) headers.delete(name);
  }
  const cookieTokens = (request.headers.get("cookie") ?? "").split(";")
    .map((cookie) => cookie.trim()).filter((cookie) => cookie.startsWith("CF_Authorization="));
  const token = request.headers.get("cf-access-jwt-assertion") ??
    (cookieTokens.length === 1 ? cookieTokens[0].slice("CF_Authorization=".length) : "");
  const owner = token ? await verifyOwner(token, settings) : null;
  if (owner) {
    headers.set("oai-authenticated-user-id", owner.sub);
    headers.set("oai-authenticated-user-email", owner.email);
  }
  return { request: new Request(request, { headers }), owner };
}
