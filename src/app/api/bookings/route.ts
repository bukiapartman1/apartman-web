import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startOfMonth, endOfMonth } from 'date-fns';

let lastSyncTime = 0;
const SYNC_INTERVAL = 10 * 60 * 1000; // 10 perc gyorsítótárazás

function parseICS(icsText: string): Array<{ startDate: Date; endDate: Date; uid: string; summary: string }> {
  const lines = icsText.split(/\r?\n/);
  const events: any[] = [];
  let currentEvent: any = null;

  for (const line of lines) {
    const cleanLine = line.trim();
    if (cleanLine === 'BEGIN:VEVENT') {
      currentEvent = {};
    } else if (cleanLine === 'END:VEVENT') {
      if (currentEvent && currentEvent.startDate && currentEvent.endDate) {
        events.push(currentEvent);
      }
      currentEvent = null;
    } else if (currentEvent) {
      if (cleanLine.startsWith('DTSTART')) {
        const val = cleanLine.substring(cleanLine.indexOf(':') + 1);
        currentEvent.startDate = parseICSDate(val);
      } else if (cleanLine.startsWith('DTEND')) {
        const val = cleanLine.substring(cleanLine.indexOf(':') + 1);
        currentEvent.endDate = parseICSDate(val);
      } else if (cleanLine.startsWith('UID')) {
        currentEvent.uid = cleanLine.substring(cleanLine.indexOf(':') + 1) || '';
      } else if (cleanLine.startsWith('SUMMARY')) {
        currentEvent.summary = cleanLine.substring(cleanLine.indexOf(':') + 1) || 'Foglalt';
      }
    }
  }
  return events;
}

function parseICSDate(dateStr: string): Date {
  const cleanStr = dateStr.replace(/[^0-9T]/g, ''); // Pl. "20260601" vagy "20260601T120000Z"
  const year = parseInt(cleanStr.substring(0, 4));
  const month = parseInt(cleanStr.substring(4, 6)) - 1;
  const day = parseInt(cleanStr.substring(6, 8));
  
  if (cleanStr.includes('T')) {
    const hour = parseInt(cleanStr.substring(9, 11));
    const min = parseInt(cleanStr.substring(11, 13));
    const sec = parseInt(cleanStr.substring(13, 15));
    return new Date(Date.UTC(year, month, day, hour, min, sec));
  }
  
  return new Date(Date.UTC(year, month, day, 12, 0, 0));
}

async function syncICal() {
  const bookingUrl = process.env.ICAL_URL_BOOKING;
  const szallasUrl = process.env.ICAL_URL_SZALLAS;
  
  const urls = [
    { url: bookingUrl, source: 'Booking.com' },
    { url: szallasUrl, source: 'Szallas.hu' }
  ].filter(item => item.url && item.url.trim().startsWith('http'));

  if (urls.length === 0) return;

  for (const item of urls) {
    try {
      // Lekérjük a naptárat 5 másodperces időtúllépéssel
      const res = await fetch(item.url!, { cache: 'no-store', signal: AbortSignal.timeout(5000) });
      if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`);
      const text = await res.text();
      const events = parseICS(text);
      
      const sourceName = `${item.source} Foglalás`;
      const importedData = events.map(ev => ({
        name: sourceName,
        email: 'ical@import.hu',
        phone: '-',
        comment: `Importálva iCal-ből. (UID: ${ev.uid || '-'})`,
        startDate: ev.startDate,
        endDate: ev.endDate,
        nights: Math.max(1, Math.round((ev.endDate.getTime() - ev.startDate.getTime()) / (1000 * 60 * 60 * 24))),
        totalPrice: 0,
        status: 'IMPORTED'
      }));

      // Adatbázis frissítése tranzakcióban (csak ezt a forrást töröljük és írjuk újra)
      await prisma.$transaction([
        prisma.booking.deleteMany({
          where: { name: sourceName, status: 'IMPORTED' }
        }),
        prisma.booking.createMany({
          data: importedData
        })
      ]);
      console.log(`Sikeres szinkronizáció: ${item.source} (${events.length} foglalás betöltve)`);
    } catch (err) {
      console.error(`Hiba a(z) ${item.source} naptár letöltésekor:`, err);
    }
  }
}

export async function GET() {
  try {
    // Automatikus szinkronizáció indítása ha eltelt a megadott idő
    const now = Date.now();
    if (now - lastSyncTime > SYNC_INTERVAL) {
      lastSyncTime = now;
      await syncICal();
    }

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
