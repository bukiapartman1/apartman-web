"use client";

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { differenceInDays, parseISO, format } from 'date-fns';
import { hu } from 'date-fns/locale';
import styles from './page.module.css';

const NIGHT_PRICE = 30000;

function BookingForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const startParam = searchParams.get('start');
  const endParam = searchParams.get('end');

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Vissza a főoldalra ha nincs dátum kiválasztva
  if (!startParam || !endParam) {
    return (
      <div className={styles.container}>
        <p>Kérjük, először válasszon dátumot a főoldali naptárban!</p>
        <button className={styles.btnPrimary} onClick={() => router.push('/')}>Vissza a naptárhoz</button>
      </div>
    );
  }

  const startDate = parseISO(startParam);
  const endDate = parseISO(endParam);
  const nights = differenceInDays(endDate, startDate);
  const totalPrice = nights * NIGHT_PRICE;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const submitBooking = async () => {
    setIsSubmitting(true);
    try {
      // 1. Mentés az adatbázisba
      const dbResponse = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          nights,
          totalPrice
        })
      });

      if (!dbResponse.ok) {
        throw new Error('Hiba az adatbázisba mentéskor.');
      }
      
      const createdBooking = await dbResponse.json();

      // 2. E-mail küldése
      const emailResponse = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'NEW_BOOKING',
          bookingId: createdBooking.bookingId,
          ...formData,
          startDate: format(startDate, 'yyyy. MM. dd.'),
          endDate: format(endDate, 'yyyy. MM. dd.'),
          nights,
          totalPrice
        })
      });

      if (emailResponse.ok) {
        setStep(3);
      } else {
        alert('Hiba történt az e-mail küldése során. (De a foglalás rögzítésre került.)');
        setStep(3);
      }
    } catch (error) {
      console.error(error);
      alert('Hálózati vagy szerver hiba történt a foglalás rögzítésekor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 3) {
    return (
      <div className={styles.container}>
        <div className={styles.successMessage}>
          <div className={styles.successIcon}>✓</div>
          <h2 className={styles.title}>Sikeres Foglalás!</h2>
          <p>Köszönjük, {formData.name}!</p>
          <p>A foglalás részleteit és a további teendőket (pl. utalási információk) elküldtük a(z) <b>{formData.email}</b> e-mail címre.</p>
          <div style={{ background: '#fff3e0', padding: '15px', borderRadius: '4px', borderLeft: '4px solid #ff9800', marginTop: '20px', textAlign: 'left' }}>
            <strong>Kérjük, ellenőrizze postafiókját!</strong>
            <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem' }}>Ha nem találja a visszaigazoló e-mailt a bejövő üzenetek között, kérjük, mindenképpen ellenőrizze a <strong>SPAM (Levélszemét)</strong> vagy <strong>Promóciók</strong> mappát is!</p>
          </div>
          <div className={styles.buttonGroup} style={{ justifyContent: 'center', marginTop: '30px' }}>
            <button className={styles.btnPrimary} onClick={() => router.push('/')}>Vissza a főoldalra</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{step === 1 ? 'Adatok megadása' : 'Foglalás összegzése'}</h1>
      
      <div className={styles.summaryBox}>
        <div className={styles.summaryRow}>
          <span>Érkezés:</span>
          <span>{format(startDate, 'yyyy. MMMM d.', { locale: hu })}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Távozás:</span>
          <span>{format(endDate, 'yyyy. MMMM d.', { locale: hu })}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Időtartam:</span>
          <span>{nights} éjszaka</span>
        </div>
        <div className={`${styles.summaryRow} ${styles.totalPrice}`}>
          <span>Végösszeg:</span>
          <span>{totalPrice.toLocaleString('hu-HU')} Ft</span>
        </div>
        <div className={styles.summaryRow} style={{ marginTop: '5px', fontSize: '0.95rem', color: 'var(--text-light)', borderTop: 'none', paddingTop: '0' }}>
          <span>Ebből előlegként fizetendő:</span>
          <span style={{ fontWeight: 'bold' }}>{(totalPrice * 0.3).toLocaleString('hu-HU')} Ft</span>
        </div>
      </div>

      {step === 1 && (
        <form className={styles.form} onSubmit={handleStep1Submit}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Név</label>
            <input type="text" name="name" required className={styles.input} value={formData.name} onChange={handleInputChange} />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>E-mail cím</label>
            <input type="email" name="email" required className={styles.input} value={formData.email} onChange={handleInputChange} />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Telefonszám</label>
            <input type="tel" name="phone" required className={styles.input} value={formData.phone} onChange={handleInputChange} />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Megjegyzés</label>
            <textarea name="comment" className={styles.textarea} value={formData.comment} onChange={handleInputChange} placeholder="Egyedi kérések, érkezés várható ideje..."></textarea>
          </div>
          
          <div className={styles.buttonGroup}>
            <button type="button" className={styles.btnSecondary} onClick={() => router.push('/')}>Vissza</button>
            <button type="submit" className={styles.btnPrimary}>Összegzés</button>
          </div>
        </form>
      )}

      {step === 2 && (
        <div className={styles.form}>
          <h3>Megadott adatok ellenőrzése</h3>
          <p><strong>Név:</strong> {formData.name}</p>
          <p><strong>E-mail:</strong> {formData.email}</p>
          <p><strong>Telefon:</strong> {formData.phone}</p>
          {formData.comment && <p><strong>Megjegyzés:</strong> {formData.comment}</p>}
          
          <p className={styles.disclaimer}>Kérjük, ellenőrizze az adatokat! Ha minden helyes, kattintson a Véglegesítés gombra.</p>

          <div className={styles.buttonGroup}>
            <button type="button" className={styles.btnSecondary} onClick={() => setStep(1)} disabled={isSubmitting}>Vissza</button>
            <button type="button" className={styles.btnPrimary} onClick={submitBooking} disabled={isSubmitting}>
              {isSubmitting ? 'Küldés folyamatban...' : 'Foglalás Véglegesítése'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookingPage() {
  return (
    <div className={styles.bookingPage}>
      <Suspense fallback={<div>Betöltés...</div>}>
        <BookingForm />
      </Suspense>
    </div>
  );
}
