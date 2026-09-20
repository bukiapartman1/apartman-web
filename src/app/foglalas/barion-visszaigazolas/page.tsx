"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { hu } from 'date-fns/locale';
import styles from '../page.module.css';

function BarionStatusContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const paymentId = searchParams.get('paymentId') || searchParams.get('PaymentId');
  const bookingId = searchParams.get('bookingId');

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [booking, setBooking] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [transferSuccess, setTransferSuccess] = useState(false);

  useEffect(() => {
    if (!paymentId) {
      setLoading(false);
      setError('Hiányzó fizetési azonosító.');
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await fetch('/api/barion/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentId, bookingId }),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setPaymentStatus('Succeeded');
          setBooking(data.booking);
        } else {
          setPaymentStatus(data.status || 'Failed');
          if (data.booking) setBooking(data.booking);
          if (data.error) setError(data.error);
        }
      } catch (err: any) {
        console.error(err);
        setError('Hálózati hiba történt a fizetés ellenőrzése során.');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [paymentId, bookingId]);

  // Újrapróbálkozás Barion fizetéssel
  const handleRetryBarion = async (amountType: 'deposit' | 'full' = 'deposit') => {
    if (!booking) return;
    setActionLoading(true);
    try {
      const res = await fetch('/api/barion/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking.bookingId,
          amountType,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.gatewayUrl) {
        throw new Error(data.error || 'Nem sikerült elindítani az új fizetést.');
      }

      window.location.href = data.gatewayUrl;
    } catch (err: any) {
      alert(err.message || 'Hiba történt a fizetés újraindításakor.');
      setActionLoading(false);
    }
  };

  // Átváltás banki átutalásra
  const handleSwitchToTransfer = async () => {
    if (!booking) return;
    setActionLoading(true);
    try {
      const res = await fetch('/api/bookings/switch-to-transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: booking.bookingId }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Nem sikerült átváltani az átutalásos fizetésre.');
      }

      setTransferSuccess(true);
    } catch (err: any) {
      alert(err.message || 'Hiba történt a fizetési mód módosításakor.');
    } finally {
      setActionLoading(false);
    }
  };

  // Foglalás visszavonása / adatok módosítása és naptár felszabadítása
  const handleCancelAndRebook = async () => {
    if (!booking) {
      router.push('/');
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch('/api/bookings/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: booking.bookingId }),
      });

      const data = await res.json();
      if (data.startDate && data.endDate) {
        router.push(`/foglalas?start=${data.startDate}&end=${data.endDate}`);
      } else {
        router.push('/');
      }
    } catch (err) {
      router.push('/');
    }
  };

  if (loading) {
    return (
      <div className={styles.container} style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2 className={styles.title}>Fizetés ellenőrzése folyamatban...</h2>
        <p style={{ color: 'var(--text-light)' }}>Kérjük, várjon egy pillanatot, amíg lekérjük a Barion fizetési tranzakció eredményét.</p>
      </div>
    );
  }

  // 1. Sikeres bankkártyás fizetés nézet
  if (paymentStatus === 'Succeeded') {
    return (
      <div className={styles.container}>
        <div className={styles.successMessage}>
          <div className={styles.successIcon}>✓</div>
          <h2 className={styles.title}>Sikeres Fizetés és Foglalás!</h2>
          <p>Köszönjük, {booking?.name || 'Kedves Vendégünk'}!</p>
          <p>
            Az online bankkártyás fizetés sikeresen megtörtént. A foglalás részleteit és a visszaigazolást elküldtük a(z) <b>{booking?.email}</b> e-mail címre.
          </p>
          
          <div style={{ background: '#ffffff', padding: '20px 24px', borderRadius: '12px', boxShadow: 'rgba(0, 0, 0, 0.08) 0px 8px 24px 0px, rgba(0, 0, 0, 0.04) 0px 0px 0px 1px', margin: '25px 0', textAlign: 'left' }}>
            <p style={{ margin: '4px 0' }}><strong>Foglalási azonosító:</strong> {booking?.bookingId}</p>
            <p style={{ margin: '4px 0' }}><strong>Időtartam:</strong> {booking?.nights} éjszaka</p>
            <p style={{ margin: '4px 0' }}><strong>Kifizetett összeg (Barion):</strong> {booking?.paidAmount ? Number(booking.paidAmount).toLocaleString('hu-HU') + ' Ft' : ''}</p>
            <p style={{ margin: '4px 0', color: '#2e7d32', fontWeight: 600 }}>Státusz: Foglalás Véglegesítve és Garantálva</p>
          </div>

          <div className={styles.emailNotice}>
            <strong>Kérjük, ellenőrizze postafiókját!</strong>
            <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem' }}>
              Ha nem találja a visszaigazoló e-mailt a bejövő üzenetek között, kérjük, ellenőrizze a <strong>SPAM (Levélszemét)</strong> mappát is!
            </p>
          </div>

          <div className={styles.buttonGroup} style={{ justifyContent: 'center', marginTop: '30px' }}>
            <button className={styles.btnPrimary} onClick={() => router.push('/')}>Vissza a főoldalra</button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Sikeres átváltás banki átutalásra
  if (transferSuccess) {
    return (
      <div className={styles.container}>
        <div className={styles.successMessage}>
          <div className={styles.successIcon}>✓</div>
          <h2 className={styles.title}>Fizetési Mód Módosítva: Banki Átutalás</h2>
          <p>Köszönjük, {booking?.name}!</p>
          <p>A foglalását átállítottuk <strong>banki átutalásra</strong>, és elküldtük az átutaláshoz szükséges adatokat a(z) <b>{booking?.email}</b> e-mail címre.</p>
          
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: 'rgba(0, 0, 0, 0.08) 0px 8px 24px 0px', margin: '20px 0', textAlign: 'left' }}>
            <p style={{ margin: '4px 0' }}><strong>Foglalási azonosító:</strong> {booking?.bookingId}</p>
            <p style={{ margin: '4px 0' }}><strong>Fizetendő előleg (30%):</strong> {booking?.totalPrice ? Math.round(booking.totalPrice * 0.3).toLocaleString('hu-HU') + ' Ft' : ''}</p>
            <p style={{ margin: '4px 0', color: '#c5a880', fontWeight: 600 }}>Kérjük, az összeget 3 munkanapon belül utalja át!</p>
          </div>

          <div className={styles.buttonGroup} style={{ justifyContent: 'center', marginTop: '30px' }}>
            <button className={styles.btnPrimary} onClick={() => router.push('/')}>Vissza a főoldalra</button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Sikertelen fizetés / Megszakított folyamat nézet (Visszanavigálási lehetőségekkel)
  const depositAmt = booking?.totalPrice ? Math.round(booking.totalPrice * 0.3) : 0;
  const startStr = booking?.startDate ? format(new Date(booking.startDate), 'yyyy. MMMM d.', { locale: hu }) : '';
  const endStr = booking?.endDate ? format(new Date(booking.endDate), 'yyyy. MMMM d.', { locale: hu }) : '';

  return (
    <div className={styles.container}>
      <div style={{ textAlign: 'center', marginBottom: '25px' }}>
        <div style={{ fontSize: '3.5rem', color: '#d32f2f', marginBottom: '10px' }}>⚠</div>
        <h2 className={styles.title} style={{ color: '#d32f2f', marginBottom: '10px' }}>Online Fizetés Nem Zárult Le</h2>
        <p style={{ color: '#666', fontSize: '0.95rem', maxWidth: '500px', margin: '0 auto' }}>
          A Barion bankkártyás fizetés megszakadt, vagy a megadott kártyaadatok nem kerültek elfogadásra.
        </p>
      </div>

      {booking && (
        <div style={{ background: '#ffffff', padding: '20px 24px', borderRadius: '12px', boxShadow: 'rgba(0, 0, 0, 0.08) 0px 8px 24px 0px, rgba(0, 0, 0, 0.04) 0px 0px 0px 1px', marginBottom: '25px' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '1.1rem', color: '#333' }}>Megadott foglalási adatok:</h3>
          <p style={{ margin: '4px 0', fontSize: '0.95rem' }}><strong>Foglaló neve:</strong> {booking.name}</p>
          <p style={{ margin: '4px 0', fontSize: '0.95rem' }}><strong>E-mail cím:</strong> {booking.email}</p>
          <p style={{ margin: '4px 0', fontSize: '0.95rem' }}><strong>Időszak:</strong> {startStr} – {endStr} ({booking.nights} éjszaka)</p>
          <p style={{ margin: '4px 0', fontSize: '0.95rem' }}><strong>Végösszeg:</strong> {booking.totalPrice?.toLocaleString('hu-HU')} Ft</p>
          <p style={{ margin: '4px 0', fontSize: '0.95rem', color: '#c5a880', fontWeight: 'bold' }}><strong>30% Előleg:</strong> {depositAmt.toLocaleString('hu-HU')} Ft</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Opció 1: Barion újraindítása */}
        <button 
          type="button" 
          className={styles.btnPrimary} 
          onClick={() => handleRetryBarion('deposit')}
          disabled={actionLoading}
          style={{ padding: '16px 20px', fontSize: '1.05rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          <span>💳</span>
          {actionLoading ? 'Betöltés...' : `Fizetés Újrapróbálása Barionnal (${depositAmt.toLocaleString('hu-HU')} Ft előleg)`}
        </button>

        {/* Opció 2: Átváltás banki átutalásra */}
        <button 
          type="button" 
          className={styles.btnSecondary} 
          onClick={handleSwitchToTransfer}
          disabled={actionLoading}
          style={{ padding: '14px 20px', borderColor: '#c5a880', color: '#c5a880', fontWeight: '600' }}
        >
          🏦 Fizetés Banki Átutalással helyette (Előleg: {depositAmt.toLocaleString('hu-HU')} Ft)
        </button>

        {/* Opció 3: Foglalás visszavonása & naptár felszabadítása & adatok újraszerkesztése */}
        <button 
          type="button" 
          className={styles.btnSecondary} 
          onClick={handleCancelAndRebook}
          disabled={actionLoading}
          style={{ padding: '12px 20px', fontSize: '0.9rem', color: '#777' }}
        >
          ✏️ Időpont / Adatok módosítása (Foglalás törlése a naptárból)
        </button>
      </div>
    </div>
  );
}

export default function BarionFeedbackPage() {
  return (
    <div className={styles.bookingPage}>
      <Suspense fallback={<div>Betöltés...</div>}>
        <BarionStatusContent />
      </Suspense>
    </div>
  );
}
