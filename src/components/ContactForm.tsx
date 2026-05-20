import styles from './ContactForm.module.css';

export default function ContactForm() {
  return (
    <section className={`section ${styles.contact}`} id="booking">
      <div className="container">
        <h2 className="section-title" style={{ color: 'var(--white)' }}>Foglalás & Kapcsolat</h2>
        <div className={styles.wrapper}>
          <div className={styles.info}>
            <h3 className={styles.infoTitle}>Várjuk jelentkezését</h3>
            <p className={styles.infoText}>
              Kérjen ajánlatot vagy foglaljon időpontot online. Munkatársaink 24 órán belül felveszik Önnel a kapcsolatot.
            </p>
            <div className={styles.detail}>📍 1051 Budapest, Példa utca 12.</div>
            <div className={styles.detail}>📞 +36 30 123 4567</div>
            <div className={styles.detail}>✉️ hello@premiumapartman.hu</div>
          </div>
          
          <form className={styles.form}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Név</label>
              <input type="text" className={styles.input} placeholder="Teljes név" required />
            </div>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>E-mail cím</label>
              <input type="email" className={styles.input} placeholder="pelda@email.hu" required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Érkezés</label>
                <input type="date" className={styles.input} required />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Távozás</label>
                <input type="date" className={styles.input} required />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Üzenet</label>
              <textarea className={styles.textarea} placeholder="Kérdése vagy egyedi kérése van?"></textarea>
            </div>

            <button type="button" className="btn-primary" style={{ marginTop: '10px' }}>
              Ajánlatkérés küldése
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
