import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getBarionPaymentState } from '@/lib/barion';
import { format } from 'date-fns';

export async function GET(request: Request) {
  return handleCallback(request);
}

export async function POST(request: Request) {
  return handleCallback(request);
}

async function handleCallback(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let paymentId = searchParams.get('paymentId') || searchParams.get('PaymentId');

    if (!paymentId && request.method === 'POST') {
      try {
        const body = await request.json();
        paymentId = body.PaymentId || body.paymentId;
      } catch {
        // body might be empty
      }
    }

    if (!paymentId) {
      return NextResponse.json({ error: 'Missing PaymentId' }, { status: 400 });
    }

    const state = await getBarionPaymentState(paymentId);
    if (state.Status === 'Succeeded') {
      const booking = await prisma.booking.findFirst({
        where: {
          OR: [
            { barionPaymentId: paymentId },
            { bookingId: state.PaymentRequestId },
          ],
        },
      });

      if (booking && booking.status === 'PENDING') {
        const depositAmount = Math.round(booking.totalPrice * 0.3);
        const paidAmount = state.Total > 0 ? state.Total : depositAmount;
        const isFull = paidAmount >= booking.totalPrice;

        const updatedBooking = await prisma.booking.update({
          where: { id: booking.id },
          data: {
            status: isFull ? 'PAID' : 'DEPOSIT',
            paidAmount,
            barionPaymentId: paymentId,
          },
        });

        // Send email
        const origin = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        try {
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
        } catch (err) {
          console.error('Barion callback email error:', err);
        }
      }
    }

    return NextResponse.json({ success: true, status: state.Status });
  } catch (error: any) {
    console.error('Barion callback handling error:', error);
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 });
  }
}
