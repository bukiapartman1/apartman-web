"use client";

import { useEffect, useState, useMemo } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { parseISO, format, isAfter, isBefore, isSameDay, addMonths, subMonths } from 'date-fns';
import { hu } from 'date-fns/locale';
import styles from './dashboard.module.css';

export default function DashboardPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date()); // Ezt használjuk a havi léptetéshez

  // Foglalások betöltése
  useEffect(() => {
    const fetchBookings = async () => {
      const res = await fetch('/api/bookings');
      if (res.ok) {
        setBookings(await res.json());
      }
    };
    fetchBookings();
  }, []);

  // 1. Diagram adatai: Jelenleg kiválasztott hónap (naponta)
  const monthData = useMemo(() => {
    if (!bookings.length) return [];
    
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const chartData = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      
      const booking = bookings.find((b: any) => {
        const start = parseISO(b.startDate);
        const end = parseISO(b.endDate);
        return (isAfter(date, start) && isBefore(date, end)) || isSameDay(date, start) || isSameDay(date, end);
      });

      if (booking) {
        chartData.push({ name: `${i}.`, 'Éjszakák': booking.nights });
      } else {
        chartData.push({ name: `${i}.`, 'Éjszakák': 0 });
      }
    }
    return chartData;
  }, [bookings, currentDate]);

  // 2. Diagram adatai: Éves/Havi összesítés (hónaponként)
  const yearData = useMemo(() => {
    const stats: Record<string, number> = {};
    const monthsList = ['Január', 'Február', 'Március', 'Április', 'Május', 'Június', 'Július', 'Augusztus', 'Szeptember', 'Október', 'November', 'December'];
    
    // Alapértelmezett 0 érték minden hónapra
    monthsList.forEach(m => stats[m] = 0);

    if (bookings.length > 0) {
      bookings.forEach((b: any) => {
        const monthName = format(parseISO(b.startDate), 'MMMM', { locale: hu });
        // Első betű nagybetűsítése, hogy megegyezzen a fenti listával
        const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
        if (stats[capitalizedMonth] !== undefined) {
          stats[capitalizedMonth] += b.nights;
        }
      });
    }

    return monthsList.map(m => ({
      name: m.slice(0, 3), // Rövidített név a diagramon (Jan, Feb, Már...)
      'Vendégéjszakák': Math.min(stats[m], 31) // Maximum 31 lehet
    }));
  }, [bookings]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Vezérlőpult - Statisztikák</h1>
      
      {/* 1. Diagram: Napi bontás a kiválasztott hónapra */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <h3 className={styles.chartTitle}>Napi foglaltság ({format(currentDate, 'yyyy. MMMM', { locale: hu })})</h3>
          <div className={styles.btnGroup}>
            <button 
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              className={styles.btn}
            >
              &larr; Előző hónap
            </button>
            <button 
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              className={styles.btn}
            >
              Következő hónap &rarr;
            </button>
          </div>
        </div>
        
        {monthData.length > 0 ? (
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="step" dataKey="Éjszakák" stroke="#c5a880" fill="#c5a880" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p>Még nincsenek foglalási adatok.</p>
        )}
      </div>

      {/* 2. Diagram: Havi összesített éjszakák */}
      <div className={`${styles.chartCard} ${styles.chartCardAlt}`}>
        <h3 className={styles.chartTitle} style={{ marginBottom: '20px' }}>Havi Összesített Vendégéjszakák Száma</h3>
        {yearData.length > 0 ? (
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 31]} ticks={[0, 5, 10, 15, 20, 25, 31]} />
                <Tooltip />
                <Bar dataKey="Vendégéjszakák" fill="#2e7d32" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p>Még nincsenek foglalási adatok.</p>
        )}
      </div>
      
    </div>
  );
}
