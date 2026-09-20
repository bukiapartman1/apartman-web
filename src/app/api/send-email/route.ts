import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import path from 'path';
import { siteConfig } from '@/lib/siteConfig';

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

    const user = process.env.GMAIL_USER || siteConfig.contact.email;
    const pass = process.env.GMAIL_PASS;

    if (!pass) {
      console.log('--- E-MAIL SZIMULÁCIÓ (Nincs GMAIL_PASS) ---');
      console.log('Típus:', type);
      console.log('Címzett:', email);
      console.log('--------------------------------------------');
      await new Promise(resolve => setTimeout(resolve, 500));
      return NextResponse.json({ success: true, simulated: true });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass }
    });

    if (type === 'CONTACT') {
      const contactHtml = `
        <div style="font-family: Arial, sans-serif; padding: 25px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #c5a880; border-radius: 8px;">
          <h2 style="color: #c5a880; border-bottom: 2px solid #c5a880; padding-bottom: 10px; margin-top: 0;">Új kapcsolatfelvételi üzenet</h2>
          <p><strong>Küldő neve:</strong> ${name}</p>
          <p><strong>E-mail címe:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Telefonszáma:</strong> ${phone || 'Nincs megadva'}</p>
          <br/>
          <p><strong>Üzenet szövege:</strong></p>
          <div style="background-color: #fcfaf7; padding: 18px; border: 1px solid #ebdccb; border-radius: 8px; white-space: pre-wrap;">${comment}</div>
        </div>
      `;

      await transporter.sendMail({
        from: `"${siteConfig.name} - Kapcsolat" <${user}>`,
        to: user,
        replyTo: email,
        subject: `Kapcsolatfelvétel: ${name}`,
        html: contactHtml
      });

      return NextResponse.json({ success: true });
    }

    const headerImagePath = path.join(process.cwd(), 'public', 'images', 'email', 'email-header.png');
    const emailAttachments = [
      {
        filename: 'email-header.png',
        path: headerImagePath,
        cid: 'emailHeader'
      }
    ];

    const guestCountText = `${adults || 2} felnőtt${children ? `, ${children} gyermek` : ''}`;

    if (type === 'BARION_SUCCESS') {
      const actualPaid = paidAmount || Math.round(totalPrice * 0.3);
      const remaining = totalPrice - actualPaid;

      // 1. Admin értesítése
      const adminHtml = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2e7d32;">Új Sikeres Foglalás (Online Barion Fizetés)!</h2>
          <p><strong>Foglalási Azonosító:</strong> ${bookingId}</p>
          <p><strong>Név:</strong> ${name}</p>
          <p><strong>E-mail:</strong> ${email}</p>
          <p><strong>Telefon:</strong> ${phone}</p>
          <p><strong>Vendégek:</strong> ${guestCountText}</p>
          <p><strong>Fizetési mód:</strong> Barion Bankkártyás fizetés (SIKERES)</p>
          <p><strong>Befizetett összeg:</strong> ${actualPaid.toLocaleString('hu-HU')} Ft</p>
          <br/>
          <h3>Foglalás részletei:</h3>
          <p><strong>Érkezés:</strong> ${startDate}</p>
          <p><strong>Távozás:</strong> ${endDate}</p>
          <p><strong>Időtartam:</strong> ${nights} éjszaka</p>
          <p><strong>Végösszeg (IFA-val):</strong> ${totalPrice.toLocaleString('hu-HU')} Ft</p>
          <p><strong>Fennmaradó szállásdíj:</strong> ${remaining > 0 ? remaining.toLocaleString('hu-HU') + ' Ft' : '0 Ft (Teljesen kifizetve)'}</p>
          <p><strong>Megjegyzés:</strong><br/> ${comment || 'Nincs megjegyzés.'}</p>
        </div>
      `;

      await transporter.sendMail({
        from: `"${siteConfig.name}" <${user}>`,
        to: user,
        subject: `Új foglalás [Barion Fizetve]: ${name} (${startDate} - ${endDate})`,
        html: adminHtml
      });

      // 2. Vendég visszaigazolása
      const guestHtml = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="cid:emailHeader" alt="${siteConfig.name}" style="width: 100%; max-width: 600px; height: auto; border-radius: 8px;" />
          </div>
          <h2 style="color: #2e7d32;">Sikeres Foglalás és Fizetés!</h2>
          <p>Kedves ${name}!</p>
          <p>Köszönjük, hogy a <strong>${siteConfig.name}</strong>-t választotta! Online bankkártyás fizetése a Barion rendszerén keresztül sikeresen megtörtént, így foglalását véglegesítettük és garantáltuk.</p>
          <p><strong>Önnek jelenleg semmilyen további átutalási teendője nincs!</strong></p>
          <br/>
          <h3>A foglalás adatai:</h3>
          <p><strong>Foglalási azonosító:</strong> ${bookingId}</p>
          <p><strong>Érkezés:</strong> ${startDate} (14:00-tól)</p>
          <p><strong>Távozás:</strong> ${endDate} (10:00-ig)</p>
          <p><strong>Időtartam:</strong> ${nights} éjszaka</p>
          <p><strong>Vendégek száma:</strong> ${guestCountText}</p>
          <br/>
          <h3>Pénzügyi összesítő:</h3>
          <div style="background-color: #f4faf4; padding: 15px; border-radius: 8px; border: 1px solid #d4ebd4; margin-bottom: 20px;">
            <p style="margin: 4px 0;"><strong>Foglalás végösszege (IFA-val):</strong> ${totalPrice.toLocaleString('hu-HU')} Ft</p>
            <p style="margin: 4px 0; color: #2e7d32; font-size: 1.1rem; font-weight: bold;"><strong>Online bankkártyával kifizetve (Barion):</strong> ${actualPaid.toLocaleString('hu-HU')} Ft</p>
            <p style="margin: 4px 0;"><strong>A szálláson érkezéskor fizetendő még:</strong> ${remaining > 0 ? remaining.toLocaleString('hu-HU') + ' Ft' : '0 Ft (Teljesen kifizetve)'}</p>
          </div>
          <h3>Fontos információk / Házirend:</h3>
          <ul>
            <li><strong>Cím:</strong> ${siteConfig.contact.address}</li>
            <li>Az apartmant az érkezés napján <strong>14:00</strong> órától lehet elfoglalni.</li>
            <li>Távozás napján kérjük az apartmant legkésőbb <strong>10:00</strong> óráig elhagyni.</li>
            <li>Díjmentes privát parkolás biztosított az udvarban.</li>
            <li>Az apartmanon belül tilos a dohányzás! Dohányozni csak az arra kijelölt helyen (terasz) lehet.</li>
            <li>Kérjük a csendrendelet betartását 22:00 és 08:00 között.</li>
          </ul>
          <br/>
          <p>Szeretettel várjuk!</p>
          <p>Üdvözlettel,<br/>${siteConfig.name} Csapata</p>
        </div>
      `;

      await transporter.sendMail({
        from: `"${siteConfig.name}" <${user}>`,
        to: email,
        subject: `Sikeres Foglalás és Fizetés - ${siteConfig.shortName}`,
        html: guestHtml,
        attachments: emailAttachments
      });

      return NextResponse.json({ success: true });
    }

    if (type === 'PAYMENT') {
      const remaining = totalPrice - paidAmount;
      
      const paymentHtml = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="cid:emailHeader" alt="${siteConfig.name}" style="width: 100%; max-width: 600px; height: auto; border-radius: 8px;" />
          </div>
          <h2 style="color: #2e7d32;">Fizetés Visszaigazolása</h2>
          <p>Kedves ${name}!</p>
          <p>Örömmel értesítjük, hogy foglalását véglegesítettük, az utalás megérkezett a számlánkra.</p>
          <br/>
          <h3>A foglalás adatai:</h3>
          <p><strong>Foglalási azonosító:</strong> ${bookingId}</p>
          <p><strong>Érkezés:</strong> ${startDate} (14:00-tól)</p>
          <p><strong>Távozás:</strong> ${endDate} (10:00-ig)</p>
          <p><strong>Időtartam:</strong> ${nights} éjszaka</p>
          <p><strong>Vendégek száma:</strong> ${guestCountText}</p>
          <br/>
          <h3>Pénzügyi összesítő:</h3>
          <p><strong>Teljes költség:</strong> ${totalPrice.toLocaleString('hu-HU')} Ft</p>
          <p><strong>Ebből befizetve:</strong> ${paidAmount.toLocaleString('hu-HU')} Ft</p>
          <p><strong>A szálláson fizetendő még:</strong> ${remaining > 0 ? remaining.toLocaleString('hu-HU') + ' Ft' : '0 Ft (Teljesen kifizetve)'}</p>
          <br/>
          <h3>Fontos információk / Házirend:</h3>
          <ul>
            <li><strong>Cím:</strong> ${siteConfig.contact.address}</li>
            <li>Az apartmant az érkezés napján <strong>14:00</strong> órától lehet elfoglalni.</li>
            <li>Távozás napján kérjük az apartmant legkésőbb <strong>10:00</strong> óráig elhagyni.</li>
          </ul>
          <br/>
          <p>Várjuk szeretettel!</p>
          <p>Üdvözlettel,<br/>${siteConfig.name} Csapata</p>
        </div>
      `;

      await transporter.sendMail({
        from: `"${siteConfig.name}" <${user}>`,
        to: email,
        subject: `Foglalás Véglegesítve - ${siteConfig.shortName}`,
        html: paymentHtml,
        attachments: emailAttachments
      });

      return NextResponse.json({ success: true });
    }

    if (type === 'REMINDER') {
      const deposit = Math.round(totalPrice * 0.3);
      
      const reminderHtml = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="cid:emailHeader" alt="${siteConfig.name}" style="width: 100%; max-width: 600px; height: auto; border-radius: 8px;" />
          </div>
          <h2 style="color: #d32f2f;">Fizetési Emlékeztető - ${siteConfig.shortName}</h2>
          <p>Kedves ${name}!</p>
          <p>Szeretnénk felhívni figyelmét, hogy a <strong>${startDate} és ${endDate}</strong> közötti időszakra szóló foglalásához tartozó előleg (${deposit.toLocaleString('hu-HU')} Ft) a mai napig nem érkezett meg a bankszámlánkra.</p>
          <p>Kérjük, hogy legkésőbb a következő <strong>48 órán belül</strong> gondoskodjon az átutalásról, ellenkező esetben foglalása automatikusan törlésre kerül a rendszerünkből.</p>
          <br/>
          <div style="background-color: #fdf2f2; padding: 20px; border: 1px solid #f5c6cb; border-radius: 8px;">
            <p><strong>Utalandó előleg: ${deposit.toLocaleString('hu-HU')} Ft</strong></p>
            <p>Kedvezményezett: <strong>${siteConfig.bank.accountName}</strong></p>
            <p>Bank: <strong>${siteConfig.bank.bankName}</strong></p>
            <p>Bankszámlaszám:</p>
            <p style="font-size: 1.2rem; font-weight: bold; letter-spacing: 1.5px; color: #111;">${siteConfig.bank.accountNumber}</p>
            <p>Közlemény rovatba kérjük beírni: <em>${name} - ${bookingId || ''}</em></p>
          </div>
          <p>Amennyiben időközben az utalást elindította, kérjük, tekintse tárgytalannak ezt a levelet!</p>
          <br/>
          <p>Üdvözlettel,<br/>${siteConfig.name} Csapata</p>
        </div>
      `;

      await transporter.sendMail({
        from: `"${siteConfig.name}" <${user}>`,
        to: email,
        subject: `Fizetési Emlékeztető - ${siteConfig.shortName}`,
        html: reminderHtml,
        attachments: emailAttachments
      });

      return NextResponse.json({ success: true });
    }

    // Alapértelmezett: Új átutalásos foglalás
    const deposit = Math.round(totalPrice * 0.3);

    const adminHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #c5a880;">Új Foglalás Érkezett (Átutalás)!</h2>
        <p><strong>Foglalási Azonosító:</strong> ${bookingId}</p>
        <p><strong>Név:</strong> ${name}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        <p><strong>Telefon:</strong> ${phone}</p>
        <p><strong>Vendégek:</strong> ${guestCountText}</p>
        <br/>
        <h3>Foglalás részletei:</h3>
        <p><strong>Érkezés:</strong> ${startDate}</p>
        <p><strong>Távozás:</strong> ${endDate}</p>
        <p><strong>Időtartam:</strong> ${nights} éjszaka</p>
        <p><strong>Végösszeg (IFA-val):</strong> ${totalPrice.toLocaleString('hu-HU')} Ft</p>
        <p><strong>Előleg összege (30%):</strong> ${deposit.toLocaleString('hu-HU')} Ft</p>
        <p><strong>Megjegyzés:</strong><br/> ${comment || 'Nincs megjegyzés.'}</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"${siteConfig.name}" <${user}>`,
      to: user,
      subject: `Új foglalás: ${name} (${startDate} - ${endDate})`,
      html: adminHtml
    });

    const guestHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="cid:emailHeader" alt="${siteConfig.name}" style="width: 100%; max-width: 600px; height: auto; border-radius: 8px;" />
        </div>
        <h2 style="color: #c5a880;">Kedves ${name}!</h2>
        <p>Köszönjük, hogy a <strong>${siteConfig.name}</strong>-t választotta! Foglalási igényét sikeresen rögzítettük.</p>
        <p><strong>Foglalása akkor kerül véglegesítésre, ha a 30% előleg a bankszámlánkra megérkezik (kérjük 3 munkanapon belül utalni).</strong></p>
        <br/>
        <h3>Az Ön foglalásának részletei:</h3>
        <p><strong>Foglalási azonosító:</strong> ${bookingId}</p>
        <p><strong>Érkezés:</strong> ${startDate} (14:00-tól)</p>
        <p><strong>Távozás:</strong> ${endDate} (10:00-ig)</p>
        <p><strong>Időtartam:</strong> ${nights} éjszaka</p>
        <p><strong>Vendégek száma:</strong> ${guestCountText}</p>
        <p><strong>Fizetendő Végösszeg (IFA-val):</strong> ${totalPrice.toLocaleString('hu-HU')} Ft</p>
        <br/>
          <div style="background-color: #fdfaf6; padding: 20px; border: 1px solid #ebdccb; border-radius: 8px;">
          <p style="margin-top: 0;"><strong>Előlegként fizetendő (30%): <span style="color: #c5a880; font-size: 1.15rem;">${deposit.toLocaleString('hu-HU')} Ft</span></strong></p>
          <p style="margin: 4px 0;">Kedvezményezett: <strong>${siteConfig.bank.accountName}</strong></p>
          <p style="margin: 4px 0;">Bank neve: <strong>${siteConfig.bank.bankName}</strong></p>
          <p style="margin: 4px 0;">Bankszámlaszám:</p>
          <p style="font-size: 1.25rem; font-weight: bold; letter-spacing: 1.5px; margin: 8px 0; color: #111;">${siteConfig.bank.accountNumber}</p>
          <p style="margin-bottom: 0; font-size: 0.95rem;">Közlemény rovatba kérjük beírni a nevét és az azonosítót: <strong>${name} - ${bookingId}</strong></p>
        </div>
        <br/>
        <p>Amint az előleg megérkezik, azonnal elküldjük a végleges visszaigazolást!</p>
        <p>Szeretettel várjuk!</p>
        <br/>
        <p>Üdvözlettel,<br/>${siteConfig.name} Csapata</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"${siteConfig.name}" <${user}>`,
      to: email,
      subject: `Foglalási Igény Visszaigazolás - ${siteConfig.shortName}`,
      html: guestHtml,
      attachments: emailAttachments
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
