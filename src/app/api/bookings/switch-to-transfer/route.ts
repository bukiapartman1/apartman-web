import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';

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

    // Foglalás átállítása átutalásos fizetésre
    const updated = await prisma.booking.update({
      where: { id: booking.id },
      data: {
        paymentMethod: 'TRANSFER',
        status: 'PENDING',
      },
    });

    // Visszaigazoló e-mail kiküldése az átutalási adatokkal
    const origin = request.headers.get('origin') || process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    try {
      await fetch(`${origin}/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'NEW_BOOKING',
          bookingId: updated.bookingId,
          name: updated.name,
          email: updated.email,
          phone: updated.phone,
          comment: updated.comment,
          startDate: format(new Date(updated.startDate), 'yyyy. MM. dd.'),
          endDate: format(new Date(updated.endDate), 'yyyy. MM. dd.'),
          nights: updated.nights,
          totalPrice: updated.totalPrice,
        }),
      });
    } catch (emailErr) {
      console.error('Hiba az átutalásos e-mail küldésekor:', emailErr);
    }

    return NextResponse.json({ success: true, booking: updated });
  } catch (error: any) {
    console.error('Hiba a fizetési mód átváltásakor:', error);
    return NextResponse.json({ error: error?.message || 'Szerver hiba' }, { status: 500 });
  }
}
