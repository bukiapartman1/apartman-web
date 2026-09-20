import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startBarionPayment } from '@/lib/barion';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { bookingId, amountType } = body; // amountType: 'deposit' (30%) or 'full' (100%)

    if (!bookingId) {
      return NextResponse.json({ error: 'Foglalási azonosító megadása kötelező' }, { status: 400 });
    }

    const booking = await prisma.booking.findFirst({
      where: { bookingId },
    });

    if (!booking) {
      return NextResponse.json({ error: 'A foglalás nem található' }, { status: 404 });
    }

    const payAmount = amountType === 'full' 
      ? booking.totalPrice 
      : Math.round(booking.totalPrice * 0.3);

    // Determine host URL for redirect/callback
    const origin = request.headers.get('origin') || process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const redirectUrl = `${origin}/foglalas/barion-visszaigazolas`;
    const callbackUrl = `${origin}/api/barion/callback`;

    const barionResult = await startBarionPayment({
      bookingId: booking.bookingId,
      amount: payAmount,
      guestName: booking.name,
      guestEmail: booking.email,
      startDate: booking.startDate.toISOString().split('T')[0],
      endDate: booking.endDate.toISOString().split('T')[0],
      nights: booking.nights,
      redirectUrl,
      callbackUrl,
    });

    // Update booking with paymentId and amount intended
    await prisma.booking.update({
      where: { id: booking.id },
      data: {
        barionPaymentId: barionResult.PaymentId,
        paymentMethod: 'BARION',
      },
    });

    return NextResponse.json({
      success: true,
      paymentId: barionResult.PaymentId,
      gatewayUrl: barionResult.GatewayUrl,
    });
  } catch (error: any) {
    console.error('Barion fizetés indítási hiba:', error);
    return NextResponse.json(
      { error: error?.message || 'Nem sikerült elindítani a Barion fizetést' },
      { status: 500 }
    );
  }
}
