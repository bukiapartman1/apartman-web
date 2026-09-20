"use client";

import { useState, Suspense, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { differenceInDays, parseISO, format } from 'date-fns';
import { hu } from 'date-fns/locale';
import { calculateStayPrice, siteConfig } from '@/lib/siteConfig';
import styles from './page.module.css';

function BookingForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const startParam = searchParams.get('start');
  const endParam = searchParams.get('end');

  const [step, setStep] = useState(1);
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    comment: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<'BARION' | 'TRANSFER'>('BARION');
  const [barionAmountType, setBarionAmountType] = useState<'deposit' | 'full'>('deposit');
  const [acceptedAszf, setAcceptedAszf] = useState(false);
  const [acceptedAdatkezeles, setAcceptedAdatkezeles] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [settingsOverride, setSettingsOverride] = useState<any>(null);

  useEffect(() => {
    fetch('/api/settings/public')
      .then(res => res.json())
      .then(data => {
        setSettingsOverride({
          priceLowSeason: data.priceLowSeason,
          priceHighSeason: data.priceHighSeason,
          pricePeakSeason: data.pricePeakSeason,
          ifaAmount: data.ifaAmount,
          peakDates: data.peakDates,
        });
      })
      .catch(err => console.error('Error fetching settings override:', err));
  }, []);

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

  // Dinamikus árkalkuláció szezonalitással, kedvezményekkel, ünnepnapokkal és IFA-val
  const pricing = useMemo(() => {
    return calculateStayPrice(startDate, endDate, adults, children, settingsOverride);
  }, [startDate, endDate, adults, children, settingsOverride]);

  const totalPrice = pricing.totalPrice;
  const depositPrice = pricing.depositAmount;

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
          adults,
          children,
          ifaAmount: pricing.ifaTotal,
          totalPrice,
          paymentMethod,
        })
      });

      if (!dbResponse.ok) {
        throw new Error('Hiba az adatbázisba mentéskor.');
      }
      
      const createdBooking = await dbResponse.json();

      if (paymentMethod === 'BARION') {
        // 2/A. Barion fizetés indítása
        const barionRes = await fetch('/api/barion/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookingId: createdBooking.bookingId,
            amountType: barionAmountType,
          }),
        });

        const barionData = await barionRes.json();
        if (!barionRes.ok || !barionData.gatewayUrl) {
          throw new Error(barionData.error || 'Nem sikerült elindítani a Barion fizetési kaput.');
        }

        // Átirányítás a Barion felületére
        window.location.href = barionData.gatewayUrl;
        return;
      }

      // 2/B. Banki átutalás esetén visszaigazoló e-mail küldése
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
          adults,
          children,
          ifaAmount: pricing.ifaTotal,
          totalPrice
        })
      });

      if (emailResponse.ok) {
        setStep(3);
      } else {
        alert('Hiba történt az e-mail küldése során. (De a foglalás rögzítésre került.)');
        setStep(3);
      }
    } catch (error: any) {
      console.error(error);
      alert(error?.message || 'Hálózati vagy szerver hiba történt a foglalás rögzítésekor.');
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
          <div className={styles.emailNotice}>
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
      
      {/* Részletes összegző doboz */}
      <div className={styles.summaryBox}>
        <div className={styles.summaryRow}>
          <span>Érkezés – Távozás:</span>
          <span style={{ fontWeight: 600 }}>{format(startDate, 'yyyy. MMM d.', { locale: hu })} – {format(endDate, 'yyyy. MMM d.', { locale: hu })}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Tartózkodás:</span>
          <span>{nights} éjszaka</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Vendégek:</span>
          <span>{adults} felnőtt{children > 0 ? `, ${children} gyermek` : ''}</span>
        </div>
        
        <div className={styles.summaryRowSub}>
          <span>Szállásdíj:</span>
          <span>{pricing.baseRoomPrice.toLocaleString('hu-HU')} Ft</span>
        </div>

        {pricing.discountAmount > 0 && (
          <div className={`${styles.summaryRowSub} ${styles.discountRow}`}>
            <span>Hosszú tartózkodás kedvezmény (-{pricing.discountPercentage}%):</span>
            <span>-{pricing.discountAmount.toLocaleString('hu-HU')} Ft</span>
          </div>
        )}

        <div className={styles.summaryRowSub}>
          <span>IFA ({adults} felnőtt × {nights} éj × {pricing.ifaPerNightPerPerson} Ft):</span>
          <span>+{pricing.ifaTotal.toLocaleString('hu-HU')} Ft</span>
        </div>

        <div className={`${styles.summaryRow} ${styles.totalPrice}`}>
          <span>Fizetendő végösszeg:</span>
          <span>{totalPrice.toLocaleString('hu-HU')} Ft</span>
        </div>
        <div className={styles.summaryRow} style={{ marginTop: '5px', fontSize: '0.95rem', color: 'var(--text-light)', borderTop: 'none', paddingTop: '0' }}>
          <span>Ebből előlegként fizetendő (30%):</span>
          <span style={{ fontWeight: 'bold', color: 'var(--accent-color)' }}>{depositPrice.toLocaleString('hu-HU')} Ft</span>
        </div>
      </div>

      {step === 1 && (
        <form className={styles.form} onSubmit={handleStep1Submit}>
          {/* Vendégszám választó */}
          <div className={styles.guestGrid}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Felnőttek száma (18+ év)</label>
              <select 
                className={styles.select} 
                value={adults} 
                onChange={(e) => setAdults(Number(e.target.value))}
              >
                {[1, 2, 3, 4].map(num => (
                  <option key={num} value={num}>{num} felnőtt</option>
                ))}
              </select>
              <span className={styles.helperText}>IFA köteles (600 Ft/fő/éj)</span>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Gyermekek száma (0-17 év)</label>
              <select 
                className={styles.select} 
                value={children} 
                onChange={(e) => setChildren(Number(e.target.value))}
              >
                {[0, 1, 2, 3].map(num => (
                  <option key={num} value={num}>{num === 0 ? 'Nincs gyermek' : `${num} gyermek`}</option>
                ))}
              </select>
              <span className={styles.helperText}>IFA mentes</span>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Név</label>
            <input type="text" name="name" required className={styles.input} value={formData.name} onChange={handleInputChange} placeholder="pl. Kovács János" />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>E-mail cím</label>
            <input type="email" name="email" required className={styles.input} value={formData.email} onChange={handleInputChange} placeholder="pl. jános@gmail.com" />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Telefonszám</label>
            <input type="tel" name="phone" required className={styles.input} value={formData.phone} onChange={handleInputChange} placeholder="pl. +36 30 123 4567" />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Megjegyzés (Opcionális)</label>
            <textarea name="comment" className={styles.textarea} value={formData.comment} onChange={handleInputChange} placeholder="Egyedi kérések, érkezés várható ideje, bababarát felszerelés igénylése..."></textarea>
          </div>
          
          <div className={styles.buttonGroup}>
            <button type="button" className={styles.btnSecondary} onClick={() => router.push('/')}>Vissza a naptárhoz</button>
            <button type="submit" className={styles.btnPrimary}>Tovább az Összegzéshez</button>
          </div>
        </form>
      )}

      {step === 2 && (
        <div className={styles.form}>
          <h3>Megadott adatok ellenőrzése</h3>
          <p><strong>Név:</strong> {formData.name}</p>
          <p><strong>E-mail:</strong> {formData.email}</p>
          <p><strong>Telefon:</strong> {formData.phone}</p>
          <p><strong>Vendégek:</strong> {adults} felnőtt{children > 0 ? `, ${children} gyermek` : ''}</p>
          {formData.comment && <p><strong>Megjegyzés:</strong> {formData.comment}</p>}
          
          <div className={styles.paymentSection}>
            <div className={styles.paymentSectionTitle}>Válasszon fizetési módot:</div>
            <div className={styles.paymentOptions}>
              <div 
                className={`${styles.paymentCard} ${paymentMethod === 'BARION' ? styles.paymentCardActive : ''}`}
                onClick={() => setPaymentMethod('BARION')}
              >
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  checked={paymentMethod === 'BARION'} 
                  onChange={() => setPaymentMethod('BARION')}
                  className={styles.paymentRadio}
                />
                <div className={styles.paymentInfo}>
                  <div className={styles.paymentHeader}>
                    <span className={styles.paymentTitle}>
                      💳 Online bankkártya (Barion)
                    </span>
                    <span className={styles.paymentBadge}>Azonnali & Biztonságos</span>
                  </div>
                  <p className={styles.paymentDesc}>
                    Kényelmes, díjmentes fizetés bankkártyával vagy Barion tárcával. Foglalása a sikeres fizetés után azonnal garantálttá válik.
                  </p>
                  
                  {paymentMethod === 'BARION' && (
                    <div className={styles.amountSelector} onClick={(e) => e.stopPropagation()}>
                      <button 
                        type="button"
                        className={`${styles.amountOption} ${barionAmountType === 'deposit' ? styles.amountOptionActive : ''}`}
                        onClick={() => setBarionAmountType('deposit')}
                      >
                        30% előleg ({depositPrice.toLocaleString('hu-HU')} Ft)
                      </button>
                      <button 
                        type="button"
                        className={`${styles.amountOption} ${barionAmountType === 'full' ? styles.amountOptionActive : ''}`}
                        onClick={() => setBarionAmountType('full')}
                      >
                        Teljes összeg ({totalPrice.toLocaleString('hu-HU')} Ft)
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div 
                className={`${styles.paymentCard} ${paymentMethod === 'TRANSFER' ? styles.paymentCardActive : ''}`}
                onClick={() => setPaymentMethod('TRANSFER')}
              >
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  checked={paymentMethod === 'TRANSFER'} 
                  onChange={() => setPaymentMethod('TRANSFER')}
                  className={styles.paymentRadio}
                />
                <div className={styles.paymentInfo}>
                  <div className={styles.paymentHeader}>
                    <span className={styles.paymentTitle}>
                      🏦 Banki átutalás
                    </span>
                  </div>
                  <p className={styles.paymentDesc}>
                    A 30% előleget ({depositPrice.toLocaleString('hu-HU')} Ft) a foglalást követő 3 munkanapon belül kell átutalni a visszaigazoló e-mailben megadott {siteConfig.bank.bankName} számlaszámra.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.checkboxContainer}>
            <input 
              type="checkbox" 
              id="acceptedAszf" 
              name="acceptedAszf" 
              checked={acceptedAszf} 
              onChange={(e) => setAcceptedAszf(e.target.checked)} 
              className={styles.checkboxInput}
            />
            <label htmlFor="acceptedAszf" className={styles.checkboxLabel}>
              A <a href="/aszf" target="_blank" rel="noopener noreferrer" className={styles.checkboxLink}>{siteConfig.shortName} Általános Szerződési Feltételeit (ÁSZF)</a> elfogadom és megértettem.
            </label>
          </div>

          <div className={styles.checkboxContainer}>
            <input 
              type="checkbox" 
              id="acceptedAdatkezeles" 
              name="acceptedAdatkezeles" 
              checked={acceptedAdatkezeles} 
              onChange={(e) => setAcceptedAdatkezeles(e.target.checked)} 
              className={styles.checkboxInput}
            />
            <label htmlFor="acceptedAdatkezeles" className={styles.checkboxLabel}>
              A <a href="/adatkezeles" target="_blank" rel="noopener noreferrer" className={styles.checkboxLink}>{siteConfig.shortName} Adatkezelési tájékoztatóját</a> megismertem és elfogadom.
            </label>
          </div>

          <p className={styles.disclaimer}>Kérjük, ellenőrizze az adatokat! Ha minden helyes, kattintson a gombra a foglalás véglegesítéséhez.</p>

          <div className={styles.buttonGroup}>
            <button type="button" className={styles.btnSecondary} onClick={() => setStep(1)} disabled={isSubmitting}>Vissza</button>
            <button 
              type="button" 
              className={styles.btnPrimary} 
              onClick={submitBooking} 
              disabled={isSubmitting || !acceptedAszf || !acceptedAdatkezeles}
            >
              {isSubmitting 
                ? 'Feldolgozás...' 
                : paymentMethod === 'BARION' 
                  ? `Fizetés a Barionnal (${(barionAmountType === 'deposit' ? depositPrice : totalPrice).toLocaleString('hu-HU')} Ft)` 
                  : 'Foglalás Véglegesítése'
              }
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
