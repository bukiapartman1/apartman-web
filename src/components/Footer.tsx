import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.brand}>Premium Apartman</div>
        <div className={styles.links}>
          <a href="/#about" className={styles.link}>Rólunk</a>
          <a href="/galeria" className={styles.link}>Galéria</a>
          <a href="/#calendar" className={styles.link}>Foglalás</a>
          <a href="/aszf" className={styles.link}>ÁSZF</a>
        </div>
        <div className={styles.copyright}>
          &copy; {currentYear} Premium Apartman. Minden jog fenntartva.
          <br/>
          <div style={{ marginTop: '15px', fontSize: '0.8rem', color: '#888', lineHeight: '1.5' }}>
            Készítette: <a href="https://rekalaca-webdesign.hu/" target="_blank" rel="noopener noreferrer" title="Weboldal készítés kiadó szállásnak, apartmannak, nyaralónak, hétvégi háznak" style={{ color: '#c5a880', textDecoration: 'none', fontWeight: 'bold' }}>rekalaca-webdesign.hu</a>
            <p style={{ fontSize: '0.72rem', color: '#777', marginTop: '6px', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto' }}>
              Egyedi weboldal készítés kiadó szállásnak, apartmannak, nyaralónak és hétvégi háznak. Szállásfoglaló oldalak (Booking.com, Szallas.hu) összekapcsolása, egyedi kódolás és időpontfoglaló rendszer automata üzenetekkel Nyíregyházán és Szabolcs-Szatmár-Bereg megyében, a Balatonnál, a Velencei-tónál és országosan.
            </p>
          </div>
          <br/>
          <a href="/aszf" style={{ color: '#555', fontSize: '0.8rem', textDecoration: 'none', marginRight: '15px' }}>ÁSZF</a>
          |
          <a href="/admin/login" style={{ color: '#555', fontSize: '0.8rem', textDecoration: 'none', marginLeft: '15px' }}>Admin Belépés</a>
        </div>
      </div>
    </footer>
  );
}
