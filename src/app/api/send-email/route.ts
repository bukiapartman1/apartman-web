import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';
import { siteConfig } from '@/lib/siteConfig';
import {
  renderAdminContactEmail,
  renderAdminBookingEmail,
  renderGuestBarionSuccessEmail,
  renderGuestTransferRequestEmail,
  renderGuestPaymentConfirmedEmail,
  renderGuestPaymentReminderEmail,
} from '@/lib/emailTemplates';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { 
      type, 
      name, 
      email, 
      phone, 
      comment, 
      startDate, 
      endDate, 
      nights, 
      adults, 
      children, 
      ifaAmount, 
      totalPrice, 
      paidAmount, 
      bookingId 
    } = data;

    const user = process.env.GMAIL_USER || 'rekalaca@gmail.com';
    const pass = process.env.GMAIL_PASS;
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || siteConfig.contact.email || 'gava.tibor74@gmail.com';

    if (!pass) {
      console.log('--- E-MAIL SZIMULÁCIÓ (Nincs GMAIL_PASS) ---');
      console.log('Típus:', type);
      console.log('Címzett (Admin):', adminEmail);
      console.log('Címzett (Vendég):', email);
      console.log('Név:', name);
      console.log('--------------------------------------------');
      await new Promise(resolve => setTimeout(resolve, 500));
      return NextResponse.json({ success: true, simulated: true });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass }
    });

    // Check & attach email header banner
    const headerImagePath = path.join(process.cwd(), 'public', 'images', 'email', 'email-header.png');
    const emailAttachments: Array<{ filename: string; path: string; cid: string }> = [];
    if (fs.existsSync(headerImagePath)) {
      emailAttachments.push({
        filename: 'email-header.png',
        path: headerImagePath,
        cid: 'emailHeader'
      });
    }

    // ------------------------------------------------------------------
    // 1. Kapcsolatfelvételi űrlap -> Tulajdonosi e-mail
    // ------------------------------------------------------------------
    if (type === 'CONTACT') {
      const contactHtml = renderAdminContactEmail({
        name,
        email,
        phone,
        comment,
      });

      await transporter.sendMail({
        from: `"${siteConfig.name} - Kapcsolat" <${user}>`,
        to: adminEmail,
        replyTo: email,
        subject: `Kapcsolatfelvétel: ${name}`,
        html: contactHtml,
        attachments: emailAttachments,
      });

      return NextResponse.json({ success: true });
    }

    // ------------------------------------------------------------------
    // 2. Barion Online Fizetés Sikeres -> Tulajdonosi + Vendég e-mail
    // ------------------------------------------------------------------
    if (type === 'BARION_SUCCESS') {
      const actualPaid = paidAmount || Math.round(totalPrice * 0.3);

      // Tulajdonosi értesítő
      const adminHtml = renderAdminBookingEmail({
        bookingId: bookingId || 'N/A',
        name,
        email,
        phone,
        adults,
        children,
        startDate,
        endDate,
        nights: nights || 1,
        totalPrice: totalPrice || 0,
        paidAmount: actualPaid,
        paymentMethod: 'BARION',
        comment,
      });

      await transporter.sendMail({
        from: `"${siteConfig.name}" <${user}>`,
        to: adminEmail,
        replyTo: email,
        subject: `Új foglalás [Barion Fizetve]: ${name} (${startDate} - ${endDate})`,
        html: adminHtml,
        attachments: emailAttachments,
      });

      // Vendég visszaigazolás
      const guestHtml = renderGuestBarionSuccessEmail({
        bookingId: bookingId || 'N/A',
        name,
        adults,
        children,
        startDate,
        endDate,
        nights: nights || 1,
        totalPrice: totalPrice || 0,
        paidAmount: actualPaid,
      });

      await transporter.sendMail({
        from: `"${siteConfig.name}" <${user}>`,
        to: email,
        subject: `Sikeres Foglalás és Fizetés - ${siteConfig.shortName}`,
        html: guestHtml,
        attachments: emailAttachments,
      });

      return NextResponse.json({ success: true });
    }

    // ------------------------------------------------------------------
    // 3. Fizetés Jóváhagyása (Banki átutalás megérkezett) -> Vendég e-mail
    // ------------------------------------------------------------------
    if (type === 'PAYMENT') {
      const guestHtml = renderGuestPaymentConfirmedEmail({
        bookingId: bookingId || 'N/A',
        name,
        adults,
        children,
        startDate,
        endDate,
        nights: nights || 1,
        totalPrice: totalPrice || 0,
        paidAmount: paidAmount || 0,
      });

      await transporter.sendMail({
        from: `"${siteConfig.name}" <${user}>`,
        to: email,
        subject: `Foglalás Véglegesítve - ${siteConfig.shortName}`,
        html: guestHtml,
        attachments: emailAttachments,
      });

      return NextResponse.json({ success: true });
    }

    // ------------------------------------------------------------------
    // 4. Fizetési Emlékeztető -> Vendég e-mail
    // ------------------------------------------------------------------
    if (type === 'REMINDER') {
      const deposit = Math.round((totalPrice || 0) * 0.3);

      const reminderHtml = renderGuestPaymentReminderEmail({
        bookingId: bookingId || 'N/A',
        name,
        startDate,
        endDate,
        totalPrice: totalPrice || 0,
        deposit,
      });

      await transporter.sendMail({
        from: `"${siteConfig.name}" <${user}>`,
        to: email,
        subject: `Fizetési Emlékeztető - ${siteConfig.shortName}`,
        html: reminderHtml,
        attachments: emailAttachments,
      });

      return NextResponse.json({ success: true });
    }

    // ------------------------------------------------------------------
    // 5. Alapértelmezett: Új átutalásos foglalás -> Tulajdonosi + Vendég e-mail
    // ------------------------------------------------------------------
    const deposit = Math.round((totalPrice || 0) * 0.3);

    // Tulajdonosi értesítő
    const adminHtml = renderAdminBookingEmail({
      bookingId: bookingId || 'N/A',
      name,
      email,
      phone,
      adults,
      children,
      startDate,
      endDate,
      nights: nights || 1,
      totalPrice: totalPrice || 0,
      paymentMethod: 'TRANSFER',
      comment,
    });

    await transporter.sendMail({
      from: `"${siteConfig.name}" <${user}>`,
      to: adminEmail,
      replyTo: email,
      subject: `Új foglalás [Átutalás]: ${name} (${startDate} - ${endDate})`,
      html: adminHtml,
      attachments: emailAttachments,
    });

    // Vendég visszaigazolás
    const guestHtml = renderGuestTransferRequestEmail({
      bookingId: bookingId || 'N/A',
      name,
      adults,
      children,
      startDate,
      endDate,
      nights: nights || 1,
      totalPrice: totalPrice || 0,
      deposit,
    });

    await transporter.sendMail({
      from: `"${siteConfig.name}" <${user}>`,
      to: email,
      subject: `Foglalási Igény Visszaigazolás - ${siteConfig.shortName}`,
      html: guestHtml,
      attachments: emailAttachments,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
