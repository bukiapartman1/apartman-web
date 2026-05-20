import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const body = await request.json();
    const { paidAmount, status } = body;

    const booking = await prisma.booking.update({
      where: { id: params.id },
      data: { paidAmount, status },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Hiba a foglalás frissítésekor:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    await prisma.booking.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Hiba a foglalás törlésekor:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
