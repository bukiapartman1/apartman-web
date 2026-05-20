"use client";

import { useState, useEffect } from 'react';
import { format, parseISO, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, isAfter, isBefore, addMonths } from 'date-fns';
import { hu } from 'date-fns/locale';
import styles from './page.module.css';
import calStyles from '@/components/Calendar.module.css';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [sendEmail, setSendEmail] = useState(false);

  const fetchBookings = async () => {
    const res = await fetch('/api/bookings');
    if (res.ok) {
      setBookings(await res.json());
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const getDayStatus = (day: Date) => {
    const isCheckin = bookings.some(b => isSameDay(day, parseISO(b.startDate)));
    const isCheckout = bookings.some(b => isSameDay(day, parseISO(b.endDate)));
    const isFullyBooked = bookings.some(b => isAfter(day, parseISO(b.startDate)) && isBefore(day, parseISO(b.endDate)));

    if (isCheckin && isCheckout) return 'booked'; 
    if (isCheckout) return 'checkout'; 
    if (isCheckin) return 'checkin'; 
    if (isFullyBooked) return 'booked';
    return 'free';
  };

  const renderMonth = (monthDate: Date, idx: number) => {
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const days = [];
    let day = startDate;
    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }

    return (
      <div key={idx} className={calStyles.monthBlock}>
        <div className={calStyles.monthName}>{format(monthDate, 'yyyy. MMMM', { locale: hu })}</div>
        <div className={calStyles.daysHeader}>
          {['H', 'K', 'Sze', 'Cs', 'P', 'Szo', 'V'].map(d => <div key={d}>{d}</div>)}
        </div>
        <div className={calStyles.daysGrid}>
          {days.map((d, i) => {
            if (!isSameMonth(d, monthStart)) return <div key={i} className={`${calStyles.dayCell} ${calStyles.dayEmpty}`}></div>;
            const status = getDayStatus(d);
            let cellClass = calStyles.dayCell;
            if (status === 'free') cellClass += ` ${calStyles.dayFree}`;
            else if (status === 'booked') cellClass += ` ${calStyles.dayBooked}`;
            else if (status === 'checkin') cellClass += ` ${calStyles.dayCheckin}`;
            else if (status === 'checkout') cellClass += ` ${calStyles.dayCheckout}`;
            return <div key={i} className={cellClass}>{format(d, 'd')}</div>;
          })}
        </div>
      </div>
    );
  };

  const handleDelete = async (id: string) => {
    if (confirm('Biztosan törlöd a foglalást?')) {
      await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
      fetchBookings();
    }
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const isPaidEvent = selectedBooking.paidAmount > 0;
    
    await fetch(`/api/bookings/${selectedBooking.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paidAmount: parseInt(selectedBooking.paidAmount),
        status: selectedBooking.status
      })
    });

    if (isPaidEvent && sendEmail) {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'PAYMENT',
          ...selectedBooking,
          startDate: format(parseISO(selectedBooking.startDate), 'yyyy. MM. dd.'),
          endDate: format(parseISO(selectedBooking.endDate), 'yyyy. MM. dd.')
        })
      });
      alert('A foglalás mentve és az e-mail elküldve!');
    } else {
      alert('A foglalás adatai mentve.');
    }

    setIsModalOpen(false);
    fetchBookings();
  };

  const setPaymentAmount = (type: 'DEPOSIT' | 'FULL') => {
    const amount = type === 'FULL' ? selectedBooking.totalPrice : Math.round(selectedBooking.totalPrice * 0.3);
    setSelectedBooking({ ...selectedBooking, paidAmount: amount, status: type === 'FULL' ? 'PAID' : 'DEPOSIT' });
    setSendEmail(true);
  };

  const handleSendReminder = async () => {
    if (confirm('Biztosan elküldöd a 48 órás fizetési emlékeztetőt?')) {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'REMINDER',
          ...selectedBooking,
          startDate: format(parseISO(selectedBooking.startDate), 'yyyy. MM. dd.'),
          endDate: format(parseISO(selectedBooking.endDate), 'yyyy. MM. dd.')
        })
      });
      alert('Fizetési emlékeztető e-mail sikeresen elküldve!');
    }
  };

  const currentMonthBookings = bookings.filter(b => {
    const sDate = parseISO(b.startDate);
    const eDate = parseISO(b.endDate);
    return isSameMonth(sDate, currentDate) || isSameMonth(eDate, currentDate);
  });

  return (
    <div>
      <h1 style={{ marginBottom: '30px', color: '#333', textAlign: 'center', fontSize: '1.8rem' }}>Foglalások Kezelése</h1>
      
      <div className={styles.adminContainer}>
        <div className={styles.calendarSidebar}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button className={styles.btnAction} onClick={() => setCurrentDate(addMonths(currentDate, -1))}>&larr;</button>
            <button className={styles.btnAction} onClick={() => setCurrentDate(addMonths(currentDate, 1))}>&rarr;</button>
          </div>
          {renderMonth(currentDate, 0)}
        </div>

        <div className={styles.cardsContainer}>
          <h2>{format(currentDate, 'yyyy. MMMM', { locale: hu })} - Foglalások</h2>
          {currentMonthBookings.length === 0 && <p>Nincs foglalás ebben a hónapban.</p>}
          {currentMonthBookings.map(b => {
            const isOverdue = b.status === 'PENDING' && (new Date().getTime() - new Date(b.createdAt || new Date()).getTime()) > 3 * 24 * 60 * 60 * 1000;
            return (
            <div key={b.id} className={styles.card}>
              <div className={styles.cardCol1}>
                <h4 className={styles.cardName}>{b.name}</h4>
                <div className={styles.cardPeriod}>{format(parseISO(b.startDate), 'yyyy.MM.dd.')} - {format(parseISO(b.endDate), 'yyyy.MM.dd.')} ({b.nights} éj)</div>
              </div>
              
              <div className={styles.cardStatusCol}>
                {b.status === 'PENDING' && <span className={`${styles.badge} ${styles.badgePending} ${isOverdue ? styles.blinkingBorder : ''}`}>Nincs rendezve</span>}
                {b.status === 'DEPOSIT' && <span className={`${styles.badge} ${styles.badgeDeposit}`}>Előleg fizetve</span>}
                {b.status === 'PAID' && <span className={`${styles.badge} ${styles.badgePaid}`}>Teljesen fizetve</span>}
              </div>
              
              <div className={styles.cardCol3}>
                <div className={styles.cardMeta}>
                  <strong className={styles.cardId}>{b.bookingId}</strong>
                  <span className={styles.cardDate}>Foglalva: {b.createdAt ? format(new Date(b.createdAt), 'yyyy.MM.dd.') : '-'}</span>
                </div>
                <div className={styles.cardActions}>
                  <button className={styles.btnAction} onClick={() => { setSelectedBooking({...b}); setSendEmail(false); setIsModalOpen(true); }}>Szerkesztés</button>
                  <button className={styles.btnAction} onClick={() => handleDelete(b.id)} style={{ color: 'red' }}>Törlés</button>
                </div>
              </div>
            </div>
          )})}
        </div>
      </div>

      {isModalOpen && selectedBooking && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Foglalás Szerkesztése</h2>
            <hr style={{ margin: '15px 0' }}/>
            <p><strong>Azonosító:</strong> {selectedBooking.bookingId}</p>
            <p><strong>Név:</strong> {selectedBooking.name}</p>
            <p><strong>E-mail:</strong> {selectedBooking.email}</p>
            <p><strong>Telefon:</strong> {selectedBooking.phone}</p>
            <p><strong>Megjegyzés:</strong> {selectedBooking.comment || '-'}</p>
            <p><strong>Végösszeg:</strong> {selectedBooking.totalPrice.toLocaleString('hu-HU')} Ft</p>
            
            {selectedBooking.status === 'PENDING' && (
              <div style={{ marginTop: '15px', padding: '10px', background: '#fff0f0', borderLeft: '4px solid #d32f2f' }}>
                <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#d32f2f' }}>A foglalás díja még nem lett rendezve.</p>
                <button type="button" className={styles.btnAction} onClick={handleSendReminder} style={{ borderColor: '#d32f2f', color: '#d32f2f' }}>
                  📧 48 órás Fizetési Emlékeztető Küldése
                </button>
              </div>
            )}
            
            <hr style={{ margin: '15px 0' }}/>
            
            <form onSubmit={handleEditSave}>
              <div className={styles.formGroup}>
                <label>Befizetett Összeg (Ft)</label>
                <input 
                  type="number" 
                  value={selectedBooking.paidAmount} 
                  onChange={e => setSelectedBooking({...selectedBooking, paidAmount: e.target.value})} 
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button type="button" className={styles.btnAction} onClick={() => setPaymentAmount('DEPOSIT')}>30% Előleg Beállítása</button>
                <button type="button" className={styles.btnAction} onClick={() => setPaymentAmount('FULL')}>Teljes Összeg</button>
              </div>

              <div className={styles.formGroup}>
                <label>Státusz Címke</label>
                <select value={selectedBooking.status} onChange={e => setSelectedBooking({...selectedBooking, status: e.target.value})}>
                  <option value="PENDING">Nincs rendezve</option>
                  <option value="DEPOSIT">Előleg fizetve</option>
                  <option value="PAID">Teljesen fizetve</option>
                </select>
              </div>

              <div className={styles.formGroup} style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input 
                  type="checkbox" 
                  id="sendEmailCheck"
                  checked={sendEmail} 
                  onChange={e => setSendEmail(e.target.checked)} 
                  style={{ width: 'auto' }}
                />
                <label htmlFor="sendEmailCheck" style={{ margin: 0, fontWeight: 'normal' }}>
                  A mentés során automatikusan véglegesítő e-mailt küldök a vendégnek a befizetésről.
                </label>
              </div>

              <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '30px' }}>
                <button type="button" className={styles.btnAction} onClick={() => setIsModalOpen(false)}>Mégsem</button>
                <button type="submit" className={styles.btnAction} style={{ background: '#c5a880', color: 'white' }}>Mentés</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
