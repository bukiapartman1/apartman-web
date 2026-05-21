import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { runSync } from '@/lib/sync';

async function checkAuth() {
  const cookieStore = await cookies();
  return cookieStore.get('adminAuth')?.value === 'true';
}

export async function POST() {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ error: 'Nincs jogosultsága a művelethez!' }, { status: 401 });
    }

    const results = await runSync();
    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error('Kézi szinkronizációs hiba:', error);
    return NextResponse.json({ error: 'Hiba történt a szinkronizáció során.' }, { status: 500 });
  }
}
