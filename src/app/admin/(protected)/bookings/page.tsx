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
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

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
    if (confirm('Biztosan törlöd ezt a foglalást a rendszerből és a naptárból?')) {
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
        paidAmount: parseInt(selectedBooking.paidAmount || 0),
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
          paidAmount: parseInt(selectedBooking.paidAmount || 0),
          startDate: format(parseISO(selectedBooking.startDate), 'yyyy. MM. dd.'),
          endDate: format(parseISO(selectedBooking.endDate), 'yyyy. MM. dd.')
        })
      });
      alert('A foglalás mentve és a visszaigazoló e-mail elküldve!');
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

  const handleSendReminder = async (bookingItem: any) => {
    if (confirm(`Biztosan elküldöd a 48 órás fizetési emlékeztetőt ${bookingItem.name} (${bookingItem.email}) részére?`)) {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'REMINDER',
          ...bookingItem,
          startDate: format(parseISO(bookingItem.startDate), 'yyyy. MM. dd.'),
          endDate: format(parseISO(bookingItem.endDate), 'yyyy. MM. dd.')
        })
      });
      alert('Fizetési emlékeztető e-mail sikeresen elküldve!');
    }
  };

  const currentMonthBookings = bookings.filter(b => {
    if (filterStatus !== 'ALL' && b.status !== filterStatus) return false;
    const sDate = parseISO(b.startDate);
    const eDate = parseISO(b.endDate);
    return isSameMonth(sDate, currentDate) || isSameMonth(eDate, currentDate);
  });

  return (
    <div>
      <h1 style={{ marginBottom: '25px', color: '#222', textAlign: 'center', fontSize: '1.8rem' }}>Foglalások Részletes Kezelése</h1>
      
      <div className={styles.adminContainer}>
        {/* Bal oldali havi naptár nézet */}
        <div className={styles.calendarSidebar}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button className={styles.btnAction} onClick={() => setCurrentDate(addMonths(currentDate, -1))}>&larr; Előző hó</button>
            <button className={styles.btnAction} onClick={() => setCurrentDate(addMonths(currentDate, 1))}>Következő &rarr;</button>
          </div>
          {renderMonth(currentDate, 0)}

          {/* Státusz szűrő */}
          <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', boxShadow: 'rgba(0,0,0,0.05) 0px 2px 10px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#666', display: 'block', marginBottom: '8px' }}>Szűrés Státusz szerint:</label>
            <select 
              value={filterStatus} 
              onChange={e => setFilterStatus(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="ALL">Összes foglalás</option>
              <option value="PENDING">Csak Fizetésre várók (Függőben)</option>
              <option value="DEPOSIT">Csak Előleggel rendelkezők</option>
              <option value="PAID">Csak Teljesen kifizetettek</option>
            </select>
          </div>
        </div>

        {/* Jobb oldali részletes foglalási kártyák */}
        <div className={styles.cardsContainer}>
          <div className={styles.sectionHeader}>
            <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#333' }}>
              {format(currentDate, 'yyyy. MMMM', { locale: hu })} ({currentMonthBookings.length} foglalás)
            </h2>
          </div>

          {currentMonthBookings.length === 0 && (
            <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', textAlign: 'center', color: '#888' }}>
              Nincs a szűrésnek megfelelő foglalás ebben a hónapban.
            </div>
          )}

          {currentMonthBookings.map(b => {
            const totalPrice = b.totalPrice || 0;
            const paidAmount = b.paidAmount || 0;
            const remaining = Math.max(0, totalPrice - paidAmount);
            const isOverdue = b.status === 'PENDING' && (new Date().getTime() - new Date(b.createdAt || new Date()).getTime()) > 3 * 24 * 60 * 60 * 1000;
            const adultsCount = b.adults || 2;
            const childrenCount = b.children || 0;

            return (
              <div key={b.id} className={styles.card}>
                {/* 1. Fejléc sor: Név, Elérhetőségek és Azonosító */}
                <div className={styles.cardTopRow}>
                  <div className={styles.guestMain}>
                    <h3 className={styles.cardName}>{b.name}</h3>
                    <div className={styles.contactLinks}>
                      <span>✉️ <a href={`mailto:${b.email}`}>{b.email}</a></span>
                      <span>📞 <a href={`tel:${b.phone}`}>{b.phone}</a></span>
                    </div>
                  </div>

                  <div className={styles.cardIdBadge}>
                    <span className={styles.cardId}>{b.bookingId}</span>
                    <span>Rögzítve: {b.createdAt ? format(new Date(b.createdAt), 'yyyy.MM.dd. HH:mm') : '-'}</span>
                  </div>
                </div>

                {/* 2. Középső adatsáv: Dátumok, Vendéglétszám, Fizetési mód */}
                <div className={styles.cardMiddleGrid}>
                  <div className={styles.infoBlock}>
                    <span className={styles.infoLabel}>Időszak & Éjszakák</span>
                    <span className={styles.infoValue}>
                      {format(parseISO(b.startDate), 'yyyy.MM.dd.')} – {format(parseISO(b.endDate), 'yyyy.MM.dd.')} ({b.nights} éj)
                    </span>
                  </div>

                  <div className={styles.infoBlock}>
                    <span className={styles.infoLabel}>Vendégek létszáma</span>
                    <span className={styles.infoValue}>
                      👥 {adultsCount} felnőtt{childrenCount > 0 ? `, ${childrenCount} gyermek` : ''}
                      {b.ifaAmount ? ` (IFA: ${b.ifaAmount.toLocaleString('hu-HU')} Ft)` : ''}
                    </span>
                  </div>

                  <div className={styles.infoBlock}>
                    <span className={styles.infoLabel}>Fizetési Mód</span>
                    <span className={styles.infoValue}>
                      {b.paymentMethod === 'BARION' ? '💳 Barion Online Bankkártya' : '🏦 Közvetlen Banki Átutalás'}
                    </span>
                  </div>
                </div>

                {/* 3. Pénzügyi Áttekintő Sáv: Végösszeg | Befizetve | Hátralék */}
                <div className={styles.financeBox}>
                  <div className={styles.financeItem}>
                    <span className={styles.financeLabel}>Foglalás Végösszege</span>
                    <span className={styles.financeValue}>{totalPrice.toLocaleString('hu-HU')} Ft</span>
                  </div>

                  <div className={styles.financeItem}>
                    <span className={styles.financeLabel}>Eddig Befizetve</span>
                    <span className={`${styles.financeValue} ${styles.paidValue}`}>
                      {paidAmount > 0 ? `${paidAmount.toLocaleString('hu-HU')} Ft` : '0 Ft'}
                    </span>
                  </div>

                  <div className={styles.financeItem}>
                    <span className={styles.financeLabel}>Helyszínen / Még Fizetendő</span>
                    <span className={`${styles.financeValue} ${remaining > 0 ? styles.dueValue : styles.settledValue}`}>
                      {remaining > 0 ? `${remaining.toLocaleString('hu-HU')} Ft` : '✓ Teljesen kifizetve'}
                    </span>
                  </div>
                </div>

                {/* 4. Megjegyzés (ha van) */}
                {b.comment && (
                  <div className={styles.cardComment}>
                    <strong>Megjegyzés:</strong> {b.comment}
                  </div>
                )}

                {/* 5. Alsó gombsor és Státusz */}
                <div className={styles.cardBottomRow}>
                  <div>
                    {b.status === 'PENDING' && (
                      <span className={`${styles.badge} ${styles.badgePending}`}>
                        ⏳ Fizetésre vár (Függőben)
                      </span>
                    )}
                    {b.status === 'DEPOSIT' && (
                      <span className={`${styles.badge} ${styles.badgeDeposit}`}>
                        🔵 Előleg fizetve (30%)
                      </span>
                    )}
                    {b.status === 'PAID' && (
                      <span className={`${styles.badge} ${styles.badgePaid}`}>
                        ✓ Teljesen kifizetve (100%)
                      </span>
                    )}
                    {b.status === 'CANCELLED' && (
                      <span className={`${styles.badge} ${styles.badgeCancelled}`}>
                        ✕ Lemondva
                      </span>
                    )}
                  </div>

                  <div className={styles.cardActions}>
                    {b.status === 'PENDING' && (
                      <button 
                        type="button" 
                        className={styles.btnAction} 
                        onClick={() => handleSendReminder(b)}
                        title="48 órás fizetési emlékeztető küldése e-mailben"
                      >
                        📧 Emlékeztető
                      </button>
                    )}

                    <button 
                      className={`${styles.btnAction} ${styles.btnActionPrimary}`} 
                      onClick={() => { setSelectedBooking({...b}); setSendEmail(false); setIsModalOpen(true); }}
                    >
                      ✏️ Szerkesztés
                    </button>

                    <button 
                      className={`${styles.btnAction} ${styles.btnActionDanger}`} 
                      onClick={() => handleDelete(b.id)}
                    >
                      🗑️ Törlés
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Szerkesztési Modal */}
      {isModalOpen && selectedBooking && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>Foglalás Részletei és Szerkesztése</h2>
            <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '15px' }}>
              Azonosító: <strong>{selectedBooking.bookingId}</strong> | Rögzítve: {selectedBooking.createdAt ? format(new Date(selectedBooking.createdAt), 'yyyy.MM.dd. HH:mm') : '-'}
            </div>

            <div style={{ background: '#faf8f5', padding: '15px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.92rem' }}>
              <p style={{ margin: '4px 0' }}><strong>Vendég:</strong> {selectedBooking.name}</p>
              <p style={{ margin: '4px 0' }}><strong>E-mail:</strong> <a href={`mailto:${selectedBooking.email}`} style={{ color: '#c5a880' }}>{selectedBooking.email}</a></p>
              <p style={{ margin: '4px 0' }}><strong>Telefon:</strong> <a href={`tel:${selectedBooking.phone}`} style={{ color: '#c5a880' }}>{selectedBooking.phone}</a></p>
              <p style={{ margin: '4px 0' }}><strong>Időszak:</strong> {format(parseISO(selectedBooking.startDate), 'yyyy.MM.dd.')} – {format(parseISO(selectedBooking.endDate), 'yyyy.MM.dd.')} ({selectedBooking.nights} éjszaka)</p>
              <p style={{ margin: '4px 0' }}><strong>Létszám:</strong> {selectedBooking.adults || 2} felnőtt{selectedBooking.children ? `, ${selectedBooking.children} gyermek` : ''}</p>
              <p style={{ margin: '4px 0' }}><strong>Végösszeg:</strong> {selectedBooking.totalPrice?.toLocaleString('hu-HU')} Ft</p>
            </div>
            
            <form onSubmit={handleEditSave}>
              <div className={styles.formGroup}>
                <label>Befizetett Összeg (Ft)</label>
                <input 
                  type="number" 
                  value={selectedBooking.paidAmount || 0} 
                  onChange={e => setSelectedBooking({...selectedBooking, paidAmount: e.target.value})} 
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button type="button" className={styles.btnAction} onClick={() => setPaymentAmount('DEPOSIT')}>
                  30% Előleg Beállítása ({Math.round(selectedBooking.totalPrice * 0.3).toLocaleString('hu-HU')} Ft)
                </button>
                <button type="button" className={styles.btnAction} onClick={() => setPaymentAmount('FULL')}>
                  Teljes Összeg ({selectedBooking.totalPrice.toLocaleString('hu-HU')} Ft)
                </button>
              </div>

              <div className={styles.formGroup}>
                <label>Státusz</label>
                <select value={selectedBooking.status} onChange={e => setSelectedBooking({...selectedBooking, status: e.target.value})}>
                  <option value="PENDING">⏳ Fizetésre vár (Függőben)</option>
                  <option value="DEPOSIT">🔵 Előleg fizetve (30%)</option>
                  <option value="PAID">✓ Teljesen kifizetve (100%)</option>
                  <option value="CANCELLED">✕ Lemondva</option>
                </select>
              </div>

              <div className={styles.formGroup} style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input 
                  type="checkbox" 
                  id="sendEmailCheck"
                  checked={sendEmail} 
                  onChange={e => setSendEmail(e.target.checked)} 
                  style={{ width: 'auto', accentColor: '#c5a880', cursor: 'pointer' }}
                />
                <label htmlFor="sendEmailCheck" style={{ margin: 0, fontWeight: 'normal', cursor: 'pointer', fontSize: '0.9rem' }}>
                  Automatikus fizetés-visszaigazoló e-mail küldése a vendég részére.
                </label>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '25px' }}>
                <button type="button" className={styles.btnAction} onClick={() => setIsModalOpen(false)}>Mégsem</button>
                <button type="submit" className={`${styles.btnAction} ${styles.btnActionPrimary}`}>Változtatások Mentése</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
