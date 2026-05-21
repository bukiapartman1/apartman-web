import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import styles from './kapcsolat.module.css';

export const metadata: Metadata = {
  title: 'Kapcsolat | Premium Apartman - Elérhetőségek és Térkép',
  description: 'Lépjen kapcsolatba velünk! Premium Apartman Nyíregyháza - Telefon: +36 30 444 2569, E-mail: info@rekalaca-webdesign.hu. Címünk: 4400 Nyíregyháza, Kiss Ernő utca 44-46.',
};

export default function KapcsolatPage() {
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
                  <div className={styles.iconWrapper}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                  <div>
                    <div className={styles.infoLabel}>E-mail</div>
                    <div className={styles.infoValue}>
                      <a href="mailto:info@rekalaca-webdesign.hu">info@rekalaca-webdesign.hu</a>
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className={styles.infoItem}>
                  <div className={styles.iconWrapper}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </div>
                  <div>
                    <div className={styles.infoLabel}>Telefon</div>
                    <div className={styles.infoValue}>
                      <a href="tel:+36304442569">+36 30 444 2569</a>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className={styles.infoItem}>
                  <div className={styles.iconWrapper}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <div>
                    <div className={styles.infoLabel}>Helyszín</div>
                    <div className={styles.infoValue}>
                      4400 Nyíregyháza, Kiss Ernő utca 44-46.
                    </div>
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
                  href="https://www.facebook.com/people/Rekalaca-Webdesign/100092414973212/" 
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

                {/* Messenger */}
                <a 
                  href="https://www.messenger.com/login.php?next=https%3A%2F%2Fwww.messenger.com%2Ft%2F114156438327652%2F%3Fmessaging_source%3Dsource%253Apages%253Amessage_shortlink%26source_id%3D1441792%26recurring_notification%3D0" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`${styles.socialLink} ${styles.messenger}`}
                  title="Messenger"
                  id="social-messenger-link"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.14 2 11.25c0 2.91 1.45 5.51 3.73 7.15.19.14.3.36.3.6l.01 1.86c0 .54.58.91 1.07.67l2.09-1.03c.18-.09.39-.1.58-.04 1.36.37 2.79.57 4.25.57 5.52 0 10-4.14 10-9.25C22 6.14 17.52 2 12 2zm1.2 12.3l-2.07-2.21-4.03 2.21 4.43-4.7 2.1 2.21 4-2.21-4.43 4.7z"/>
                  </svg>
                </a>

                {/* WhatsApp */}
                <a 
                  href="https://api.whatsapp.com/send/?phone=36304442569&text&type=phone_number&app_absent=0" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`${styles.socialLink} ${styles.whatsapp}`}
                  title="WhatsApp"
                  id="social-whatsapp-link"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.59 2.028 14.11 1 11.482 1c-5.442 0-9.866 4.372-9.87 9.802 0 1.814.504 3.59 1.46 5.184l-.997 3.639 3.79-.974.192.115zm10.963-7.54c-.29-.146-1.72-.85-1.983-.946-.264-.096-.456-.145-.648.146-.192.29-.744.945-.91 1.139-.167.194-.334.219-.624.073-.29-.145-1.224-.452-2.33-1.44-.86-.767-1.44-1.716-1.609-2.007-.168-.29-.018-.447.128-.592.13-.13.29-.34.435-.509.145-.17.193-.29.29-.485.097-.194.048-.364-.025-.509-.072-.146-.648-1.562-.888-2.144-.233-.563-.47-.487-.648-.495l-.552-.007c-.192 0-.505.073-.77.364-.264.29-1.01.987-1.01 2.405 0 1.417 1.034 2.784 1.178 2.977.145.195 2.036 3.11 4.931 4.364.688.3 1.225.478 1.643.612.693.22 1.324.19 1.823.115.556-.083 1.72-.704 1.962-1.385.243-.68.243-1.264.17-1.385-.072-.122-.263-.195-.552-.34z"/>
                  </svg>
                </a>

                {/* Instagram */}
                <a 
                  href="https://www.instagram.com/rekalaca.webdesign/" 
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
            src="https://maps.google.com/maps?q=4400%20Ny%C3%ADregyh%C3%A1za,%20Kiss%20Ern%C5%91%20utca%2044-46&t=&z=16&ie=UTF8&iwloc=&output=embed"
            className={styles.map}
            allowFullScreen
            loading="lazy"
            title="Apartman Google Térkép Helyszín"
            id="google-map-iframe"
          />
        </div>
      </div>
      <Footer />
    </main>
  );
}
