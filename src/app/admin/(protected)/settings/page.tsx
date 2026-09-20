"use client";

import { useEffect, useState } from 'react';
import { defaultHungarianHolidays, HolidayPeriod, siteConfig } from '@/lib/siteConfig';
import styles from './page.module.css';

interface SyncItem {
  source: string;
  status: 'success' | 'error' | 'skipped';
  count?: number;
  message?: string;
}

export default function SettingsPage() {
  // Általános és árazási beállítások
  const [minStayNights, setMinStayNights] = useState<number>(2);
  const [priceLowSeason, setPriceLowSeason] = useState<number>(28000);
  const [priceHighSeason, setPriceHighSeason] = useState<number>(35000);
  const [pricePeakSeason, setPricePeakSeason] = useState<number>(40000);
  const [ifaAmount, setIfaAmount] = useState<number>(600);

  // 2026/2027 Ünnepnapok és hosszú hétvégék
  const [holidays, setHolidays] = useState<HolidayPeriod[]>(defaultHungarianHolidays);
  const [newHolidayName, setNewHolidayName] = useState('');
  const [newHolidayStart, setNewHolidayStart] = useState('');
  const [newHolidayEnd, setNewHolidayEnd] = useState('');

  // iCal beállítások
  const [icalBooking, setIcalBooking] = useState('');
  const [icalSzallas, setIcalSzallas] = useState('');
  const [icalAirbnb, setIcalAirbnb] = useState('');
  const [icalCustom, setIcalCustom] = useState('');

  // Állapotjelzők
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [syncResults, setSyncResults] = useState<SyncItem[] | null>(null);
  const [origin, setOrigin] = useState('');
  const [copiedChannel, setCopiedChannel] = useState<string | null>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
    
    // Beállítások betöltése
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/settings');
        if (res.ok) {
          const data = await res.json();
          setIcalBooking(data.ical_url_booking || '');
          setIcalSzallas(data.ical_url_szallas || '');
          setIcalAirbnb(data.ical_url_airbnb || '');
          setIcalCustom(data.ical_url_custom || '');

          if (data.min_stay_nights) setMinStayNights(Number(data.min_stay_nights));
          if (data.price_low_season) setPriceLowSeason(Number(data.price_low_season));
          if (data.price_high_season) setPriceHighSeason(Number(data.price_high_season));
          if (data.price_peak_season) setPricePeakSeason(Number(data.price_peak_season));
          if (data.ifa_amount) setIfaAmount(Number(data.ifa_amount));

          if (data.peak_dates_json) {
            try {
              setHolidays(JSON.parse(data.peak_dates_json));
            } catch (e) {
              setHolidays(defaultHungarianHolidays);
            }
          }
        }
      } catch (err) {
        console.error('Hiba a beállítások betöltésekor:', err);
        setMessage({ type: 'error', text: 'Nem sikerült betölteni a beállításokat az adatbázisból.' });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Beállítások mentése
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          min_stay_nights: String(minStayNights),
          price_low_season: String(priceLowSeason),
          price_high_season: String(priceHighSeason),
          price_peak_season: String(pricePeakSeason),
          ifa_amount: String(ifaAmount),
          peak_dates_json: JSON.stringify(holidays),
          ical_url_booking: icalBooking.trim(),
          ical_url_szallas: icalSzallas.trim(),
          ical_url_airbnb: icalAirbnb.trim(),
          ical_url_custom: icalCustom.trim(),
        }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Minden beállítás sikeresen elmentve az adatbázisba!' });
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Sikertelen mentés');
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Hiba történt a mentés során.' });
    } finally {
      setSaving(false);
    }
  };

  // Ünnepnap ki/bekapcsolása
  const toggleHoliday = (id: string) => {
    setHolidays(prev => prev.map(h => h.id === id ? { ...h, active: !h.active } : h));
  };

  // Új ünnepi időszak hozzáadása
  const handleAddHoliday = () => {
    if (!newHolidayName || !newHolidayStart || !newHolidayEnd) {
      alert('Kérjük, adja meg az ünnep nevét, kezdő és záró dátumát!');
      return;
    }
    const newH: HolidayPeriod = {
      id: `h-custom-${Date.now()}`,
      name: newHolidayName,
      startDate: newHolidayStart,
      endDate: newHolidayEnd,
      active: true,
    };
    setHolidays(prev => [...prev, newH]);
    setNewHolidayName('');
    setNewHolidayStart('');
    setNewHolidayEnd('');
  };

  // Ünnep törlése
  const handleDeleteHoliday = (id: string) => {
    setHolidays(prev => prev.filter(h => h.id !== id));
  };

  // Kézi szinkronizáció indítása
  const handleSyncNow = async () => {
    setSyncing(true);
    setMessage(null);
    setSyncResults(null);

    try {
      const res = await fetch('/api/admin/sync', { method: 'POST' });
      const data = await res.json();

      if (res.ok && data.success) {
        setSyncResults(data.results);
        setMessage({ type: 'success', text: 'A naptárak szinkronizációja sikeresen lefutott!' });
      } else {
        throw new Error(data.error || 'Hiba a szinkronizáció futtatásakor.');
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Sikertelen kézi szinkronizáció.' });
    } finally {
      setSyncing(false);
    }
  };

  const handleCopy = (text: string, channelName: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedChannel(channelName);
        setTimeout(() => setCopiedChannel(null), 2000);
      })
      .catch((err) => console.error('Másolási hiba:', err));
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: 'center', padding: '50px 0', fontSize: '1.2rem', color: '#666' }}>
          Beállítások betöltése...
        </div>
      </div>
    );
  }

  const exportUrls = {
    booking: `${origin || 'http://localhost:3000'}/api/calendar/export?channel=booking`,
    szallas: `${origin || 'http://localhost:3000'}/api/calendar/export?channel=szallas`,
    airbnb: `${origin || 'http://localhost:3000'}/api/calendar/export?channel=airbnb`,
    egyeb: `${origin || 'http://localhost:3000'}/api/calendar/export?channel=egyeb`,
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Apartman & Rendszer Beállítások</h1>

      {message && (
        <div className={`${styles.alert} ${message.type === 'success' ? styles.alertSuccess : styles.alertError}`}>
          <span>{message.type === 'success' ? '✅' : '⚠️'}</span>
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSave}>
        {/* 1. KÁRTYA: Árak, Szezonok & Minimum Éjszakák */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            🏠 Árak, Szezonalitás és Minimum Éjszakák
          </h2>
          <p className={styles.description}>
            Itt állíthatod be az apartman alapárait, a szezondíjakat és a kötelező minimum éjszakák számát. Ha engedélyezed az 1 éjszakás foglalást, a naptár azonnal engedi az 1 éjt is.
          </p>

          <div className={styles.gridTwo} style={{ marginBottom: '20px' }}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Minimum Foglalható Éjszakák Száma
              </label>
              <select 
                className={styles.input} 
                value={minStayNights} 
                onChange={e => setMinStayNights(Number(e.target.value))}
              >
                <option value={1}>1 éjszaka (1 éjes foglalások engedélyezése)</option>
                <option value={2}>2 éjszaka (Alapértelmezett)</option>
                <option value={3}>3 éjszaka (Főszezoni / Hétvégi minimum)</option>
                <option value={4}>4 éjszaka</option>
              </select>
              <span className={styles.helpText}>A honlapi naptárban ez a minimális választható időtartam.</span>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Helyi IFA mértéke (Ft / felnőtt / éjszaka)
              </label>
              <input 
                type="number" 
                className={styles.input} 
                value={ifaAmount} 
                onChange={e => setIfaAmount(Number(e.target.value))} 
                step={50}
              />
              <span className={styles.helpText}>18 év feletti vendégek után automatikusan számolva.</span>
            </div>
          </div>

          <div className={styles.gridThree}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Elő- és Utószezoni Alapár (Ft / éj)
              </label>
              <input 
                type="number" 
                className={styles.input} 
                value={priceLowSeason} 
                onChange={e => setPriceLowSeason(Number(e.target.value))} 
                step={1000}
              />
              <span className={styles.helpText}>Január–Május & Szeptember–December</span>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Nyári Főszezon Ár (Ft / éj)
              </label>
              <input 
                type="number" 
                className={styles.input} 
                value={priceHighSeason} 
                onChange={e => setPriceHighSeason(Number(e.target.value))} 
                step={1000}
              />
              <span className={styles.helpText}>Június 1. – Szeptember 15.</span>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Kiemelt Ünnepi Szezonár (Ft / éj)
              </label>
              <input 
                type="number" 
                className={styles.input} 
                value={pricePeakSeason} 
                onChange={e => setPricePeakSeason(Number(e.target.value))} 
                step={1000}
              />
              <span className={styles.helpText}>Hosszú hétvégék & Ünnepek</span>
            </div>
          </div>
        </div>

        {/* 2. KÁRTYA: 2026 & 2027 Magyarországi Kiemelt Hosszú Hétvégék és Ünnepnapok */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            🎉 2026 & 2027 Kiemelt Magyarországi Ünnepnapok & Hosszú Hétvégék
          </h2>
          <p className={styles.description}>
            Az alábbi kiemelt időszakokban a rendszer automatikusan a <strong>Kiemelt Ünnepi Árat ({pricePeakSeason.toLocaleString('hu-HU')} Ft/éj)</strong> alkalmazza a foglalásoknál. A kapcsolókkal egyenként ki/be kapcsolhatod őket, vagy alul új egyedi ünnepi időszakot adhatsz hozzá (pl. Bükfürdői fesztivál).
          </p>

          <div className={styles.holidayList}>
            {holidays.map(h => (
              <div key={h.id} className={`${styles.holidayItem} ${!h.active ? styles.holidayItemInactive : ''}`}>
                <div>
                  <div className={styles.holidayName}>{h.name}</div>
                  <div className={styles.holidayDate}>📅 {h.startDate} – {h.endDate}</div>
                </div>

                <div className={styles.holidayActions}>
                  <label className={styles.switch} title={h.active ? 'Aktív kiemelt időszak' : 'Kikapcsolva'}>
                    <input 
                      type="checkbox" 
                      checked={h.active} 
                      onChange={() => toggleHoliday(h.id)} 
                    />
                    <span className={styles.slider}></span>
                  </label>

                  {h.id.startsWith('h-custom-') && (
                    <button 
                      type="button" 
                      onClick={() => handleDeleteHoliday(h.id)} 
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d32f2f', fontSize: '1.1rem' }}
                      title="Egyedi ünnep törlése"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Új ünnepi időszak hozzáadása */}
          <div className={styles.addHolidayBox}>
            <div className={styles.formGroup}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Új időszak neve</label>
              <input 
                type="text" 
                className={styles.input} 
                placeholder="pl. Gyógyfürdő Fesztivál" 
                value={newHolidayName} 
                onChange={e => setNewHolidayName(e.target.value)} 
              />
            </div>
            <div className={styles.formGroup}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Kezdő dátum</label>
              <input 
                type="date" 
                className={styles.input} 
                value={newHolidayStart} 
                onChange={e => setNewHolidayStart(e.target.value)} 
              />
            </div>
            <div className={styles.formGroup}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Záró dátum</label>
              <input 
                type="date" 
                className={styles.input} 
                value={newHolidayEnd} 
                onChange={e => setNewHolidayEnd(e.target.value)} 
              />
            </div>
            <button 
              type="button" 
              className={styles.btnPrimary} 
              onClick={handleAddHoliday}
              style={{ padding: '10px 16px', fontSize: '0.88rem' }}
            >
              + Hozzáadás
            </button>
          </div>
        </div>

        {/* 3. KÁRTYA: Bejövő naptár-szinkronizáció (Import) */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            📥 Bejövő naptár-szinkronizáció (Import)
          </h2>
          <p className={styles.description}>
            Add meg a szálláshely-közvetítő oldalakon generált iCal naptár linkeket.
          </p>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="booking-ical">Booking.com iCal link</label>
            <input
              id="booking-ical"
              type="url"
              className={styles.input}
              placeholder="https://ical.booking.com/v1/..."
              value={icalBooking}
              onChange={(e) => setIcalBooking(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="szallas-ical">Szallas.hu iCal link</label>
            <input
              id="szallas-ical"
              type="url"
              className={styles.input}
              placeholder="https://szallas.hu/ical/..."
              value={icalSzallas}
              onChange={(e) => setIcalSzallas(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="airbnb-ical">Airbnb iCal link</label>
            <input
              id="airbnb-ical"
              type="url"
              className={styles.input}
              placeholder="https://www.airbnb.hu/calendar/ical/..."
              value={icalAirbnb}
              onChange={(e) => setIcalAirbnb(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="custom-ical">Egyéb naptár iCal link</label>
            <input
              id="custom-ical"
              type="url"
              className={styles.input}
              placeholder="https://szallasportal.hu/..."
              value={icalCustom}
              onChange={(e) => setIcalCustom(e.target.value)}
            />
          </div>

          <div className={styles.buttonGroup} style={{ marginTop: '20px' }}>
            <button type="submit" className={styles.btnPrimary} disabled={saving || syncing}>
              {saving ? 'Mentés folyamatban...' : '💾 Minden Beállítás Mentése'}
            </button>

            <button type="button" className={styles.btnSecondary} onClick={handleSyncNow} disabled={saving || syncing}>
              {syncing ? 'Szinkronizálás fut...' : '🔄 Naptárak Szinkronizálása Most'}
            </button>
          </div>
        </div>

        {/* 4. KÁRTYA: Kimenő naptár-szinkronizáció (Export) */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            📤 Kimenő naptár-szinkronizáció (Export)
          </h2>
          <p className={styles.description}>
            Másold ki az alábbi linkeket, és illeszd be őket a megfelelő portálok importálási mezőibe.
          </p>

          <div className={styles.exportList}>
            <div className={styles.exportItem}>
              <div className={styles.exportChannelTitle}>Booking.com felé</div>
              <div className={styles.urlRow}>
                <div className={styles.urlText}>{exportUrls.booking}</div>
                <button
                  type="button"
                  className={`${styles.copyButton} ${copiedChannel === 'booking' ? styles.copySuccess : ''}`}
                  onClick={() => handleCopy(exportUrls.booking, 'booking')}
                >
                  {copiedChannel === 'booking' ? 'Másolva!' : 'Link másolása'}
                </button>
              </div>
            </div>

            <div className={styles.exportItem}>
              <div className={styles.exportChannelTitle}>Szallas.hu felé</div>
              <div className={styles.urlRow}>
                <div className={styles.urlText}>{exportUrls.szallas}</div>
                <button
                  type="button"
                  className={`${styles.copyButton} ${copiedChannel === 'szallas' ? styles.copySuccess : ''}`}
                  onClick={() => handleCopy(exportUrls.szallas, 'szallas')}
                >
                  {copiedChannel === 'szallas' ? 'Másolva!' : 'Link másolása'}
                </button>
              </div>
            </div>

            <div className={styles.exportItem}>
              <div className={styles.exportChannelTitle}>Airbnb felé</div>
              <div className={styles.urlRow}>
                <div className={styles.urlText}>{exportUrls.airbnb}</div>
                <button
                  type="button"
                  className={`${styles.copyButton} ${copiedChannel === 'airbnb' ? styles.copySuccess : ''}`}
                  onClick={() => handleCopy(exportUrls.airbnb, 'airbnb')}
                >
                  {copiedChannel === 'airbnb' ? 'Másolva!' : 'Link másolása'}
                </button>
              </div>
            </div>

            <div className={styles.exportItem}>
              <div className={styles.exportChannelTitle}>Egyéb portálok felé</div>
              <div className={styles.urlRow}>
                <div className={styles.urlText}>{exportUrls.egyeb}</div>
                <button
                  type="button"
                  className={`${styles.copyButton} ${copiedChannel === 'egyeb' ? styles.copySuccess : ''}`}
                  onClick={() => handleCopy(exportUrls.egyeb, 'egyeb')}
                >
                  {copiedChannel === 'egyeb' ? 'Másolva!' : 'Link másolása'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
