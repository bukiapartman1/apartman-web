import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (username === 'admin' && password === 'admin') {
    const response = NextResponse.json({ success: true });
    // Beállítunk egy httpOnly sütit a munkamenethez (egyszerű változat)
    response.cookies.set('adminAuth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 hét
      path: '/'
    });
    return response;
  }

  return NextResponse.json({ success: false }, { status: 401 });
}
