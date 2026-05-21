import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';
import path from 'path';

export async function GET(request: Request) {
  // Check auth for production
  if (process.env.NODE_ENV === 'production') {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    const now = new Date();
    // Query completed bookings that have not been sent review requests
    // status !== 'IMPORTED' and reviewRequestSent === false
    const completedBookings = await prisma.booking.findMany({
      where: {
        endDate: {
          lte: now,
        },
        status: {
          not: 'IMPORTED',
        },
        reviewRequestSent: false,
      },
    });

    if (completedBookings.length === 0) {
      return NextResponse.json({ message: 'Nincs kiküldendő véleménykérő levél.' });
    }

    const user = process.env.GMAIL_USER || 'bukiapartman1@gmail.com';
    const pass = process.env.GMAIL_PASS;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://apartman-web.vercel.app';

    let transporter: any = null;
    if (pass) {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass },
      });
    }

    const headerImagePath = path.join(process.cwd(), 'public', 'images', 'email', 'email-header.png');
    
    // Check if the image exists, otherwise don't attach it to prevent errors
    const emailAttachments: any[] = [];
    try {
      const fs = require('fs');
      if (fs.existsSync(headerImagePath)) {
        emailAttachments.push({
          filename: 'email-header.png',
          path: headerImagePath,
          cid: 'emailHeader'
        });
      }
    } catch (e) {
      console.warn('Nem található az email fejléc kép:', e);
    }

    const results = [];

    for (const booking of completedBookings) {
      const reviewUrl = `${siteUrl}/ertekeles/${booking.id}`;
      
      const imgHtml = emailAttachments.length > 0 
        ? `<div style="text-align: center; margin-bottom: 20px;">
             <img src="cid:emailHeader" alt="Harmónia Apartman" style="width: 100%; max-width: 600px; height: auto; border-radius: 8px;" />
           </div>`
        : '';

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; line-height: 1.6;">
          ${imgHtml}
          <h2 style="color: #c5a880; text-align: center;">Kedves ${booking.name}!</h2>
          <p>Reméljük, hogy kellemesen telt a nálunk eltöltött pihenése a Harmónia Apartmanban!</p>
          <p>Mivel számunkra rendkívül fontos a vendégeink elégedettsége és a szolgáltatásaink folyamatos fejlesztése, szeretnénk megkérni, hogy szánjon 2 percet a tartózkodása értékelésére.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${reviewUrl}" style="background-color: #c5a880; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 1.1rem; display: inline-block;">Apartman Értékelése</a>
          </div>

          <p>Visszajelzésével nemcsak nekünk segít, de a jövőbeli vendégeink számára is hasznos információkat nyújthat.</p>
          <p>Köszönjük, hogy minket választott, és bízunk benne, hogy a jövőben ismét vendégeink között köszönthetjük!</p>
          <br/>
          <p>Üdvözlettel,<br/><strong>Harmónia Apartman Csapata</strong><br/><span style="color: #888; font-size: 0.9rem;">Bükfürdő, Teszt utca 1.</span></p>
        </div>
      `;

      if (transporter) {
        try {
          await transporter.sendMail({
            from: `"Harmónia Apartman" <${user}>`,
            to: booking.email,
            subject: `Hogy érezte magát nálunk? - Harmónia Apartman`,
            html: emailHtml,
            attachments: emailAttachments
          });
          
          await prisma.booking.update({
            where: { id: booking.id },
            data: { reviewRequestSent: true }
          });
          
          results.push({ bookingId: booking.id, email: booking.email, success: true });
        } catch (mailError) {
          console.error(`Hiba a levél küldésekor (${booking.email}):`, mailError);
          results.push({ bookingId: booking.id, email: booking.email, success: false, error: String(mailError) });
        }
      } else {
        // Simulation mode
        console.log('--- VÉLEMÉNYKÉRŐ E-MAIL SZIMULÁCIÓ (Nincs GMAIL_PASS) ---');
        console.log('Címzett:', booking.email);
        console.log('Értékelő link:', reviewUrl);
        console.log('---------------------------------------------------------');
        
        await prisma.booking.update({
          where: { id: booking.id },
          data: { reviewRequestSent: true }
        });
        
        results.push({ bookingId: booking.id, email: booking.email, success: true, simulated: true });
      }
    }

    return NextResponse.json({ success: true, processed: results });
  } catch (error) {
    console.error('Hiba az értékeléskérések küldésekor:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
