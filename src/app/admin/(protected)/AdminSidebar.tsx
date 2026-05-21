"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './admin.module.css';

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [unapprovedCount, setUnapprovedCount] = useState(0);
  const router = useRouter();

  // Új értékelések számának lekérdezése
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch('/api/admin/reviews/count');
        if (res.ok) {
          const data = await res.json();
          setUnapprovedCount(data.count);
        }
      } catch (err) {
        console.error('Hiba a vélemények darabszámának lekérdezésekor:', err);
      }
    };

    fetchCount();
    
    // Frissítés 30 másodpercenként
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Inaktivitás figyelő (5 perc = 300 000 ms)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        // Automata kijelentkezés
        await fetch('/api/admin/logout', { method: 'POST' });
        router.push('/admin/login');
        router.refresh();
      }, 5 * 60 * 1000);
    };

    // Eseményfigyelők az aktivitás detektálására
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('click', resetTimer);
    window.addEventListener('scroll', resetTimer);

    // Kezdeti időzítő indítás
    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
      window.removeEventListener('scroll', resetTimer);
    };
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <>
      {/* Mobilos Hamburger Gomb */}
      <div className={styles.mobileHeader}>
        <button className={styles.hamburgerBtn} onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>
        <span className={styles.mobileTitle}>Admin Panel</span>
      </div>

      {/* Sötét háttér mobilon, ha nyitva van a menü */}
      {isOpen && <div className={styles.mobileOverlay} onClick={() => setIsOpen(false)}></div>}

      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
        <h2 style={{ color: '#c5a880', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Admin Panel
          <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>×</button>
        </h2>
        
        <nav className={styles.nav}>
          <Link href="/admin/dashboard" className={styles.navLink} onClick={() => setIsOpen(false)}>
            📊 Vezérlőpult
          </Link>
          <Link href="/admin/bookings" className={styles.navLink} onClick={() => setIsOpen(false)}>
            📅 Foglalások
          </Link>
          <Link href="/admin/reviews" className={styles.navLink} onClick={() => setIsOpen(false)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>⭐ Vélemények</span>
            {unapprovedCount > 0 && (
              <span className={styles.badge}>{unapprovedCount}</span>
            )}
          </Link>
          
          <hr style={{ borderColor: '#333', margin: '15px 0' }} />
          
          <a href="/" target="_blank" rel="noopener noreferrer" className={styles.navLink}>
            🌐 Weboldal megtekintése
          </a>
          
          <button onClick={handleLogout} className={styles.navLink} style={{ textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', marginTop: 'auto', color: '#ff6b6b' }}>
            🚪 Kijelentkezés
          </button>
        </nav>
      </aside>
    </>
  );
}
