import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      where: { approved: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Hiba a vélemények lekérésekor:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      bookingId, 
      guestName, 
      ratingCleanliness, 
      ratingCommunication, 
      ratingLocation, 
      ratingOverall, 
      comment 
    } = body;

    if (!bookingId || !guestName || !comment) {
      return NextResponse.json({ error: 'Minden mező kitöltése kötelező!' }, { status: 400 });
    }

    // Foglalás ellenőrzése
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return NextResponse.json({ error: 'A megadott foglalási azonosító nem létezik!' }, { status: 404 });
    }

    // Csak a saját közvetlen foglalások véleményezhetőek (IMPORTED nem)
    if (booking.status === 'IMPORTED') {
      return NextResponse.json({ error: 'Külső csatornáról származó foglalások nem értékelhetőek itt!' }, { status: 400 });
    }

    // Ellenőrizzük, hogy ehhez a foglaláshoz készült-e már értékelés
    const existingReview = await prisma.review.findUnique({
      where: { bookingId },
    });

    if (existingReview) {
      return NextResponse.json({ error: 'Ehhez a foglaláshoz már küldtek be értékelést!' }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        bookingId,
        guestName,
        ratingCleanliness: Math.max(1, Math.min(10, parseInt(ratingCleanliness) || 10)),
        ratingCommunication: Math.max(1, Math.min(10, parseInt(ratingCommunication) || 10)),
        ratingLocation: Math.max(1, Math.min(10, parseInt(ratingLocation) || 10)),
        ratingOverall: Math.max(1, Math.min(10, parseInt(ratingOverall) || 10)),
        comment,
        approved: false, // Moderáció szükséges
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Hiba a vélemény mentésekor:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
