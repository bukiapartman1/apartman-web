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

    const settings = await prisma.setting.findMany();
    
    // Convert array to key-value object
    const settingsObj = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);

    return NextResponse.json(settingsObj);
  } catch (error) {
    console.error('Hiba a beállítások lekérésekor:', error);
    return NextResponse.json({ error: 'Szerveroldali hiba történt.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ error: 'Nincs jogosultsága a művelethez!' }, { status: 401 });
    }

    const body = await request.json();
    
    // Save each key-value pair in transaction
    const operations = Object.entries(body).map(([key, value]) => {
      return prisma.setting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) }
      });
    });

    await prisma.$transaction(operations);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Hiba a beállítások mentésekor:', error);
    return NextResponse.json({ error: 'Hiba történt a mentés során.' }, { status: 500 });
  }
}
