import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getBarionPaymentState } from '@/lib/barion';
import { format } from 'date-fns';

export async function POST(request: Request) {
  try {
    const { paymentId, bookingId } = await request.json();

    if (!paymentId) {
      return NextResponse.json({ error: 'Hiányzó paymentId' }, { status: 400 });
    }

    const booking = await prisma.booking.findFirst({
      where: bookingId ? { bookingId } : { barionPaymentId: paymentId },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Foglalás nem található' }, { status: 404 });
    }

    const state = await getBarionPaymentState(paymentId);
    const isSuccess = state.Status === 'Succeeded';

    if (isSuccess && booking.status === 'PENDING') {
      const depositAmount = Math.round(booking.totalPrice * 0.3);
      const paidAmount = state.Total > 0 ? state.Total : depositAmount;
      const isFull = paidAmount >= booking.totalPrice;

      // Update booking status in database
      const updatedBooking = await prisma.booking.update({
        where: { id: booking.id },
        data: {
          status: isFull ? 'PAID' : 'DEPOSIT',
          paidAmount,
          barionPaymentId: paymentId,
        },
      });

      // Send BARION_SUCCESS confirmation email
      try {
        const origin = request.headers.get('origin') || process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        await fetch(`${origin}/api/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'BARION_SUCCESS',
            bookingId: updatedBooking.bookingId,
            name: updatedBooking.name,
            email: updatedBooking.email,
            phone: updatedBooking.phone,
            comment: updatedBooking.comment,
            startDate: format(new Date(updatedBooking.startDate), 'yyyy. MM. dd.'),
            endDate: format(new Date(updatedBooking.endDate), 'yyyy. MM. dd.'),
            nights: updatedBooking.nights,
            totalPrice: updatedBooking.totalPrice,
            paidAmount: updatedBooking.paidAmount,
          }),
        });
      } catch (emailErr) {
        console.error('Hiba az e-mail küldésekor Barion check után:', emailErr);
      }

      return NextResponse.json({
        success: true,
        status: state.Status,
        booking: updatedBooking,
      });
    }

    return NextResponse.json({
      success: isSuccess,
      status: state.Status,
      booking,
    });
  } catch (error: any) {
    console.error('Hiba a Barion státusz ellenőrzésekor:', error);
    return NextResponse.json(
      { error: error?.message || 'Hiba a fizetés ellenőrzésekor' },
      { status: 500 }
    );
  }
}
