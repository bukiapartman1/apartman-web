"use client";

import { useState, useEffect } from 'react';
import { 
  addMonths, subMonths, format, startOfMonth, endOfMonth, 
  startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, 
  isAfter, isBefore, isWithinInterval, parseISO 
} from 'date-fns';
import { hu } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import styles from './Calendar.module.css';
import ScrollReveal from './ScrollReveal';

export default function Calendar() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [monthsToShow, setMonthsToShow] = useState(3);
  const [selectedStart, setSelectedStart] = useState<Date | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<Date | null>(null);
  
  // Állapot a foglalások tárolására
  const [bookings, setBookings] = useState<Array<{ start: Date, end: Date }>>([]);

  useEffect(() => {
    const handleResize = () => {
      setMonthsToShow(window.innerWidth < 900 ? 1 : 3);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Foglalások lekérése
    const fetchBookings = async () => {
      try {
        const res = await fetch('/api/bookings');
        if (res.ok) {
          const data = await res.json();
          // Dátumok átalakítása Date objektummá
          const formatted = data.map((b: any) => ({
            start: parseISO(b.startDate),
            end: parseISO(b.endDate)
          }));
          setBookings(formatted);
        }
      } catch (err) {
        console.error('Error fetching bookings', err);
      }
    };
    fetchBookings();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, monthsToShow));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, monthsToShow));

  // Segédfüggvény a nap státuszának lekérdezéséhez
  const getDayStatus = (day: Date) => {
    // Keresünk olyan foglalást, ahol a nap megegyezik a kezdetével (checkin) vagy a végével (checkout)
    const isCheckin = bookings.some(b => isSameDay(day, b.start));
    const isCheckout = bookings.some(b => isSameDay(day, b.end));
    
    // Keresünk olyan foglalást, aminek teljesen a közepén van a nap
    const isFullyBooked = bookings.some(b => isAfter(day, b.start) && isBefore(day, b.end));

    if (isCheckin && isCheckout) return 'booked'; 
    if (isCheckout) return 'checkout'; 
    if (isCheckin) return 'checkin'; 
    if (isFullyBooked) return 'booked';
    return 'free';
  };

  const onDateClick = (day: Date) => {
    const status = getDayStatus(day);
    // Ha teljesen foglalt, nem lehet rákattintani
    if (status === 'booked') return;

    if (!selectedStart || (selectedStart && selectedEnd)) {
      setSelectedStart(day);
      setSelectedEnd(null);
    } else {
      // Ha a választott végdátum korábbi, mint a kezdet, akkor felülírja a kezdetet
      if (isBefore(day, selectedStart)) {
        setSelectedStart(day);
      } else {
        // Ellenőrizni kell, hogy a két dátum között van-e foglalt nap
        let current = addDays(selectedStart, 1);
        let hasBookedDay = false;
        while (isBefore(current, day)) {
          if (getDayStatus(current) === 'booked' || getDayStatus(current) === 'checkin' || getDayStatus(current) === 'checkout') {
            hasBookedDay = true;
            break;
          }
          current = addDays(current, 1);
        }

        if (hasBookedDay) {
          alert('A kiválasztott időszak foglalt napokat tartalmaz!');
          setSelectedStart(day);
          setSelectedEnd(null);
        } else {
          setSelectedEnd(day);
        }
      }
    }
  };

  const handleBookingStart = () => {
    if (selectedStart && selectedEnd) {
      const startStr = format(selectedStart, 'yyyy-MM-dd');
      const endStr = format(selectedEnd, 'yyyy-MM-dd');
      router.push(`/foglalas?start=${startStr}&end=${endStr}`);
    }
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
      <div key={idx} className={styles.monthBlock}>
        <div className={styles.monthName}>{format(monthDate, 'yyyy. MMMM', { locale: hu })}</div>
        <div className={styles.daysHeader}>
          {['H', 'K', 'Sze', 'Cs', 'P', 'Szo', 'V'].map(d => (
            <div key={d}>{d}</div>
          ))}
        </div>
        <div className={styles.daysGrid}>
          {days.map((d, i) => {
            if (!isSameMonth(d, monthStart)) {
              return <div key={i} className={`${styles.dayCell} ${styles.dayEmpty}`}></div>;
            }

            const status = getDayStatus(d);
            let cellClass = styles.dayCell;

            if (status === 'free') cellClass += ` ${styles.dayFree}`;
            else if (status === 'booked') cellClass += ` ${styles.dayBooked}`;
            else if (status === 'checkin') cellClass += ` ${styles.dayCheckin}`;
            else if (status === 'checkout') cellClass += ` ${styles.dayCheckout}`;

            // Kijelölés vizualizáció
            if (selectedStart && isSameDay(d, selectedStart)) {
              cellClass += ` ${styles.daySelected}`;
            } else if (selectedEnd && isSameDay(d, selectedEnd)) {
              cellClass += ` ${styles.daySelected}`;
            } else if (selectedStart && selectedEnd && isWithinInterval(d, { start: selectedStart, end: selectedEnd })) {
              cellClass += ` ${styles.dayInRange}`;
            }

            return (
              <div 
                key={i} 
                className={cellClass}
                onClick={() => onDateClick(d)}
              >
                {format(d, 'd')}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <section className={styles.calendarSection} id="calendar">
      <div className="container" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <ScrollReveal animation="slide-up" width="100%">
          <h2 className={styles.calendarTitle}>Foglalási naptár</h2>
        </ScrollReveal>
        
        <div className={styles.calendarContainer}>
          <ScrollReveal animation="fade" delay={100} width="100%">
            <div className={styles.controls}>
              <button className={styles.controlBtn} onClick={prevMonth}>&larr; Előző</button>
              <button className={styles.controlBtn} onClick={nextMonth}>Következő &rarr;</button>
            </div>
          </ScrollReveal>
          
          <ScrollReveal animation="slide-up" delay={300} width="100%">
            <div className={styles.monthsGrid}>
              {Array.from({ length: monthsToShow }).map((_, i) => 
                renderMonth(addMonths(currentDate, i), i)
              )}
            </div>
          </ScrollReveal>

          <ScrollReveal animation="slide-up" delay={500} width="100%">
            <div className={styles.actionArea}>
              <div className={styles.summaryText}>
                {selectedStart && selectedEnd 
                  ? `Kiválasztva: ${format(selectedStart, 'yyyy. MM. dd.')} - ${format(selectedEnd, 'yyyy. MM. dd.')}`
                  : 'Válassza ki az érkezés és a távozás napját!'}
              </div>
              <button 
                className={styles.calendarBtn} 
                disabled={!selectedStart || !selectedEnd}
                style={{ opacity: (!selectedStart || !selectedEnd) ? 0.5 : 1, cursor: (!selectedStart || !selectedEnd) ? 'not-allowed' : 'pointer' }}
                onClick={handleBookingStart}
              >
                Foglalás indítása
              </button>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
