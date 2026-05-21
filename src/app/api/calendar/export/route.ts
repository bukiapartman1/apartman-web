import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const channel = searchParams.get('channel')?.toLowerCase();

    let bookings = await prisma.booking.findMany({
      orderBy: { startDate: 'asc' },
    });

    if (channel === 'booking') {
      bookings = bookings.filter(b => !b.name.includes('Booking.com'));
    } else if (channel === 'szallas') {
      bookings = bookings.filter(b => !b.name.includes('Szallas.hu'));
    } else if (channel === 'airbnb') {
      bookings = bookings.filter(b => !b.name.includes('Airbnb'));
    } else if (channel === 'custom' || channel === 'egyeb') {
      bookings = bookings.filter(b => !b.name.includes('Egyéb'));
    }

    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Harmonia Vendeghaz//Apartman Naptar//HU',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
    ].join('\r\n') + '\r\n';

    for (const b of bookings) {
      const dtStamp = format(b.createdAt || new Date(), "yyyyMMdd'T'HHmmss'Z'");
      const dtStart = format(new Date(b.startDate), 'yyyyMMdd');
      const dtEnd = format(new Date(b.endDate), 'yyyyMMdd');
      
      // A UID-nak egyedinek kell lennie a szinkronizáláshoz
      const uid = `${b.id}@harmoniavendeghaz.hu`;

      icsContent += [
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${dtStamp}`,
        `DTSTART;VALUE=DATE:${dtStart}`,
        `DTEND;VALUE=DATE:${dtEnd}`,
        `SUMMARY:${b.status === 'IMPORTED' ? 'Foglalt (Külső)' : 'Foglalt (Harmónia Vendégház)'}`,
        'END:VEVENT',
      ].join('\r\n') + '\r\n';
    }

    icsContent += 'END:VCALENDAR\r\n';

    return new Response(icsContent, {
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': 'attachment; filename="naptar.ics"',
      },
    });
  } catch (error) {
    console.error('Hiba az iCal exportálás során:', error);
    return new Response('Hiba az iCal fájl előállítása közben.', { status: 500 });
  }
}
