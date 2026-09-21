import { siteConfig } from './siteConfig';

// Helper to format currency
const formatPrice = (amount: number) => {
  return amount.toLocaleString('hu-HU') + ' Ft';
};

// Base HTML container with email client compatibility & fluid responsive styling
function wrapEmailHtml({
  preheader,
  headerTitle,
  headerBadge,
  badgeBg = '#c5a880',
  badgeColor = '#ffffff',
  contentHtml,
  adminActionHtml,
}: {
  preheader?: string;
  headerTitle: string;
  headerBadge?: string;
  badgeBg?: string;
  badgeColor?: string;
  contentHtml: string;
  adminActionHtml?: string;
}) {
  return `<!DOCTYPE html>
<html lang="hu" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>${headerTitle}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    * {
      box-sizing: border-box;
    }
    body, html {
      margin: 0 !important;
      padding: 0 !important;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
      background-color: #f4f1ea;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #2d3748;
      line-height: 1.5;
    }
    table, td {
      border-collapse: collapse !important;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    img {
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
      -ms-interpolation-mode: bicubic;
    }
    a {
      text-decoration: none;
    }
    .email-btn {
      display: block !important;
      width: 100% !important;
      text-align: center !important;
      box-sizing: border-box !important;
      padding: 13px 16px !important;
      border-radius: 8px !important;
      font-weight: 600 !important;
      font-size: 14px !important;
      margin-bottom: 8px !important;
    }
    @media only screen and (max-width: 600px) {
      .email-container-padding {
        padding: 16px 14px !important;
      }
      .email-header-padding {
        padding: 16px 14px 12px !important;
      }
      .email-title {
        font-size: 19px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 12px 6px; background-color: #f4f1ea; width: 100% !important;">
  ${preheader ? `<div style="display: none; font-size: 1px; color: #f4f1ea; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">${preheader}</div>` : ''}

  <!-- Outer Centering Table -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f1ea;">
    <tr>
      <td align="center" style="padding: 0;">
        <!--[if (gte mso 9)|(IE)]>
        <table role="presentation" width="580" align="center" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td>
        <![endif]-->
        
        <!-- Main Card Wrapper -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06); border: 1px solid #e7ded5; word-break: break-word;">
          
          <!-- Header Banner Image -->
          <tr>
            <td align="center" style="background-color: #1a1a1a; padding: 0;">
              <img src="cid:emailHeader" alt="${siteConfig.name}" width="580" style="width: 100%; max-width: 580px; height: auto; display: block; border: 0;" />
            </td>
          </tr>

          <!-- Header Title & Badge -->
          <tr>
            <td class="email-header-padding" style="padding: 22px 24px 14px; border-bottom: 1px solid #f0e9e1; background-color: #ffffff;">
              ${headerBadge ? `
              <div style="margin-bottom: 8px;">
                <span style="display: inline-block; background-color: ${badgeBg}; color: ${badgeColor}; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; padding: 4px 10px; border-radius: 16px; text-transform: uppercase;">
                  ${headerBadge}
                </span>
              </div>
              ` : ''}
              <h1 class="email-title" style="margin: 0; font-size: 21px; font-weight: 700; color: #1a202c; line-height: 1.3;">
                ${headerTitle}
              </h1>
              <p style="margin: 4px 0 0 0; font-size: 12px; color: #718096;">
                ${siteConfig.name} &bull; Értesítési rendszer
              </p>
            </td>
          </tr>

          <!-- Body Content Area -->
          <tr>
            <td class="email-container-padding" style="padding: 20px 24px;">
              ${contentHtml}

              ${adminActionHtml ? `
                <div style="margin-top: 24px; padding-top: 18px; border-top: 1px dashed #e2d9cd;">
                  ${adminActionHtml}
                </div>
              ` : ''}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 18px 20px; background-color: #faf7f2; border-top: 1px solid #ede5dc; text-align: center; font-size: 12px; color: #8c827a; line-height: 1.4;">
              <p style="margin: 0 0 4px 0; font-weight: 700; color: #5a5048; font-size: 13px;">
                ${siteConfig.name}
              </p>
              <p style="margin: 0 0 4px 0;">
                ${siteConfig.contact.address} &bull; ${siteConfig.contact.phone}
              </p>
              <p style="margin: 0 0 4px 0;">
                <a href="mailto:${siteConfig.contact.email}" style="color: #9c7b50; text-decoration: none; font-weight: 600;">${siteConfig.contact.email}</a>
              </p>
              <p style="margin: 0; font-size: 11px; color: #a99f97;">
                NTAK: ${siteConfig.contact.ntak}
              </p>
            </td>
          </tr>

        </table>

        <!--[if (gte mso 9)|(IE)]>
            </td>
          </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// -------------------------------------------------------------
// 1. TULAJDONOSI ÉRTESÍTŐ: Kapcsolatfelvétel (Contact Form)
// -------------------------------------------------------------
export function renderAdminContactEmail({
  name,
  email,
  phone,
  comment,
}: {
  name: string;
  email: string;
  phone?: string;
  comment: string;
}) {
  const contentHtml = `
    <!-- Contact Info Card -->
    <div style="background-color: #fcfbfa; border: 1px solid #ebdccb; border-radius: 8px; padding: 14px 16px; margin-bottom: 18px;">
      <h3 style="margin: 0 0 10px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #9c7b50; font-weight: 700;">
        Üzenetküldő Adatai
      </h3>
      
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="table-layout: fixed; width: 100%;">
        <tr>
          <td style="padding: 5px 0; font-size: 13px; color: #718096; width: 100px; vertical-align: top;">Név:</td>
          <td style="padding: 5px 0; font-size: 14px; color: #1a202c; font-weight: 700; vertical-align: top; word-break: break-word;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; font-size: 13px; color: #718096; vertical-align: top;">E-mail:</td>
          <td style="padding: 5px 0; font-size: 14px; color: #1a202c; vertical-align: top; word-break: break-word;">
            <a href="mailto:${email}" style="color: #9c7b50; text-decoration: none; font-weight: 600;">${email}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 5px 0; font-size: 13px; color: #718096; vertical-align: top;">Telefon:</td>
          <td style="padding: 5px 0; font-size: 14px; color: #1a202c; vertical-align: top; word-break: break-word;">
            ${phone ? `<a href="tel:${phone}" style="color: #2d3748; text-decoration: none; font-weight: 600;">${phone}</a>` : '<span style="color: #a0aec0; font-style: italic;">Nincs megadva</span>'}
          </td>
        </tr>
      </table>
    </div>

    <!-- Message Body -->
    <div style="margin-bottom: 6px;">
      <h3 style="margin: 0 0 8px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #4a5568; font-weight: 700;">
        Üzenet Szövege:
      </h3>
      <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-left: 4px solid #c5a880; border-radius: 6px; padding: 14px 16px; font-size: 14px; line-height: 1.6; color: #2d3748; word-break: break-word; white-space: pre-wrap;">${comment}</div>
    </div>
  `;

  // Full width action buttons stacked for mobile & desktop friendliness
  const adminActionHtml = `
    <div>
      <a href="mailto:${email}?subject=Re:%20Kapcsolatfelvétel%20-%20${encodeURIComponent(siteConfig.name)}" class="email-btn" style="display: block; width: 100%; box-sizing: border-box; text-align: center; background-color: #c5a880; color: #ffffff; font-size: 14px; font-weight: 700; text-decoration: none; padding: 13px 16px; border-radius: 8px; margin-bottom: 8px;">
        ✉️ Válasz küldése e-mailben
      </a>
      ${phone ? `
        <a href="tel:${phone}" class="email-btn" style="display: block; width: 100%; box-sizing: border-box; text-align: center; background-color: #edf2f7; color: #2d3748; font-size: 14px; font-weight: 700; text-decoration: none; padding: 13px 16px; border-radius: 8px;">
          📞 Hívás indítása (${phone})
        </a>
      ` : ''}
    </div>
  `;

  return wrapEmailHtml({
    preheader: `Új üzenet érkezett: ${name} (${email})`,
    headerBadge: '📩 Kapcsolatfelvétel',
    badgeBg: '#eef2f6',
    badgeColor: '#2b4c7e',
    headerTitle: `Új üzenet: ${name}`,
    contentHtml,
    adminActionHtml,
  });
}

// -------------------------------------------------------------
// 2. TULAJDONOSI ÉRTESÍTŐ: Új Foglalás (Barion Fizetve VAGY Átutalás)
// -------------------------------------------------------------
export function renderAdminBookingEmail({
  bookingId,
  name,
  email,
  phone,
  adults,
  children,
  startDate,
  endDate,
  nights,
  totalPrice,
  paidAmount,
  paymentMethod,
  comment,
}: {
  bookingId: string;
  name: string;
  email: string;
  phone?: string;
  adults?: number;
  children?: number;
  startDate: string;
  endDate: string;
  nights: number;
  totalPrice: number;
  paidAmount?: number;
  paymentMethod: 'BARION' | 'TRANSFER';
  comment?: string;
}) {
  const isBarion = paymentMethod === 'BARION';
  const actualPaid = isBarion ? (paidAmount || Math.round(totalPrice * 0.3)) : 0;
  const deposit = Math.round(totalPrice * 0.3);
  const remaining = isBarion ? (totalPrice - actualPaid) : (totalPrice - deposit);
  const guestCountText = `${adults || 2} felnőtt${children ? `, ${children} gyermek` : ''}`;

  const headerBadge = isBarion
    ? '🟢 SIKERES ONLINE FIZETÉS (BARION)'
    : '⏳ ÚJ FOGLALÁSI IGÉNY (ÁTUTALÁS)';
  const badgeBg = isBarion ? '#e8f5e9' : '#fff4e5';
  const badgeColor = isBarion ? '#1b5e20' : '#8c5500';
  const headerTitle = isBarion
    ? `Új Foglalás (Barion): ${name}`
    : `Új Foglalási Igény: ${name}`;

  const contentHtml = `
    <!-- Top summary bar -->
    <div style="background-color: ${isBarion ? '#f0fdf4' : '#fffbeb'}; border: 1px solid ${isBarion ? '#bbf7d0' : '#fde68a'}; border-radius: 8px; padding: 12px 14px; margin-bottom: 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="table-layout: fixed; width: 100%;">
        <tr>
          <td style="font-size: 13px; color: ${isBarion ? '#166534' : '#92400e'};">
            <strong>Foglalási Azonosító:</strong> <span style="font-family: monospace; font-size: 13px; background: #ffffff; padding: 2px 6px; border-radius: 4px; border: 1px solid #e2e8f0; font-weight: bold; color: #1a202c;">#${bookingId}</span>
          </td>
        </tr>
        <tr>
          <td style="font-size: 12px; color: ${isBarion ? '#166534' : '#92400e'}; font-weight: 600; padding-top: 4px;">
            ${isBarion ? '✓ Bankkártyás fizetés Barionnal jóváhagyva' : '⏳ 30% előleg átutalásra vár (3 munkanap)'}
          </td>
        </tr>
      </table>
    </div>

    <!-- Hybrid 2-Column Section (Fluid & Stackable) -->
    <!--[if (gte mso 9)|(IE)]>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 16px;">
      <tr>
        <td width="260" valign="top">
    <![endif]-->
    <div style="display: inline-block; width: 100%; max-width: 260px; vertical-align: top; margin-bottom: 12px; box-sizing: border-box;">
      <div style="background-color: #faf8f5; border: 1px solid #ede4db; border-radius: 8px; padding: 14px 14px;">
        <h3 style="margin: 0 0 10px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #9c7b50; font-weight: 700;">
          👤 Vendég Adatai
        </h3>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="table-layout: fixed; width: 100%;">
          <tr>
            <td style="padding: 3px 0; font-size: 12px; color: #718096; width: 65px;">Név:</td>
            <td style="padding: 3px 0; font-size: 13px; font-weight: 700; color: #1a202c; word-break: break-word;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 3px 0; font-size: 12px; color: #718096;">E-mail:</td>
            <td style="padding: 3px 0; font-size: 13px; word-break: break-word;">
              <a href="mailto:${email}" style="color: #9c7b50; text-decoration: none; font-weight: 600;">${email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 3px 0; font-size: 12px; color: #718096;">Telefon:</td>
            <td style="padding: 3px 0; font-size: 13px; word-break: break-word;">
              ${phone ? `<a href="tel:${phone}" style="color: #1a202c; text-decoration: none; font-weight: 600;">${phone}</a>` : '<span style="color: #a0aec0; font-style: italic;">Nincs</span>'}
            </td>
          </tr>
          <tr>
            <td style="padding: 3px 0; font-size: 12px; color: #718096;">Vendégek:</td>
            <td style="padding: 3px 0; font-size: 13px; font-weight: 600; color: #1a202c;">${guestCountText}</td>
          </tr>
        </table>
      </div>
    </div>
    <!--[if (gte mso 9)|(IE)]>
        </td>
        <td width="12"></td>
        <td width="260" valign="top">
    <![endif]-->
    <div style="display: inline-block; width: 100%; max-width: 260px; vertical-align: top; margin-bottom: 12px; box-sizing: border-box;">
      <div style="background-color: #faf8f5; border: 1px solid #ede4db; border-radius: 8px; padding: 14px 14px;">
        <h3 style="margin: 0 0 10px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #9c7b50; font-weight: 700;">
          📅 Foglalás Részletei
        </h3>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="table-layout: fixed; width: 100%;">
          <tr>
            <td style="padding: 3px 0; font-size: 12px; color: #718096; width: 65px;">Érkezés:</td>
            <td style="padding: 3px 0; font-size: 13px; font-weight: 700; color: #1a202c;">${startDate}</td>
          </tr>
          <tr>
            <td style="padding: 3px 0; font-size: 12px; color: #718096;">Távozás:</td>
            <td style="padding: 3px 0; font-size: 13px; font-weight: 700; color: #1a202c;">${endDate}</td>
          </tr>
          <tr>
            <td style="padding: 3px 0; font-size: 12px; color: #718096;">Időtartam:</td>
            <td style="padding: 3px 0; font-size: 13px; font-weight: 600; color: #1a202c;">${nights} éjszaka</td>
          </tr>
          <tr>
            <td style="padding: 3px 0; font-size: 12px; color: #718096;">Fizetés:</td>
            <td style="padding: 3px 0; font-size: 13px; font-weight: 700; color: ${isBarion ? '#166534' : '#8c5500'};">
              ${isBarion ? 'Barion Online' : 'Banki átutalás'}
            </td>
          </tr>
        </table>
      </div>
    </div>
    <!--[if (gte mso 9)|(IE)]>
        </td>
      </tr>
    </table>
    <![endif]-->

    <!-- Financial Breakdown Card -->
    <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 16px; margin-bottom: 16px;">
      <h3 style="margin: 0 0 10px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #4a5568; font-weight: 700;">
        💳 Pénzügyi Összesítő
      </h3>
      
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="table-layout: fixed; width: 100%;">
        <tr>
          <td style="padding: 5px 0; font-size: 13px; color: #4a5568;">Foglalás végösszege (IFA-val):</td>
          <td align="right" style="padding: 5px 0; font-size: 14px; font-weight: 700; color: #1a202c;">${formatPrice(totalPrice)}</td>
        </tr>

        ${isBarion ? `
          <tr style="border-top: 1px solid #f0f4f8;">
            <td style="padding: 7px 0; font-size: 13px; color: #166534; font-weight: 700;">
              ✓ Online kifizetve (Barion):
            </td>
            <td align="right" style="padding: 7px 0; font-size: 15px; font-weight: 700; color: #166534;">
              ${formatPrice(actualPaid)}
            </td>
          </tr>
          <tr style="border-top: 1px solid #f0f4f8;">
            <td style="padding: 5px 0; font-size: 12px; color: #718096;">
              Helyszínen érkezéskor fizetendő:
            </td>
            <td align="right" style="padding: 5px 0; font-size: 13px; font-weight: 700; color: ${remaining > 0 ? '#1a202c' : '#166534'};">
              ${remaining > 0 ? formatPrice(remaining) : '0 Ft (Teljesen rendezve)'}
            </td>
          </tr>
        ` : `
          <tr style="border-top: 1px solid #f0f4f8;">
            <td style="padding: 7px 0; font-size: 13px; color: #92400e; font-weight: 700;">
              ⏳ 30% előleg (3 munkanapon belül):
            </td>
            <td align="right" style="padding: 7px 0; font-size: 15px; font-weight: 700; color: #92400e;">
              ${formatPrice(deposit)}
            </td>
          </tr>
          <tr style="border-top: 1px solid #f0f4f8;">
            <td style="padding: 5px 0; font-size: 12px; color: #718096;">
              Fennmaradó összeg érkezéskor fizetendő:
            </td>
            <td align="right" style="padding: 5px 0; font-size: 13px; font-weight: 700; color: #1a202c;">
              ${formatPrice(remaining)}
            </td>
          </tr>
        `}
      </table>
    </div>

    <!-- Guest Comment (if provided) -->
    ${comment ? `
      <div style="background-color: #fcfbfa; border: 1px solid #ebdccb; border-radius: 8px; padding: 12px 14px; margin-bottom: 16px;">
        <p style="margin: 0 0 4px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #9c7b50; font-weight: 700;">
          💬 Vendég Megjegyzése:
        </p>
        <p style="margin: 0; font-size: 13px; color: #2d3748; line-height: 1.5; word-break: break-word; white-space: pre-wrap;">${comment}</p>
      </div>
    ` : ''}
  `;

  const adminUrl = `${siteConfig.url}/admin/bookings`;

  // Stacked touch-friendly full-width buttons
  const adminActionHtml = `
    <div>
      <a href="${adminUrl}" class="email-btn" style="display: block; width: 100%; box-sizing: border-box; text-align: center; background-color: #2d3748; color: #ffffff; font-size: 14px; font-weight: 700; text-decoration: none; padding: 13px 16px; border-radius: 8px; margin-bottom: 8px;">
        📊 Admin Foglalások Megnyitása
      </a>
      <a href="mailto:${email}?subject=Re:%20Foglalás%20visszaigazolás%20-%20${bookingId}" class="email-btn" style="display: block; width: 100%; box-sizing: border-box; text-align: center; background-color: #c5a880; color: #ffffff; font-size: 14px; font-weight: 700; text-decoration: none; padding: 13px 16px; border-radius: 8px; margin-bottom: 8px;">
        ✉️ E-mail küldése a vendégnek
      </a>
      ${phone ? `
        <a href="tel:${phone}" class="email-btn" style="display: block; width: 100%; box-sizing: border-box; text-align: center; background-color: #edf2f7; color: #2d3748; font-size: 14px; font-weight: 700; text-decoration: none; padding: 13px 16px; border-radius: 8px;">
          📞 Hívás indítása (${phone})
        </a>
      ` : ''}
    </div>
  `;

  return wrapEmailHtml({
    preheader: `${headerTitle} - ${startDate} - ${endDate} (#${bookingId})`,
    headerBadge,
    badgeBg,
    badgeColor,
    headerTitle,
    contentHtml,
    adminActionHtml,
  });
}

// -------------------------------------------------------------
// 3. VENDÉG ÉRTESÍTŐ: Barion Sikeres Foglalás & Fizetés
// -------------------------------------------------------------
export function renderGuestBarionSuccessEmail({
  bookingId,
  name,
  adults,
  children,
  startDate,
  endDate,
  nights,
  totalPrice,
  paidAmount,
}: {
  bookingId: string;
  name: string;
  adults?: number;
  children?: number;
  startDate: string;
  endDate: string;
  nights: number;
  totalPrice: number;
  paidAmount?: number;
}) {
  const actualPaid = paidAmount || Math.round(totalPrice * 0.3);
  const remaining = totalPrice - actualPaid;
  const guestCountText = `${adults || 2} felnőtt${children ? `, ${children} gyermek` : ''}`;

  const contentHtml = `
    <h2 style="margin: 0 0 10px 0; font-size: 17px; color: #2e7d32; font-weight: 700;">
      Kedves ${name}!
    </h2>
    <p style="margin: 0 0 14px 0; font-size: 14px; color: #4a5568; line-height: 1.6;">
      Köszönjük, hogy a <strong>${siteConfig.name}</strong>-t választotta! Online bankkártyás fizetése a Barion rendszerén keresztül sikeresen megtörtént, így foglalását véglegesítettük és garantáltuk.
    </p>
    <div style="background-color: #f0fdf4; border-left: 4px solid #2e7d32; padding: 10px 14px; border-radius: 4px; margin-bottom: 18px; font-size: 13px; color: #166534; font-weight: 600;">
      ✓ Önnek jelenleg semmilyen további átutalási teendője nincs!
    </div>

    <!-- Hybrid 2-Column Section -->
    <!--[if (gte mso 9)|(IE)]>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 16px;">
      <tr>
        <td width="260" valign="top">
    <![endif]-->
    <div style="display: inline-block; width: 100%; max-width: 260px; vertical-align: top; margin-bottom: 12px; box-sizing: border-box;">
      <div style="background-color: #faf8f5; border: 1px solid #ede4db; border-radius: 8px; padding: 14px 14px;">
        <h3 style="margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #9c7b50; font-weight: 700;">
          Foglalás Adatai
        </h3>
        <p style="margin: 4px 0; font-size: 13px; color: #2d3748;"><strong>Azonosító:</strong> #${bookingId}</p>
        <p style="margin: 4px 0; font-size: 13px; color: #2d3748;"><strong>Vendégek:</strong> ${guestCountText}</p>
        <p style="margin: 4px 0; font-size: 13px; color: #2d3748;"><strong>Időtartam:</strong> ${nights} éjszaka</p>
      </div>
    </div>
    <!--[if (gte mso 9)|(IE)]>
        </td>
        <td width="12"></td>
        <td width="260" valign="top">
    <![endif]-->
    <div style="display: inline-block; width: 100%; max-width: 260px; vertical-align: top; margin-bottom: 12px; box-sizing: border-box;">
      <div style="background-color: #faf8f5; border: 1px solid #ede4db; border-radius: 8px; padding: 14px 14px;">
        <h3 style="margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #9c7b50; font-weight: 700;">
          Időpontok
        </h3>
        <p style="margin: 4px 0; font-size: 13px; color: #2d3748;"><strong>Érkezés:</strong> ${startDate} <span style="color:#718096; font-size: 12px;">(14:00-tól)</span></p>
        <p style="margin: 4px 0; font-size: 13px; color: #2d3748;"><strong>Távozás:</strong> ${endDate} <span style="color:#718096; font-size: 12px;">(10:00-ig)</span></p>
      </div>
    </div>
    <!--[if (gte mso 9)|(IE)]>
        </td>
      </tr>
    </table>
    <![endif]-->

    <!-- Financial Breakdown -->
    <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 16px; margin-bottom: 18px;">
      <h3 style="margin: 0 0 10px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #4a5568; font-weight: 700;">
        Pénzügyi Összesítő
      </h3>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="table-layout: fixed; width: 100%;">
        <tr>
          <td style="padding: 4px 0; font-size: 13px; color: #4a5568;">Végösszeg (IFA-val együtt):</td>
          <td align="right" style="padding: 4px 0; font-size: 14px; font-weight: 700; color: #1a202c;">${formatPrice(totalPrice)}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; font-size: 13px; color: #2e7d32; font-weight: 700;">Kifizetve bankkártyával (Barion):</td>
          <td align="right" style="padding: 4px 0; font-size: 14px; font-weight: 700; color: #2e7d32;">${formatPrice(actualPaid)}</td>
        </tr>
        <tr style="border-top: 1px solid #edf2f7;">
          <td style="padding: 6px 0 2px; font-size: 12px; color: #718096;">Helyszínen érkezéskor fizetendő:</td>
          <td align="right" style="padding: 6px 0 2px; font-size: 13px; font-weight: 700; color: ${remaining > 0 ? '#1a202c' : '#2e7d32'};">
            ${remaining > 0 ? formatPrice(remaining) : '0 Ft (Teljesen rendezve)'}
          </td>
        </tr>
      </table>
    </div>

    <!-- House Rules & Info -->
    <div style="background-color: #faf7f2; border: 1px solid #ebdccb; border-radius: 8px; padding: 14px 16px; font-size: 13px; line-height: 1.5; color: #4a5568;">
      <h3 style="margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #9c7b50; font-weight: 700;">
        Fontos Információk & Házirend
      </h3>
      <ul style="margin: 0; padding-left: 18px;">
        <li style="margin-bottom: 4px;"><strong>Cím:</strong> ${siteConfig.contact.address}</li>
        <li style="margin-bottom: 4px;">Bejelentkezés: érkezés napján <strong>14:00</strong> órától.</li>
        <li style="margin-bottom: 4px;">Kijelentkezés: távozás napján legkésőbb <strong>10:00</strong> óráig.</li>
        <li style="margin-bottom: 4px;">Díjmentes privát parkolás biztosított az udvarban.</li>
        <li style="margin-bottom: 4px;">Az apartman belső terében tilos a dohányzás (csak teraszon megengedett).</li>
        <li>Csendrendelet érvényes 22:00 és 08:00 óra között.</li>
      </ul>
    </div>
  `;

  return wrapEmailHtml({
    preheader: `Sikeres foglalás és fizetés visszaigazolása - ${siteConfig.shortName} (#${bookingId})`,
    headerBadge: '✓ Véglegesített Foglalás',
    badgeBg: '#e8f5e9',
    badgeColor: '#1b5e20',
    headerTitle: `Sikeres Foglalás és Fizetés!`,
    contentHtml,
  });
}

// -------------------------------------------------------------
// 4. VENDÉG ÉRTESÍTŐ: Átutalásos Foglalási Igény
// -------------------------------------------------------------
export function renderGuestTransferRequestEmail({
  bookingId,
  name,
  adults,
  children,
  startDate,
  endDate,
  nights,
  totalPrice,
  deposit,
}: {
  bookingId: string;
  name: string;
  adults?: number;
  children?: number;
  startDate: string;
  endDate: string;
  nights: number;
  totalPrice: number;
  deposit: number;
}) {
  const guestCountText = `${adults || 2} felnőtt${children ? `, ${children} gyermek` : ''}`;

  const contentHtml = `
    <h2 style="margin: 0 0 10px 0; font-size: 17px; color: #c5a880; font-weight: 700;">
      Kedves ${name}!
    </h2>
    <p style="margin: 0 0 14px 0; font-size: 14px; color: #4a5568; line-height: 1.6;">
      Köszönjük, hogy a <strong>${siteConfig.name}</strong>-t választotta! Foglalási igényét rögzítettük rendszerünkben.
    </p>
    <div style="background-color: #fffbeb; border-left: 4px solid #c5a880; padding: 10px 14px; border-radius: 4px; margin-bottom: 18px; font-size: 13px; color: #92400e; font-weight: 600;">
      ⏳ Foglalása a 30% előleg beérkezése után válik véglegessé (kérjük 3 munkanapon belül elutalni).
    </div>

    <!-- Hybrid 2-Column Section -->
    <!--[if (gte mso 9)|(IE)]>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 16px;">
      <tr>
        <td width="260" valign="top">
    <![endif]-->
    <div style="display: inline-block; width: 100%; max-width: 260px; vertical-align: top; margin-bottom: 12px; box-sizing: border-box;">
      <div style="background-color: #faf8f5; border: 1px solid #ede4db; border-radius: 8px; padding: 14px 14px;">
        <h3 style="margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #9c7b50; font-weight: 700;">
          Foglalás Adatai
        </h3>
        <p style="margin: 4px 0; font-size: 13px; color: #2d3748;"><strong>Azonosító:</strong> #${bookingId}</p>
        <p style="margin: 4px 0; font-size: 13px; color: #2d3748;"><strong>Vendégek:</strong> ${guestCountText}</p>
        <p style="margin: 4px 0; font-size: 13px; color: #2d3748;"><strong>Időtartam:</strong> ${nights} éjszaka</p>
      </div>
    </div>
    <!--[if (gte mso 9)|(IE)]>
        </td>
        <td width="12"></td>
        <td width="260" valign="top">
    <![endif]-->
    <div style="display: inline-block; width: 100%; max-width: 260px; vertical-align: top; margin-bottom: 12px; box-sizing: border-box;">
      <div style="background-color: #faf8f5; border: 1px solid #ede4db; border-radius: 8px; padding: 14px 14px;">
        <h3 style="margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #9c7b50; font-weight: 700;">
          Időpontok
        </h3>
        <p style="margin: 4px 0; font-size: 13px; color: #2d3748;"><strong>Érkezés:</strong> ${startDate} <span style="color:#718096; font-size: 12px;">(14:00-tól)</span></p>
        <p style="margin: 4px 0; font-size: 13px; color: #2d3748;"><strong>Távozás:</strong> ${endDate} <span style="color:#718096; font-size: 12px;">(10:00-ig)</span></p>
      </div>
    </div>
    <!--[if (gte mso 9)|(IE)]>
        </td>
      </tr>
    </table>
    <![endif]-->

    <!-- Bank Details for Transfer Box -->
    <div style="background-color: #fdfaf6; border: 2px solid #c5a880; border-radius: 8px; padding: 16px 16px; margin-bottom: 18px;">
      <h3 style="margin: 0 0 10px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #9c7b50; font-weight: 700;">
        💳 Átutalási Adatok
      </h3>
      
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="table-layout: fixed; width: 100%;">
        <tr>
          <td style="padding: 4px 0; font-size: 13px; color: #718096;">Utalandó előleg (30%):</td>
          <td align="right" style="padding: 4px 0; font-size: 15px; font-weight: 700; color: #c5a880;">${formatPrice(deposit)}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; font-size: 13px; color: #718096;">Kedvezményezett:</td>
          <td align="right" style="padding: 4px 0; font-size: 13px; font-weight: 600; color: #1a202c;">${siteConfig.bank.accountName}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; font-size: 13px; color: #718096;">Bank:</td>
          <td align="right" style="padding: 4px 0; font-size: 13px; font-weight: 600; color: #1a202c;">${siteConfig.bank.bankName}</td>
        </tr>
        <tr>
          <td colspan="2" style="padding: 10px 0 2px 0; font-size: 12px; color: #718096;">Bankszámlaszám:</td>
        </tr>
        <tr>
          <td colspan="2" style="padding: 2px 0 8px 0; font-family: monospace; font-size: 15px; font-weight: 700; letter-spacing: 0.5px; color: #1a202c; word-break: break-all;">
            ${siteConfig.bank.accountNumber}
          </td>
        </tr>
        <tr>
          <td colspan="2" style="padding: 8px 0 0 0; font-size: 12px; color: #718096; border-top: 1px dashed #ebdccb;">
            Közlemény rovatba: <strong>${name} - ${bookingId}</strong>
          </td>
        </tr>
      </table>
    </div>

    <p style="margin: 0; font-size: 13px; color: #4a5568; line-height: 1.5;">
      Amint az előleg beérkezik a számlánkra, azonnal elküldjük Önnek a végleges visszaigazoló e-mailt!
    </p>
  `;

  return wrapEmailHtml({
    preheader: `Foglalási igény visszaigazolás - ${siteConfig.shortName} (#${bookingId})`,
    headerBadge: '⏳ Foglalási Igény Rögzítve',
    badgeBg: '#fff4e5',
    badgeColor: '#8c5500',
    headerTitle: `Foglalási Igény Visszaigazolás`,
    contentHtml,
  });
}

// -------------------------------------------------------------
// 5. VENDÉG ÉRTESÍTŐ: Fizetés Véglegesítve (Payment Confirmed)
// -------------------------------------------------------------
export function renderGuestPaymentConfirmedEmail({
  bookingId,
  name,
  adults,
  children,
  startDate,
  endDate,
  nights,
  totalPrice,
  paidAmount,
}: {
  bookingId: string;
  name: string;
  adults?: number;
  children?: number;
  startDate: string;
  endDate: string;
  nights: number;
  totalPrice: number;
  paidAmount: number;
}) {
  const remaining = totalPrice - paidAmount;
  const guestCountText = `${adults || 2} felnőtt${children ? `, ${children} gyermek` : ''}`;

  const contentHtml = `
    <h2 style="margin: 0 0 10px 0; font-size: 17px; color: #2e7d32; font-weight: 700;">
      Kedves ${name}!
    </h2>
    <p style="margin: 0 0 14px 0; font-size: 14px; color: #4a5568; line-height: 1.6;">
      Örömmel értesítjük, hogy az átutalás megérkezett a bankszámlánkra, így <strong>foglalását véglegesítettük és garantáltuk</strong>!
    </p>

    <!-- Hybrid 2-Column Section -->
    <!--[if (gte mso 9)|(IE)]>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 16px;">
      <tr>
        <td width="260" valign="top">
    <![endif]-->
    <div style="display: inline-block; width: 100%; max-width: 260px; vertical-align: top; margin-bottom: 12px; box-sizing: border-box;">
      <div style="background-color: #faf8f5; border: 1px solid #ede4db; border-radius: 8px; padding: 14px 14px;">
        <h3 style="margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #9c7b50; font-weight: 700;">
          Foglalás Adatai
        </h3>
        <p style="margin: 4px 0; font-size: 13px; color: #2d3748;"><strong>Azonosító:</strong> #${bookingId}</p>
        <p style="margin: 4px 0; font-size: 13px; color: #2d3748;"><strong>Vendégek:</strong> ${guestCountText}</p>
        <p style="margin: 4px 0; font-size: 13px; color: #2d3748;"><strong>Időtartam:</strong> ${nights} éjszaka</p>
      </div>
    </div>
    <!--[if (gte mso 9)|(IE)]>
        </td>
        <td width="12"></td>
        <td width="260" valign="top">
    <![endif]-->
    <div style="display: inline-block; width: 100%; max-width: 260px; vertical-align: top; margin-bottom: 12px; box-sizing: border-box;">
      <div style="background-color: #faf8f5; border: 1px solid #ede4db; border-radius: 8px; padding: 14px 14px;">
        <h3 style="margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #9c7b50; font-weight: 700;">
          Időpontok
        </h3>
        <p style="margin: 4px 0; font-size: 13px; color: #2d3748;"><strong>Érkezés:</strong> ${startDate} <span style="color:#718096; font-size: 12px;">(14:00-tól)</span></p>
        <p style="margin: 4px 0; font-size: 13px; color: #2d3748;"><strong>Távozás:</strong> ${endDate} <span style="color:#718096; font-size: 12px;">(10:00-ig)</span></p>
      </div>
    </div>
    <!--[if (gte mso 9)|(IE)]>
        </td>
      </tr>
    </table>
    <![endif]-->

    <!-- Financial Card -->
    <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 16px; margin-bottom: 18px;">
      <h3 style="margin: 0 0 10px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #4a5568; font-weight: 700;">
        Pénzügyi Összesítő
      </h3>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="table-layout: fixed; width: 100%;">
        <tr>
          <td style="padding: 4px 0; font-size: 13px; color: #4a5568;">Teljes költség (IFA-val):</td>
          <td align="right" style="padding: 4px 0; font-size: 14px; font-weight: 700; color: #1a202c;">${formatPrice(totalPrice)}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; font-size: 13px; color: #2e7d32; font-weight: 700;">Befizetett összeg:</td>
          <td align="right" style="padding: 4px 0; font-size: 14px; font-weight: 700; color: #2e7d32;">${formatPrice(paidAmount)}</td>
        </tr>
        <tr style="border-top: 1px solid #edf2f7;">
          <td style="padding: 6px 0 2px; font-size: 12px; color: #718096;">Helyszínen érkezéskor fizetendő még:</td>
          <td align="right" style="padding: 6px 0 2px; font-size: 13px; font-weight: 700; color: ${remaining > 0 ? '#1a202c' : '#2e7d32'};">
            ${remaining > 0 ? formatPrice(remaining) : '0 Ft (Teljesen kifizetve)'}
          </td>
        </tr>
      </table>
    </div>

    <!-- House Rules -->
    <div style="background-color: #faf7f2; border: 1px solid #ebdccb; border-radius: 8px; padding: 14px 16px; font-size: 13px; line-height: 1.5; color: #4a5568;">
      <p style="margin: 0 0 4px 0; font-weight: 700; color: #9c7b50;">Cím: ${siteConfig.contact.address}</p>
      <p style="margin: 0;">Bejelentkezés 14:00 órától &bull; Kijelentkezés 10:00 óráig</p>
    </div>
  `;

  return wrapEmailHtml({
    preheader: `Foglalás véglegesítve - ${siteConfig.shortName} (#${bookingId})`,
    headerBadge: '✓ Véglegesítve',
    badgeBg: '#e8f5e9',
    badgeColor: '#1b5e20',
    headerTitle: `Fizetés Jóváhagyva & Foglalás Véglegesítve`,
    contentHtml,
  });
}

// -------------------------------------------------------------
// 6. VENDÉG ÉRTESÍTŐ: Fizetési Emlékeztető (Reminder)
// -------------------------------------------------------------
export function renderGuestPaymentReminderEmail({
  bookingId,
  name,
  startDate,
  endDate,
  totalPrice,
  deposit,
}: {
  bookingId: string;
  name: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  deposit: number;
}) {
  const contentHtml = `
    <h2 style="margin: 0 0 10px 0; font-size: 17px; color: #d32f2f; font-weight: 700;">
      Kedves ${name}!
    </h2>
    <p style="margin: 0 0 14px 0; font-size: 14px; color: #4a5568; line-height: 1.6;">
      Szeretnénk felhívni figyelmét, hogy a <strong>${startDate} és ${endDate}</strong> közötti időszakra szóló foglalásához (#${bookingId}) tartozó előleg (<strong>${formatPrice(deposit)}</strong>) még nem érkezett meg a bankszámlánkra.
    </p>
    <div style="background-color: #fdf2f2; border-left: 4px solid #d32f2f; padding: 10px 14px; border-radius: 4px; margin-bottom: 18px; font-size: 13px; color: #b91c1c; font-weight: 600;">
      ⚠️ Kérjük, hogy legkésőbb <strong>48 órán belül</strong> gondoskodjon az átutalásról, ellenkező esetben foglalása törlésre kerülhet.
    </div>

    <!-- Bank Details for Transfer Box -->
    <div style="background-color: #fdfaf6; border: 1px solid #ebdccb; border-radius: 8px; padding: 14px 16px; margin-bottom: 16px;">
      <h3 style="margin: 0 0 10px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #9c7b50; font-weight: 700;">
        💳 Átutalási Adatok
      </h3>
      
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="table-layout: fixed; width: 100%;">
        <tr>
          <td style="padding: 4px 0; font-size: 13px; color: #718096;">Utalandó előleg:</td>
          <td align="right" style="padding: 4px 0; font-size: 15px; font-weight: 700; color: #d32f2f;">${formatPrice(deposit)}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; font-size: 13px; color: #718096;">Kedvezményezett:</td>
          <td align="right" style="padding: 4px 0; font-size: 13px; font-weight: 600; color: #1a202c;">${siteConfig.bank.accountName}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; font-size: 13px; color: #718096;">Bank:</td>
          <td align="right" style="padding: 4px 0; font-size: 13px; font-weight: 600; color: #1a202c;">${siteConfig.bank.bankName}</td>
        </tr>
        <tr>
          <td colspan="2" style="padding: 8px 0 2px 0; font-size: 12px; color: #718096;">Bankszámlaszám:</td>
        </tr>
        <tr>
          <td colspan="2" style="padding: 2px 0 6px 0; font-family: monospace; font-size: 15px; font-weight: 700; letter-spacing: 0.5px; color: #1a202c; word-break: break-all;">
            ${siteConfig.bank.accountNumber}
          </td>
        </tr>
        <tr>
          <td colspan="2" style="padding: 6px 0 0 0; font-size: 12px; color: #718096; border-top: 1px dashed #ebdccb;">
            Közlemény: <strong>${name} - ${bookingId}</strong>
          </td>
        </tr>
      </table>
    </div>

    <p style="margin: 0; font-size: 12px; color: #718096; font-style: italic;">
      Amennyiben időközben az utalást már elindította, kérjük, tekintse tárgytalannak ezt az üzenetet!
    </p>
  `;

  return wrapEmailHtml({
    preheader: `Fizetési emlékeztető - ${siteConfig.shortName} (#${bookingId})`,
    headerBadge: '⚠️ Fizetési Emlékeztető',
    badgeBg: '#fef2f2',
    badgeColor: '#b91c1c',
    headerTitle: `Fizetési Emlékeztető`,
    contentHtml,
  });
}
