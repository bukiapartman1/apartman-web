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
      return NextResponse.json({ error: 'Nincs jogosultsága a művelethez!' }, { status: 401 });
    }

    const reviews = await prisma.review.findMany({
      include: {
        booking: {
          select: {
            startDate: true,
            endDate: true,
            totalPrice: true,
            status: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Hiba a vélemények betöltésekor:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
