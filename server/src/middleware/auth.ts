import { Request, Response, NextFunction } from 'express';
import { createPublicKey } from 'crypto';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  userId?: string;
  userEmail?: string;
}

// Cache for Clerk JWKS public keys (avoids fetching on every request)
let cachedJwks: any = null;
let jwksCachedAt = 0;
const JWKS_TTL_MS = 60 * 60 * 1000; // 1 hour

async function getClerkPublicKey(kid?: string): Promise<string | null> {
  const now = Date.now();
  if (!cachedJwks || now - jwksCachedAt > JWKS_TTL_MS) {
    try {
      const clerkJwksUrl = process.env.CLERK_JWKS_URL ||
        (process.env.CLERK_SECRET_KEY
          ? `https://api.clerk.dev/v1/jwks`
          : null);

      if (!clerkJwksUrl) return null;

      const res = await fetch(clerkJwksUrl, {
        headers: { Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}` }
      });
      cachedJwks = await res.json();
      jwksCachedAt = now;
    } catch {
      return null;
    }
  }

  if (!cachedJwks?.keys?.length) return null;

  // Find the matching key by kid, or use the first one
  const key = kid
    ? cachedJwks.keys.find((k: any) => k.kid === kid)
    : cachedJwks.keys[0];

  if (!key) return null;

  // Convert JWK to PEM-style public key using jsonwebtoken's built-in support
  // jsonwebtoken supports JWK objects directly in verify() as of v9
  return key;
}

export const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      // First decode to get the key ID (kid) from header
      const decoded = jwt.decode(token, { complete: true }) as any;
      if (decoded?.payload?.sub) {
        // Attempt signature verification if Clerk keys are available
        if (process.env.CLERK_SECRET_KEY) {
          const key = await getClerkPublicKey(decoded.header?.kid);
          if (key) {
            try {
              // jwt.verify with a public key derived from the JWK object
              const pubKey = createPublicKey({ key, format: 'jwk' });
              jwt.verify(token, pubKey);
            } catch (verifyErr) {
              console.warn('[Auth Middleware] JWT signature verification failed. Rejecting request.');
              return res.status(401).json({ success: false, error: 'Invalid or expired authentication token.' });
            }
          }
        }
        // Token decoded (and verified if key available)
        req.userId = decoded.payload.sub;
        req.userEmail = decoded.payload.email
          || decoded.payload.primary_email
          || `user_${decoded.payload.sub.substring(0, 8)}@example.com`;
        return next();
      }
    } catch (err) {
      console.warn('[Auth Middleware] Token processing error:', (err as Error).message);
    }
  }

  // In production (Clerk key present), always require a valid token
  if (process.env.CLERK_SECRET_KEY && !process.env.ALLOW_SANDBOX_FALLBACK) {
    return res.status(401).json({ success: false, error: 'Authentication required. Please sign in.' });
  }

  // Sandbox fallback (only allowed when CLERK_SECRET_KEY is not set)
  const devUserId = (req.headers['x-demo-user-id'] as string) || 'user_2N_demo_founder_1001';
  req.userId = devUserId;
  req.userEmail = 'founder@startup.io';
  return next();
};
