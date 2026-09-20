import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import { siteConfig } from '@/lib/siteConfig';
import styles from './kapcsolat.module.css';

export const metadata: Metadata = {
  title: `Kapcsolat | ${siteConfig.name} - Elérhetőségek és Térkép`,
  description: `Lépjen kapcsolatba velünk! ${siteConfig.name} - Telefon: ${siteConfig.contact.phone}, E-mail: ${siteConfig.contact.email}. Címünk: ${siteConfig.contact.address}`,
};

export default function KapcsolatPage() {
  const { contact } = siteConfig;

  return (
    <main className={styles.kapcsolatSection}>
      <div className="container">
        <div className={styles.titleContainer}>
          <h1 className={styles.pageTitle}>Kapcsolat</h1>
          <p className={styles.subtitle}>
            Kérdése van, vagy segítségre van szüksége a foglalással kapcsolatban? 
            Küldjön üzenetet, vagy keressen minket elérhetőségeinken!
          </p>
        </div>

        <div className={styles.grid}>
          {/* Left Column: Contact details */}
          <div className={styles.infoCard}>
            <div>
              <h2 className={styles.infoTitle}>Elérhetőségek</h2>
              <div className={styles.infoList}>
                {/* Email */}
                <div className={styles.infoItem}>
                  <div className={styles.infoItemHeader}>
                    <div className={styles.iconWrapper}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                    </div>
                    <div className={styles.infoLabel}>E-mail</div>
                  </div>
                  <div className={styles.infoValue}>
                    <a href={`mailto:${contact.email}`}>{contact.email}</a>
                  </div>
                </div>

                {/* Phone */}
                <div className={styles.infoItem}>
                  <div className={styles.infoItemHeader}>
                    <div className={styles.iconWrapper}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                    </div>
                    <div className={styles.infoLabel}>Telefon</div>
                  </div>
                  <div className={styles.infoValue}>
                    <a href={`tel:${contact.phone.replace(/\s+/g, '')}`}>{contact.phone}</a>
                  </div>
                </div>

                {/* Address */}
                <div className={styles.infoItem}>
                  <div className={styles.infoItemHeader}>
                    <div className={styles.iconWrapper}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                    </div>
                    <div className={styles.infoLabel}>Helyszín & Cím</div>
                  </div>
                  <div className={styles.infoValue}>
                    {contact.address}
                  </div>
                </div>

                {/* NTAK */}
                <div className={styles.infoItem}>
                  <div className={styles.infoItemHeader}>
                    <div className={styles.iconWrapper}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                      </svg>
                    </div>
                    <div className={styles.infoLabel}>NTAK Nyilvántartás</div>
                  </div>
                  <div className={styles.infoValue}>
                    {contact.ntak}
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className={styles.socialSection}>
              <h3 className={styles.socialTitle}>Kövessen minket</h3>
              <div className={styles.socialGrid}>
                {/* Facebook */}
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`${styles.socialLink} ${styles.facebook}`}
                  title="Facebook"
                  id="social-facebook-link"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                  </svg>
                </a>

                {/* Instagram */}
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`${styles.socialLink} ${styles.instagram}`}
                  title="Instagram"
                  id="social-instagram-link"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Contact form */}
          <ContactForm />
        </div>

        {/* Embedded Map */}
        <div className={styles.mapContainer}>
          <iframe
            src={`https://maps.google.com/maps?q=${encodeURIComponent(contact.address)}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
            className={styles.map}
            allowFullScreen
            loading="lazy"
            title={`${siteConfig.name} Google Térkép Helyszín`}
            id="google-map-iframe"
          />
        </div>
      </div>
      <Footer />
    </main>
  );
}
