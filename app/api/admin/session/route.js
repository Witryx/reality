import { NextResponse } from 'next/server';
import { getAdminSessionFromRequest } from '../../../../lib/adminAuth';

export const runtime = 'nodejs';

export async function GET(request) {
  const session = getAdminSessionFromRequest(request);

  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }

  return NextResponse.json({
    authenticated: true,
    user: session.user,
    exp: session.exp,
  });
}
