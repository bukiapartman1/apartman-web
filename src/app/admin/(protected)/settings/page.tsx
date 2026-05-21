"use client";

import { useEffect, useState } from 'react';
import styles from './page.module.css';

interface SyncItem {
  source: string;
  status: 'success' | 'error' | 'skipped';
  count?: number;
  message?: string;
}

export default function SettingsPage() {
  // Input beállítások
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

  // Másolás visszajelzések (csatornánként)
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
        } else {
          throw new Error('Sikertelen betöltés');
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
    setSyncResults(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ical_url_booking: icalBooking.trim(),
          ical_url_szallas: icalSzallas.trim(),
          ical_url_airbnb: icalAirbnb.trim(),
          ical_url_custom: icalCustom.trim(),
        }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'A beállítások sikeresen mentve!' });
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

  // Kézi szinkronizáció indítása
  const handleSyncNow = async () => {
    setSyncing(true);
    setMessage(null);
    setSyncResults(null);

    try {
      const res = await fetch('/api/admin/sync', {
        method: 'POST',
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSyncResults(data.results);
        
        // Összesített visszajelzés
        const hasError = data.results.some((r: SyncItem) => r.status === 'error');
        const successCount = data.results.filter((r: SyncItem) => r.status === 'success').length;
        
        if (hasError) {
          setMessage({ 
            type: 'error', 
            text: 'A naptár szinkronizáció részben vagy teljesen sikertelen volt. Kérjük ellenőrizze az alábbi státuszokat!' 
          });
        } else if (successCount > 0) {
          setMessage({ 
            type: 'success', 
            text: 'A naptárak szinkronizációja sikeresen lefutott!' 
          });
        } else {
          setMessage({ 
            type: 'success', 
            text: 'A szinkronizáció kész (nem volt beállítva letölthető naptár link).' 
          });
        }
      } else {
        throw new Error(data.error || 'Hiba a szinkronizáció futtatásakor.');
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Sikertelen kézi szinkronizáció.' });
    } finally {
      setSyncing(false);
    }
  };

  // Vágólapra másolás kezelője
  const handleCopy = (text: string, channelName: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedChannel(channelName);
        setTimeout(() => setCopiedChannel(null), 2000);
      })
      .catch((err) => {
        console.error('Nem sikerült a vágólapra másolás:', err);
      });
  };

  const getStatusText = (status: SyncItem['status']) => {
    switch (status) {
      case 'success': return 'Sikeres';
      case 'error': return 'Hiba';
      case 'skipped': return 'Kihagyva';
      default: return '-';
    }
  };

  const getStatusClass = (status: SyncItem['status']) => {
    switch (status) {
      case 'success': return styles.statusSuccess;
      case 'error': return styles.statusError;
      case 'skipped': return styles.statusSkipped;
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: 'center', padding: '50px 0', fontSize: '1.2rem', color: '#666' }}>
          <div className={`${styles.spinner} ${styles.spinnerDark}`} style={{ display: 'inline-block', marginRight: '10px' }}></div>
          Beállítások betöltése...
        </div>
      </div>
    );
  }

  // Export linkek előállítása
  const exportUrls = {
    booking: `${origin || 'http://localhost:3000'}/api/calendar/export?channel=booking`,
    szallas: `${origin || 'http://localhost:3000'}/api/calendar/export?channel=szallas`,
    airbnb: `${origin || 'http://localhost:3000'}/api/calendar/export?channel=airbnb`,
    egyeb: `${origin || 'http://localhost:3000'}/api/calendar/export?channel=egyeb`,
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Csatorna Szinkronizáció Beállításai</h1>

      {message && (
        <div className={`${styles.alert} ${message.type === 'success' ? styles.alertSuccess : styles.alertError}`}>
          <span>{message.type === 'success' ? '✅' : '⚠️'}</span>
          <span>{message.text}</span>
        </div>
      )}

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>
          📥 Bejövő naptár-szinkronizáció (Import)
        </h2>
        <p className={styles.description}>
          Add meg a szálláshely-közvetítő oldalakon generált iCal (export) naptár linkeket. A honlap ezen címekről fogja letölteni és bejelölni a külső foglalásokat a saját naptárában.
        </p>

        <form onSubmit={handleSave} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="booking-ical">
              Booking.com iCal link
            </label>
            <input
              id="booking-ical"
              type="url"
              className={styles.input}
              placeholder="https://ical.booking.com/v1/..."
              value={icalBooking}
              onChange={(e) => setIcalBooking(e.target.value)}
            />
            <span className={styles.helpText}>Booking.com &rarr; Árak és elérhetőség &rarr; Naptár szinkronizálása &rarr; Naptár exportálása link.</span>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="szallas-ical">
              Szallas.hu iCal link
            </label>
            <input
              id="szallas-ical"
              type="url"
              className={styles.input}
              placeholder="https://szallas.hu/ical/..."
              value={icalSzallas}
              onChange={(e) => setIcalSzallas(e.target.value)}
            />
            <span className={styles.helpText}>Szallas.hu &rarr; Szálláshely kezelő &rarr; Naptár szinkronizáció &rarr; Naptár exportálása link.</span>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="airbnb-ical">
              Airbnb iCal link
            </label>
            <input
              id="airbnb-ical"
              type="url"
              className={styles.input}
              placeholder="https://www.airbnb.hu/calendar/ical/..."
              value={icalAirbnb}
              onChange={(e) => setIcalAirbnb(e.target.value)}
            />
            <span className={styles.helpText}>Airbnb &rarr; Hirdetés &rarr; Árak és elérhetőség &rarr; Naptárszinkronizáció &rarr; Naptár exportálása link.</span>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="custom-ical">
              Egyéb naptár iCal link
            </label>
            <input
              id="custom-ical"
              type="url"
              className={styles.input}
              placeholder="https://szallasportal.hu/..."
              value={icalCustom}
              onChange={(e) => setIcalCustom(e.target.value)}
            />
            <span className={styles.helpText}>Bármilyen egyéb iCal formátumú naptár feed link (pl. saját Google Calendar, egyéb portálok).</span>
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="submit"
              className={styles.btnPrimary}
              disabled={saving || syncing}
            >
              {saving && <div className={styles.spinner}></div>}
              {saving ? 'Mentés folyamatban...' : 'Beállítások mentése'}
            </button>

            <button
              type="button"
              className={styles.btnSecondary}
              onClick={handleSyncNow}
              disabled={saving || syncing}
            >
              {syncing && <div className={`${styles.spinner} ${styles.spinnerDark}`}></div>}
              {syncing ? 'Szinkronizálás fut...' : 'Szinkronizálás indítása most'}
            </button>
          </div>
        </form>

        {syncResults && (
          <div className={styles.resultsBox}>
            <div className={styles.resultsHeader}>Szinkronizáció eredménye:</div>
            <div className={styles.resultsList}>
              {syncResults.map((result, idx) => (
                <div key={idx} className={styles.resultRow}>
                  <span className={styles.resultChannel}>{result.source}</span>
                  <span className={`${styles.resultStatus} ${getStatusClass(result.status)}`}>
                    {result.status === 'success' && '✅'}
                    {result.status === 'error' && '❌'}
                    {result.status === 'skipped' && '⚠️'}
                    {getStatusText(result.status)}
                    {result.status === 'success' && ` (${result.count} db)`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>
          📤 Kimenő naptár-szinkronizáció (Export)
        </h2>
        <p className={styles.description}>
          Másold ki az alábbi linkeket, és illeszd be őket a megfelelő szállásfoglaló oldalak naptár importálási felületein. A linkek biztosítják, hogy a honlapon leadott közvetlen foglalások automatikusan blokkolják a külső naptárakat, elkerülve a kettős foglalásokat.
        </p>

        <div className={styles.exportList}>
          <div className={styles.exportItem}>
            <div className={styles.exportChannelTitle}> Booking.com felé</div>
            <div className={styles.exportChannelDesc}>
              Ezt a linket add meg a Booking.com felületén a Naptár importálása mezőben.
            </div>
            <div className={styles.urlRow}>
              <div className={styles.urlText}>{exportUrls.booking}</div>
              <button
                className={`${styles.copyButton} ${copiedChannel === 'booking' ? styles.copySuccess : ''}`}
                onClick={() => handleCopy(exportUrls.booking, 'booking')}
              >
                {copiedChannel === 'booking' ? 'Másolva!' : 'Link másolása'}
              </button>
            </div>
          </div>

          <div className={styles.exportItem}>
            <div className={styles.exportChannelTitle}> Szallas.hu felé</div>
            <div className={styles.exportChannelDesc}>
              Ezt a linket add meg a Szallas.hu felületén a Naptár importálása mezőben.
            </div>
            <div className={styles.urlRow}>
              <div className={styles.urlText}>{exportUrls.szallas}</div>
              <button
                className={`${styles.copyButton} ${copiedChannel === 'szallas' ? styles.copySuccess : ''}`}
                onClick={() => handleCopy(exportUrls.szallas, 'szallas')}
              >
                {copiedChannel === 'szallas' ? 'Másolva!' : 'Link másolása'}
              </button>
            </div>
          </div>

          <div className={styles.exportItem}>
            <div className={styles.exportChannelTitle}> Airbnb felé</div>
            <div className={styles.exportChannelDesc}>
              Ezt a linket add meg az Airbnb felületén a Naptár importálása mezőben.
            </div>
            <div className={styles.urlRow}>
              <div className={styles.urlText}>{exportUrls.airbnb}</div>
              <button
                className={`${styles.copyButton} ${copiedChannel === 'airbnb' ? styles.copySuccess : ''}`}
                onClick={() => handleCopy(exportUrls.airbnb, 'airbnb')}
              >
                {copiedChannel === 'airbnb' ? 'Másolva!' : 'Link másolása'}
              </button>
            </div>
          </div>

          <div className={styles.exportItem}>
            <div className={styles.exportChannelTitle}> Egyéb portálok felé</div>
            <div className={styles.exportChannelDesc}>
              Ezt a linket add meg bármilyen egyéb naptár importálási felületen.
            </div>
            <div className={styles.urlRow}>
              <div className={styles.urlText}>{exportUrls.egyeb}</div>
              <button
                className={`${styles.copyButton} ${copiedChannel === 'egyeb' ? styles.copySuccess : ''}`}
                onClick={() => handleCopy(exportUrls.egyeb, 'egyeb')}
              >
                {copiedChannel === 'egyeb' ? 'Másolva!' : 'Link másolása'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
