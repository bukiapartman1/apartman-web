import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

async function checkAuth() {
  const cookieStore = await cookies();
  return cookieStore.get('adminAuth')?.value === 'true';
}

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ error: 'Nincs jogosultsága a művelethez!' }, { status: 401 });
    }

    const params = await props.params;
    const body = await request.json();
    const { approved, reply } = body;

    const dataToUpdate: any = {};
    
    if (typeof approved === 'boolean') {
      dataToUpdate.approved = approved;
    }
    
    if (reply === null) {
      dataToUpdate.reply = null;
      dataToUpdate.replyAt = null;
    } else if (typeof reply === 'string') {
      dataToUpdate.reply = reply;
      dataToUpdate.replyAt = new Date();
    }

    const review = await prisma.review.update({
      where: { id: params.id },
      data: dataToUpdate,
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error('Hiba a vélemény frissítésekor:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ error: 'Nincs jogosultsága a művelethez!' }, { status: 401 });
    }

    const params = await props.params;
    
    await prisma.review.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Hiba a vélemény törlésekor:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
