import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startOfMonth, endOfMonth } from 'date-fns';
import { runSync } from '@/lib/sync';

let lastSyncTime = 0;
const SYNC_INTERVAL = 10 * 60 * 1000; // 10 perc gyorsítótárazás

export async function GET() {
  try {
    // Automatikus szinkronizáció indítása ha eltelt a megadott idő
    const now = Date.now();
    if (now - lastSyncTime > SYNC_INTERVAL) {
      lastSyncTime = now;
      await runSync();
    }

    // Automatikus karbantartás: a 30 percnél régebbi, befejezetlen (PENDING) Barion foglalásokat töröljük, hogy ne blokkolják a naptárat
    const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000);
    try {
      await prisma.booking.deleteMany({
        where: {
          paymentMethod: 'BARION',
          status: 'PENDING',
          createdAt: { lt: thirtyMinsAgo }
        }
      });
    } catch (e) {
      // safe ignore
    }

    const bookings = await prisma.booking.findMany({
      where: {
        status: { not: 'CANCELLED' }
      },
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
    const { name, email, phone, comment, startDate, endDate, nights, adults, children, ifaAmount, totalPrice, paymentMethod, barionPaymentId } = body;

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

    const guestNote = `[Vendégek: ${adults || 2} felnőtt${children ? `, ${children} gyermek` : ''} | IFA: ${(ifaAmount || 0).toLocaleString('hu-HU')} Ft]`;
    const finalComment = comment ? `${guestNote}\n${comment}` : guestNote;

    const baseData = {
      bookingId,
      name,
      email,
      phone,
      comment: finalComment,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      nights: Number(nights),
      totalPrice: Number(totalPrice),
      paymentMethod: paymentMethod || 'TRANSFER',
      barionPaymentId: barionPaymentId || null,
    };

    let booking;
    try {
      booking = await (prisma.booking as any).create({
        data: {
          ...baseData,
          adults: adults ? Number(adults) : 2,
          children: children ? Number(children) : 0,
          ifaAmount: ifaAmount ? Number(ifaAmount) : 0,
        },
      });
    } catch (err) {
      console.warn('Fallback to base booking fields:', err);
      booking = await prisma.booking.create({
        data: baseData,
      });
    }

    return NextResponse.json(booking, { status: 201 });
  } catch (error: any) {
    console.error('Hiba a foglalás létrehozásakor:', error);
    return NextResponse.json({ 
      error: error?.message || 'Nem sikerült elmenteni a foglalást az adatbázisba',
      details: String(error)
    }, { status: 500 });
  }
}
