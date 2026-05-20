import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.brand}>Premium Apartman</div>
        <div className={styles.links}>
          <a href="#about" className={styles.link}>Rólunk</a>
          <a href="#gallery" className={styles.link}>Galéria</a>
          <a href="#booking" className={styles.link}>Foglalás</a>
        </div>
        <div className={styles.copyright}>
          &copy; {currentYear} Premium Apartman. Minden jog fenntartva.
          <br/>
          Készítette: <a href="https://rekalaca-webdesign.hu/" target="_blank" rel="noopener noreferrer" style={{ color: '#c5a880', textDecoration: 'none' }}>rekalaca-webdesign</a>
          <br/><br/>
          <a href="/admin/login" style={{ color: '#555', fontSize: '0.8rem', textDecoration: 'none' }}>Admin Belépés</a>
        </div>
      </div>
    </footer>
  );
}
