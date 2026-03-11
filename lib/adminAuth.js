import crypto from 'crypto';

export const ADMIN_SESSION_COOKIE = 'admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

const toBase64Url = (value) => Buffer.from(value, 'utf8').toString('base64url');
const fromBase64Url = (value) => Buffer.from(value, 'base64url').toString('utf8');

const getSessionSecret = () => {
  const fromEnv = process.env.ADMIN_SESSION_SECRET || process.env.NEXTAUTH_SECRET;
  if (fromEnv) return fromEnv;
  return 'dev-admin-secret-change-me';
};

const safeEqual = (left = '', right = '') => {
  const leftBuf = Buffer.from(String(left));
  const rightBuf = Buffer.from(String(right));
  if (leftBuf.length !== rightBuf.length) return false;
  return crypto.timingSafeEqual(leftBuf, rightBuf);
};

const signPayload = (payloadPart) =>
  crypto
    .createHmac('sha256', getSessionSecret())
    .update(payloadPart)
    .digest('base64url');

export const getAdminCredentials = () => ({
  user: process.env.ADMIN_USER || 'admin',
  pass: process.env.ADMIN_PASS || process.env.ADMIN_PASSWORD || '1234',
});

export const isValidAdminCredentials = ({ user, pass } = {}) => {
  const cfg = getAdminCredentials();
  return safeEqual(user, cfg.user) && safeEqual(pass, cfg.pass);
};

export const createAdminSessionToken = (user) => {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payloadPart = toBase64Url(JSON.stringify({ user, exp }));
  const signature = signPayload(payloadPart);
  return `${payloadPart}.${signature}`;
};

export const verifyAdminSessionToken = (token) => {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null;

  const [payloadPart, signature] = token.split('.');
  if (!payloadPart || !signature) return null;

  const expectedSignature = signPayload(payloadPart);
  if (!safeEqual(signature, expectedSignature)) return null;

  try {
    const payload = JSON.parse(fromBase64Url(payloadPart));
    if (!payload?.user || !payload?.exp) return null;
    if (Number(payload.exp) < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
};

export const getAdminSessionFromRequest = (request) => {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  return verifyAdminSessionToken(token);
};

const shouldUseSecureCookie = () => {
  if (process.env.ADMIN_COOKIE_SECURE === '1') return true;
  if (process.env.ADMIN_COOKIE_SECURE === '0') return false;
  return process.env.NODE_ENV === 'production' && Boolean(process.env.VERCEL);
};

const cookieOptions = {
  httpOnly: true,
  secure: shouldUseSecureCookie(),
  sameSite: 'strict',
  path: '/',
  maxAge: SESSION_TTL_SECONDS,
};

export const setAdminSessionCookie = (response, user) => {
  const token = createAdminSessionToken(user);
  response.cookies.set(ADMIN_SESSION_COOKIE, token, cookieOptions);
};

export const clearAdminSessionCookie = (response) => {
  response.cookies.set(ADMIN_SESSION_COOKIE, '', {
    ...cookieOptions,
    maxAge: 0,
  });
};

export const requireAdminSession = (request) => {
  const session = getAdminSessionFromRequest(request);
  return session || null;
};
