"use client";

import { useEffect, useState, useMemo } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { parseISO, format, isAfter, isBefore, isSameDay, addMonths, subMonths } from 'date-fns';
import { hu } from 'date-fns/locale';

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
    <div style={{ padding: '20px 0', width: '98%', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px', color: '#333', textAlign: 'center' }}>Vezérlőpult - Statisztikák</h1>
      
      {/* 1. Diagram: Napi bontás a kiválasztott hónapra */}
      <div style={{ background: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '40px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px', gap: '15px' }}>
          <h3 style={{ color: '#666', margin: 0, textAlign: 'center' }}>Napi foglaltság ({format(currentDate, 'yyyy. MMMM', { locale: hu })})</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              style={{ padding: '8px 16px', border: '1px solid #ccc', background: 'white', borderRadius: '4px', cursor: 'pointer' }}
            >
              &larr; Előző hónap
            </button>
            <button 
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              style={{ padding: '8px 16px', border: '1px solid #ccc', background: 'white', borderRadius: '4px', cursor: 'pointer' }}
            >
              Következő hónap &rarr;
            </button>
          </div>
        </div>
        
        {monthData.length > 0 ? (
          <div style={{ width: '100%', height: 350 }}>
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
      <div style={{ background: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <h3 style={{ marginBottom: '20px', color: '#666', textAlign: 'center' }}>Havi Összesített Vendégéjszakák Száma</h3>
        {yearData.length > 0 ? (
          <div style={{ width: '100%', height: 350 }}>
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
