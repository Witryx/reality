import { NextResponse } from 'next/server';
import { isValidAdminCredentials, setAdminSessionCookie } from '../../../../lib/adminAuth';

export const runtime = 'nodejs';

export async function POST(request) {
  let payload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const user = String(payload?.user || '');
  const pass = String(payload?.pass || '');

  if (!user || !pass) {
    return NextResponse.json({ error: 'User and password are required.' }, { status: 400 });
  }

  if (!isValidAdminCredentials({ user, pass })) {
    return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true, user });
  setAdminSessionCookie(response, user);
  return response;
}
