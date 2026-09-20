import Link from 'next/link';
import Footer from '@/components/Footer';
import { siteConfig } from '@/lib/siteConfig';
import styles from './arak.module.css';

export const metadata = {
  title: 'Áraink & Szezonalitás | Harmónia Apartman Bükfürdő',
  description: 'Ismerje meg a Harmónia Apartman kedvező árait, szezonális díjszabását és ingyenes szolgáltatásait. Foglaljon közvetlenül a legjobb áron!',
};

export default function ArakPage() {
  const { pricing, ifa, includedServices, capacity } = siteConfig;

  return (
    <div className={styles.container}>
      <main className={styles.mainContent}>
        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.title}>Áraink & Szezonalitás</h1>
          <p className={styles.subtitle}>
            Foglaljon közvetlenül honlapunkon rejtett költségek nélkül! Áraink az egész apartmanra (akár {capacity.maxTotalGuests} főre) érvényesek, és tartalmazzák az összes kényelmi szolgáltatást.
          </p>
        </header>

        {/* Season Cards */}
        <div className={styles.seasonGrid}>
          {/* Elő- és utószezon */}
          <div className={styles.seasonCard}>
            <h2 className={styles.seasonName}>{pricing.lowSeason.name}</h2>
            <div className={styles.seasonPeriod}>{pricing.lowSeason.period}</div>
            <div className={styles.priceBox}>
              <span className={styles.priceAmount}>{pricing.lowSeason.pricePerNight.toLocaleString('hu-HU')} Ft</span>
              <span className={styles.priceUnit}>/ apartman / éj</span>
            </div>
            <ul className={styles.cardFeatures}>
              <li><span className={styles.checkIcon}>✓</span> Min. {pricing.lowSeason.minNights} éjszaka foglalható</li>
              <li><span className={styles.checkIcon}>✓</span> Akár {capacity.maxTotalGuests} fő részére</li>
              <li><span className={styles.checkIcon}>✓</span> Ingyenes zárt parkoló & Wi-Fi</li>
              <li><span className={styles.checkIcon}>✓</span> Korlátlan klímahasználat</li>
            </ul>
            <Link href="/#naptar" className={styles.cardBtn}>
              Időpont kiválasztása
            </Link>
          </div>

          {/* Nyári főszezon (Kiemelt) */}
          <div className={`${styles.seasonCard} ${styles.featuredCard}`}>
            <span className={styles.badge}>Legnépszerűbb</span>
            <h2 className={styles.seasonName}>{pricing.highSeason.name}</h2>
            <div className={styles.seasonPeriod}>{pricing.highSeason.period}</div>
            <div className={styles.priceBox}>
              <span className={styles.priceAmount}>{pricing.highSeason.pricePerNight.toLocaleString('hu-HU')} Ft</span>
              <span className={styles.priceUnit}>/ apartman / éj</span>
            </div>
            <ul className={styles.cardFeatures}>
              <li><span className={styles.checkIcon}>✓</span> Min. {pricing.highSeason.minNights} éjszaka foglalható</li>
              <li><span className={styles.checkIcon}>✓</span> Akár {capacity.maxTotalGuests} fő részére</li>
              <li><span className={styles.checkIcon}>✓</span> Teljesen felszerelt teraszos apartman</li>
              <li><span className={styles.checkIcon}>✓</span> Termálfürdő közelsége</li>
            </ul>
            <Link href="/#naptar" className={`${styles.cardBtn} ${styles.cardBtnPrimary}`}>
              Foglalás indítása
            </Link>
          </div>

          {/* Kiemelt Ünnepi Időszak */}
          <div className={styles.seasonCard}>
            <h2 className={styles.seasonName}>{pricing.peakSeason.name}</h2>
            <div className={styles.seasonPeriod}>{pricing.peakSeason.period}</div>
            <div className={styles.priceBox}>
              <span className={styles.priceAmount}>{pricing.peakSeason.pricePerNight.toLocaleString('hu-HU')} Ft</span>
              <span className={styles.priceUnit}>/ apartman / éj</span>
            </div>
            <ul className={styles.cardFeatures}>
              <li><span className={styles.checkIcon}>✓</span> Min. {pricing.peakSeason.minNights} éjszaka foglalható</li>
              <li><span className={styles.checkIcon}>✓</span> Ünnepi bekészítés & ajándék kávé</li>
              <li><span className={styles.checkIcon}>✓</span> Privát, csendes pihenés</li>
              <li><span className={styles.checkIcon}>✓</span> Rugalmas érkezés és távozás</li>
            </ul>
            <Link href="/#naptar" className={styles.cardBtn}>
              Ünnepi foglalás
            </Link>
          </div>
        </div>

        {/* Kedvezmények Banner */}
        <div className={styles.discountSection}>
          <div>
            <div className={styles.discountTitle}>Hosszabb tartózkodási kedvezmények</div>
            <div className={styles.discountDesc}>Töltsön több időt pihenéssel és spóroljon automatikusan az apartman árából!</div>
          </div>
          <div className={styles.discountTags}>
            {pricing.discounts.map((disc, idx) => (
              <div key={idx} className={styles.discountTag}>
                {disc.label}
              </div>
            ))}
          </div>
        </div>

        {/* Szolgáltatások (Amit az ár tartalmaz) */}
        <h3 className={styles.sectionTitle}>Mit tartalmaz a szállásdíj?</h3>
        <div className={styles.amenitiesGrid}>
          {includedServices.map((service, index) => (
            <div key={index} className={styles.amenityCard}>
              <div className={styles.amenityIcon}>★</div>
              <div className={styles.amenityContent}>
                <h4>{service.title}</h4>
                <p>{service.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Fontos információk & IFA */}
        <div className={styles.termsBox}>
          <h3>Fontos tudnivalók & Fizetési feltételek</h3>
          <ul className={styles.termsList}>
            <li>
              <strong>Idegenforgalmi Adó (IFA):</strong> {ifa.pricePerPersonPerNight.toLocaleString('hu-HU')} Ft / felnőtt (18 év felett) / éjszaka, mely a foglaláskor automatikusan kalkulálásra kerül. 18 év alatti vendégeink számára díjmentes.
            </li>
            <li>
              <strong>Fizetési módok:</strong> Biztonságos online bankkártyás fizetés Barionon keresztül (akár 30% előleg vagy 100% teljes összeg), illetve közvetlen banki átutalás.
            </li>
            <li>
              <strong>Érkezés & Távozás:</strong> Bejelentkezés az érkezés napján 14:00-tól, kijelentkezés a távozás napján 10:00-ig.
            </li>
            <li>
              <strong>Lemondási feltételek:</strong> Az érkezést megelőző 14. napig a foglalás díjmentesen lemondható vagy módosítható.
            </li>
          </ul>
        </div>

        {/* CTA Banner */}
        <div className={styles.ctaSection}>
          <h3 style={{ color: '#fff', fontSize: '1.8rem', marginBottom: '15px' }}>Készen áll a kikapcsolódásra?</h3>
          <p style={{ color: '#aaa', marginBottom: '25px' }}>Válassza ki a kívánt dátumot a naptárban és foglalja le pihenését pár perc alatt!</p>
          <Link href="/#naptar" className={styles.ctaBtn}>
            Szabad Időpontok és Foglalás
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
