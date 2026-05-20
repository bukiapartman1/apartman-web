import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import path from 'path';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { type, name, email, phone, comment, startDate, endDate, nights, totalPrice, paidAmount, bookingId } = data;

    const user = process.env.GMAIL_USER || 'bukiapartman1@gmail.com';
    const pass = process.env.GMAIL_PASS;

    if (!pass) {
      console.log('--- E-MAIL SZIMULÁCIÓ (Nincs GMAIL_PASS) ---');
      console.log('Típus:', type);
      console.log('Címzett:', email);
      console.log('--------------------------------------------');
      await new Promise(resolve => setTimeout(resolve, 1000));
      return NextResponse.json({ success: true, simulated: true });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass }
    });

    const headerImagePath = path.join(process.cwd(), 'public', 'images', 'email', 'email-header.png');
    const emailAttachments = [
      {
        filename: 'email-header.png',
        path: headerImagePath,
        cid: 'emailHeader'
      }
    ];

    if (type === 'PAYMENT') {
      // Fizetés visszaigazoló e-mail (Admin küldi)
      const remaining = totalPrice - paidAmount;
      
      const paymentHtml = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="cid:emailHeader" alt="Premium Apartman" style="width: 100%; max-width: 600px; height: auto; border-radius: 8px;" />
          </div>
          <h2 style="color: #2e7d32;">Fizetés Visszaigazolása</h2>
          <p>Kedves ${name}!</p>
          <p>Örömmel értesítjük, hogy foglalását véglegesítettük, az utalás megérkezett a számlánkra.</p>
          <br/>
          <h3>A foglalás adatai:</h3>
          <p><strong>Érkezés:</strong> ${startDate} (14:00-tól)</p>
          <p><strong>Távozás:</strong> ${endDate} (10:00-ig)</p>
          <p><strong>Időtartam:</strong> ${nights} éjszaka</p>
          <br/>
          <h3>Pénzügyi összesítő:</h3>
          <p><strong>Teljes költség:</strong> ${totalPrice.toLocaleString('hu-HU')} Ft</p>
          <p><strong>Ebből befizetve:</strong> ${paidAmount.toLocaleString('hu-HU')} Ft</p>
          <p>A szálláson fizetendő még:</strong> ${remaining > 0 ? remaining.toLocaleString('hu-HU') + ' Ft' : '0 Ft (Teljesen kifizetve)'}</p>
          <br/>
          <h3>Fontos információk / Házirend:</h3>
          <ul>
            <li>Az apartmant az érkezés napján <strong>14:00</strong> órától lehet elfoglalni.</li>
            <li>Távozás napján kérjük az apartmant legkésőbb <strong>10:00</strong> óráig elhagyni.</li>
            <li>Az apartmanon belül tilos a dohányzás! Dohányozni csak az arra kijelölt helyen (terasz) lehet.</li>
            <li>Kérjük a csendrendelet betartását 22:00 és 08:00 között a szomszédok nyugalmának érdekében.</li>
            <li>Háziállatok behozatalára nincs lehetőség.</li>
          </ul>
          <br/>
          <p>Várjuk szeretettel!</p>
          <p>Üdvözlettel,<br/>Premium Apartman Csapata</p>
        </div>
      `;

      await transporter.sendMail({
        from: `"Premium Apartman" <${user}>`,
        to: email,
        subject: `Foglalás Véglegesítve - Premium Apartman`,
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
            <img src="cid:emailHeader" alt="Premium Apartman" style="width: 100%; max-width: 600px; height: auto; border-radius: 8px;" />
          </div>
          <h2 style="color: #d32f2f;">Fizetési Emlékeztető - Premium Apartman</h2>
          <p>Kedves ${name}!</p>
          <p>Szeretnénk felhívni figyelmét, hogy a <strong>${startDate} és ${endDate}</strong> közötti időszakra szóló foglalásához tartozó előleg (${deposit.toLocaleString('hu-HU')} Ft) a mai napig nem érkezett meg a bankszámlánkra.</p>
          <p>Kérjük, hogy legkésőbb a következő <strong>48 órán belül</strong> gondoskodjon az átutalásról, ellenkező esetben foglalása automatikusan törlésre kerül a rendszerünkből.</p>
          <br/>
          <div style="background-color: #fce4e4; padding: 15px; border-left: 4px solid #d32f2f;">
            <p><strong>Utalandó összeg: ${deposit.toLocaleString('hu-HU')} Ft</strong></p>
            <p>Bankszámlaszám (OTP Bank):</p>
            <p style="font-size: 1.2rem; font-weight: bold; letter-spacing: 2px;">12345678-00000000</p>
            <p>Közlemény rovatba kérjük beírni: <em>${name} - ${bookingId || ''}</em></p>
          </div>
          <p>Amennyiben időközben az utalást elindította, kérjük, tekintse tárgytalannak ezt a levelet, vagy vegye fel velünk a kapcsolatot telefonon!</p>
          <br/>
          <p>Üdvözlettel,<br/>Premium Apartman Csapata</p>
        </div>
      `;

      await transporter.sendMail({
        from: `"Premium Apartman" <${user}>`,
        to: email,
        subject: `Fizetési Emlékeztető (Kezelést igényel) - Premium Apartman`,
        html: reminderHtml,
        attachments: emailAttachments
      });

      return NextResponse.json({ success: true });
    }

    // Alapértelmezett: Új foglalás e-mail
    const deposit = Math.round(totalPrice * 0.3);

    const adminHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #c5a880;">Új Foglalás Érkezett!</h2>
        <p><strong>Foglalási Azonosító:</strong> ${bookingId}</p>
        <p><strong>Név:</strong> ${name}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        <p><strong>Telefon:</strong> ${phone}</p>
        <br/>
        <h3>Foglalás részletei:</h3>
        <p><strong>Érkezés:</strong> ${startDate}</p>
        <p><strong>Távozás:</strong> ${endDate}</p>
        <p><strong>Időtartam:</strong> ${nights} éjszaka</p>
        <p><strong>Végösszeg:</strong> ${totalPrice.toLocaleString('hu-HU')} Ft</p>
        <p><strong>Megjegyzés:</strong><br/> ${comment || 'Nincs megjegyzés.'}</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Premium Apartman" <${user}>`,
      to: user,
      subject: `Új foglalás: ${name} (${startDate} - ${endDate})`,
      html: adminHtml
    });

    const guestHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="cid:emailHeader" alt="Premium Apartman" style="width: 100%; max-width: 600px; height: auto; border-radius: 8px;" />
        </div>
        <h2 style="color: #c5a880;">Kedves ${name}!</h2>
        <p>Köszönjük, hogy a Premium Apartmant választotta! A foglalási igényét sikeresen rögzítettük.</p>
        <p><strong>Foglalása akkor kerül véglegesítésre, hogyha az előleg, vagy a teljes összeg a számlánkra átutalással megérkezik. (max 2 munkanap)</strong></p>
        <br/>
        <h3>Az Ön foglalásának részletei:</h3>
        <p><strong>Érkezés:</strong> ${startDate} (14:00-tól)</p>
        <p><strong>Távozás:</strong> ${endDate} (10:00-ig)</p>
        <p><strong>Időtartam:</strong> ${nights} éjszaka</p>
        <p><strong>Fizetendő Végösszeg:</strong> ${totalPrice.toLocaleString('hu-HU')} Ft</p>
        <br/>
        <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #c5a880;">
          <p><strong>Előlegként minimálisan fizetendő: ${deposit.toLocaleString('hu-HU')} Ft</strong></p>
          <p>Az összeget az alábbi OTP Banknál vezetett számlaszámra utalja:</p>
          <p style="font-size: 1.2rem; font-weight: bold; letter-spacing: 2px;">12345678-00000000</p>
          <p>Közlemény rovatba kérjük beírni a foglaló nevét és az azonosítót: <strong>${name} - ${bookingId}</strong></p>
        </div>
        <p>Ha a befizetés megérkezett, akkor újabb emailben értesítjük!</p>
        <br/>
        <p>Üdvözlettel,<br/>Premium Apartman Csapata</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Premium Apartman" <${user}>`,
      to: email,
      subject: `Foglalás Visszaigazolás - Premium Apartman`,
      html: guestHtml,
      attachments: emailAttachments
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
