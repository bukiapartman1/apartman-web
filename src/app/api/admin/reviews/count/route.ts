import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

async function checkAuth() {
  const cookieStore = await cookies();
  return cookieStore.get('adminAuth')?.value === 'true';
}

export async function GET() {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ count: 0 }, { status: 401 });
    }

    const count = await prisma.review.count({
      where: { approved: false }
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error('Hiba a jóváhagyatlan vélemények darabszámának lekérdezésekor:', error);
    return NextResponse.json({ count: 0 });
  }
}
