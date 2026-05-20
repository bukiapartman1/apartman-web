import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startOfMonth, endOfMonth } from 'date-fns';

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { startDate: 'asc' },
    });
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Hiba a foglalások lekérésekor:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, comment, startDate, endDate, nights, totalPrice } = body;

    const now = new Date();
    const yy = now.getFullYear().toString().slice(-2);
    const mm = (now.getMonth() + 1).toString().padStart(2, '0');

    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const countThisMonth = await prisma.booking.count({
      where: {
        createdAt: {
          gte: monthStart,
          lte: monthEnd
        }
      }
    });

    const nn = (countThisMonth + 1).toString().padStart(2, '0');
    const bookingId = `${yy}A${mm}${nn}`;

    const booking = await prisma.booking.create({
      data: {
        bookingId,
        name,
        email,
        phone,
        comment,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        nights,
        totalPrice,
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error('Hiba a foglalás létrehozásakor:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
