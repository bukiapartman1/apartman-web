import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { bookingId } = await request.json();

    if (!bookingId) {
      return NextResponse.json({ error: 'Hiányzó foglalási azonosító' }, { status: 400 });
    }

    const booking = await prisma.booking.findFirst({
      where: { bookingId },
    });

    if (!booking) {
      return NextResponse.json({ error: 'A foglalás nem található' }, { status: 404 });
    }

    // Csak PENDING státuszú, még ki nem fizetett foglalást lehet törölni/töröltként megjelölni
    if (booking.status === 'PENDING') {
      await prisma.booking.delete({
        where: { id: booking.id },
      });
    }

    return NextResponse.json({ 
      success: true, 
      startDate: booking.startDate.toISOString().split('T')[0],
      endDate: booking.endDate.toISOString().split('T')[0],
      name: booking.name,
      email: booking.email,
      phone: booking.phone
    });
  } catch (error: any) {
    console.error('Hiba a foglalás visszavonásakor:', error);
    return NextResponse.json({ error: error?.message || 'Szerver hiba' }, { status: 500 });
  }
}
