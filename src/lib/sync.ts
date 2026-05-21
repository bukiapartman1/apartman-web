import { prisma } from './prisma';

export interface SyncResult {
  source: string;
  status: 'success' | 'error' | 'skipped';
  count?: number;
  message?: string;
}

function parseICS(icsText: string): Array<{ startDate: Date; endDate: Date; uid: string; summary: string }> {
  const lines = icsText.split(/\r?\n/);
  const events: any[] = [];
  let currentEvent: any = null;

  for (const line of lines) {
    const cleanLine = line.trim();
    if (cleanLine === 'BEGIN:VEVENT') {
      currentEvent = {};
    } else if (cleanLine === 'END:VEVENT') {
      if (currentEvent && currentEvent.startDate && currentEvent.endDate) {
        events.push(currentEvent);
      }
      currentEvent = null;
    } else if (currentEvent) {
      if (cleanLine.startsWith('DTSTART')) {
        const val = cleanLine.substring(cleanLine.indexOf(':') + 1);
        currentEvent.startDate = parseICSDate(val);
      } else if (cleanLine.startsWith('DTEND')) {
        const val = cleanLine.substring(cleanLine.indexOf(':') + 1);
        currentEvent.endDate = parseICSDate(val);
      } else if (cleanLine.startsWith('UID')) {
        currentEvent.uid = cleanLine.substring(cleanLine.indexOf(':') + 1) || '';
      } else if (cleanLine.startsWith('SUMMARY')) {
        currentEvent.summary = cleanLine.substring(cleanLine.indexOf(':') + 1) || 'Foglalt';
      }
    }
  }
  return events;
}

function parseICSDate(dateStr: string): Date {
  const cleanStr = dateStr.replace(/[^0-9T]/g, ''); // Pl. "20260601" vagy "20260601T120000Z"
  const year = parseInt(cleanStr.substring(0, 4));
  const month = parseInt(cleanStr.substring(4, 6)) - 1;
  const day = parseInt(cleanStr.substring(6, 8));
  
  if (cleanStr.includes('T')) {
    const hour = parseInt(cleanStr.substring(9, 11));
    const min = parseInt(cleanStr.substring(11, 13));
    const sec = parseInt(cleanStr.substring(13, 15));
    return new Date(Date.UTC(year, month, day, hour, min, sec));
  }
  
  return new Date(Date.UTC(year, month, day, 12, 0, 0));
}

export async function runSync(): Promise<SyncResult[]> {
  const results: SyncResult[] = [];
  
  let settingsMap: Record<string, string> = {};
  try {
    const dbSettings = await prisma.setting.findMany();
    settingsMap = dbSettings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);
  } catch (err) {
    console.error('Hiba a beállítások betöltésekor a szinkronizációhoz:', err);
  }

  const bookingUrl = settingsMap['ical_url_booking'] || process.env.ICAL_URL_BOOKING;
  const szallasUrl = settingsMap['ical_url_szallas'] || process.env.ICAL_URL_SZALLAS;
  const airbnbUrl = settingsMap['ical_url_airbnb'] || process.env.ICAL_URL_AIRBNB;
  const customUrl = settingsMap['ical_url_custom'] || process.env.ICAL_URL_CUSTOM;
  
  const channels = [
    { key: 'ical_url_booking', name: 'Booking.com', url: bookingUrl },
    { key: 'ical_url_szallas', name: 'Szallas.hu', url: szallasUrl },
    { key: 'ical_url_airbnb', name: 'Airbnb', url: airbnbUrl },
    { key: 'ical_url_custom', name: 'Egyéb', url: customUrl }
  ];

  for (const channel of channels) {
    if (!channel.url || !channel.url.trim().startsWith('http')) {
      results.push({
        source: channel.name,
        status: 'skipped',
        message: 'Nincs érvényes szinkronizációs URL beállítva.'
      });
      continue;
    }

    try {
      // 8 másodperces timeout a lekéréshez, cache kihagyása
      const res = await fetch(channel.url, { 
        cache: 'no-store', 
        signal: AbortSignal.timeout(8000) 
      });
      
      if (!res.ok) {
        throw new Error(`Szerver válaszkód: ${res.status}`);
      }
      
      const text = await res.text();
      
      if (!text.includes('BEGIN:VCALENDAR')) {
        throw new Error('Hibás formátum (hiányzik a BEGIN:VCALENDAR)');
      }

      const events = parseICS(text);
      const sourceName = `${channel.name} Foglalás`;
      
      const importedData = events.map(ev => ({
        name: sourceName,
        email: 'ical@import.hu',
        phone: '-',
        comment: `Importálva iCal-ből. (UID: ${ev.uid || '-'})`,
        startDate: ev.startDate,
        endDate: ev.endDate,
        nights: Math.max(1, Math.round((ev.endDate.getTime() - ev.startDate.getTime()) / (1000 * 60 * 60 * 24))),
        totalPrice: 0,
        status: 'IMPORTED'
      }));

      // Adatbázis frissítése tranzakcióban (csak ezt a forrást töröljük és írjuk újra)
      await prisma.$transaction([
        prisma.booking.deleteMany({
          where: { name: sourceName, status: 'IMPORTED' }
        }),
        prisma.booking.createMany({
          data: importedData
        })
      ]);

      results.push({
        source: channel.name,
        status: 'success',
        count: events.length,
        message: `Sikeresen importálva ${events.length} foglalás.`
      });
    } catch (err: any) {
      console.error(`Hiba a(z) ${channel.name} naptár letöltésekor/feldolgozásakor:`, err);
      results.push({
        source: channel.name,
        status: 'error',
        message: err.message || 'Sikertelen szinkronizálás.'
      });
    }
  }

  return results;
}
