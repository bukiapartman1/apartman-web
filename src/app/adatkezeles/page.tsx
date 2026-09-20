import Footer from '@/components/Footer';
import { siteConfig } from '@/lib/siteConfig';
import styles from './page.module.css';

export const metadata = {
  title: `Adatkezelési Tájékoztató | ${siteConfig.name}`,
  description: `A ${siteConfig.name} hivatalos adatvédelmi és adatkezelési szabályzata (GDPR megfelelőség).`,
};

export default function AdatkezelesPage() {
  const { contact, shortName } = siteConfig;

  return (
    <main className={styles.wrapper}>
      <div className={styles.content}>
        <h1 className={styles.title}>Adatkezelési Tájékoztató</h1>
        <p className={styles.subtitle}>
          Hatályos: 2026. május 21-től | {siteConfig.name}
        </p>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. Az Adatkezelő Adatai</h2>
          <p className={styles.paragraph}>
            Jelen tájékoztató célja, hogy a <span className={styles.highlight}>{shortName}</span> (a továbbiakban: Adatkezelő vagy Szolgáltató) vendégei, látogatói számára átlátható és érthető információt nyújtson a weboldalon (online foglalási rendszer, kapcsolatfelvétel) kezelt személyes adatok köréről, az adatkezelés céljáról, jogalapjáról és az érintettek jogairól a GDPR (2016/679/EU rendelet) előírásainak megfelelően.
          </p>
          <ul className={styles.list}>
            <li className={styles.listItem}><span className={styles.highlight}>Üzemeltető:</span> {contact.owner} ({shortName})</li>
            <li className={styles.listItem}><span className={styles.highlight}>Székhely / Szálláshely:</span> {contact.address}</li>
            <li className={styles.listItem}><span className={styles.highlight}>Adószám:</span> {contact.taxNumber}</li>
            <li className={styles.listItem}><span className={styles.highlight}>NTAK regisztrációs szám:</span> {contact.ntak}</li>
            <li className={styles.listItem}><span className={styles.highlight}>E-mail cím:</span> {contact.email}</li>
            <li className={styles.listItem}><span className={styles.highlight}>Telefonszám:</span> {contact.phone}</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>2. A Kezelt Személyes Adatok Köre és Célja</h2>
          <p className={styles.paragraph}>
            Az Adatkezelő a szolgáltatások nyújtása során az alábbi személyes adatokat kezeli:
          </p>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <span className={styles.highlight}>Szállásfoglalás:</span> Név, e-mail cím, telefonszám, érkezési és távozási dátum, felnőttek és gyermekek száma, megjegyzések, választott fizetési mód. 
              <br/><em>Cél:</em> Szálláshely-szolgáltatási szerződés megkötése, visszaigazolása, teljesítése és kapcsolattartás.
              <br/><em>Jogalap:</em> GDPR 6. cikk (1) bek. b) pont (szerződés teljesítése).
            </li>
            <li className={styles.listItem}>
              <span className={styles.highlight}>Számlázási adatok:</span> Név, lakcím/székhely, adószám (céges számla esetén).
              <br/><em>Cél:</em> Számviteli és adójogi kötelezettségek teljesítése.
              <br/><em>Jogalap:</em> GDPR 6. cikk (1) bek. c) pont (jogi kötelezettség teljesítése).
            </li>
            <li className={styles.listItem}>
              <span className={styles.highlight}>Vendégkönyv / NTAK adatszolgáltatás:</span> A hatályos jogszabályok szerinti okmányadatok érkezéskor (VIZA rendszer).
              <br/><em>Jogalap:</em> Jogi kötelezettség teljesítése.
            </li>
            <li className={styles.listItem}>
              <span className={styles.highlight}>Kapcsolatfelvétel:</span> Név, e-mail cím, telefonszám, üzenet szövege.
              <br/><em>Cél:</em> Érdeklődések megválaszolása.
              <br/><em>Jogalap:</em> GDPR 6. cikk (1) bek. a) pont (hozzájárulás) és f) pont (jogos érdek).
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>3. Online Fizetés (Barion) és Adattovábbítás</h2>
          <p className={styles.paragraph}>
            A weboldalon lehetőség van a foglalási előleg vagy a teljes szállásdíj online bankkártyás kiegyenlítésére a <span className={styles.highlight}>Barion Payment Zrt.</span> által üzemeltetett biztonságos fizetési felületen keresztül.
          </p>
          <p className={styles.paragraph}>
            Online fizetés választása esetén a fizetési folyamat lebonyolítása érdekében a foglaláshoz kapcsolódó adatok (foglalási azonosító, összeg, vendég neve és e-mail címe) átadásra kerülnek a Barion Payment Zrt. részére mint önálló adatkezelőnek:
          </p>
          <ul className={styles.list}>
            <li className={styles.listItem}><span className={styles.highlight}>Fizetési szolgáltató:</span> Barion Payment Zrt.</li>
            <li className={styles.listItem}><span className={styles.highlight}>Székhely:</span> 1117 Budapest, Infopark sétány 1. I. épület 5. emelet 5.</li>
            <li className={styles.listItem}><span className={styles.highlight}>Cégjegyzékszám:</span> 01-10-048552, <span className={styles.highlight}>Adószám:</span> 25353052-2-43</li>
            <li className={styles.listItem}><span className={styles.highlight}>Felügyeleti szerv:</span> Magyar Nemzeti Bank (MNB engedély száma: H-EN-I-1064/2013)</li>
          </ul>
          <p className={styles.paragraph}>
            <span className={styles.highlight}>Fontos biztonsági garancia:</span> A bankkártyaadatokat (kártyaszám, lejárati dátum, CVC/CVV kód) kizárólag a Barion Payment Zrt. titkosított, nemzetközi PCI-DSS biztonsági tanúsítvánnyal rendelkező szerverei kezelik. Az Adatkezelő a bankkártyaadatokhoz semmilyen formában nem fér hozzá, azokat nem tárolja és nem látja.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>4. Adatfeldolgozók</h2>
          <p className={styles.paragraph}>
            Az Adatkezelő a szolgáltatás üzemeltetése során megbízható technikai adatfeldolgozókat vesz igénybe:
          </p>
          <ul className={styles.list}>
            <li className={styles.listItem}><span className={styles.highlight}>Webtárhely és szerverszolgáltatás:</span> Vercel Inc. / AWS Cloud Infrastructure</li>
            <li className={styles.listItem}><span className={styles.highlight}>Adatbázis szolgáltató:</span> Neon Inc. (titkosított felhő alapú adatbázis)</li>
            <li className={styles.listItem}><span className={styles.highlight}>E-mail továbbítás:</span> Google Workspace / Gmail (Google Ireland Ltd.)</li>
            <li className={styles.listItem}><span className={styles.highlight}>Online fizetési kapu:</span> Barion Payment Zrt.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>5. Az Adatkezelés Időtartama</h2>
          <p className={styles.paragraph}>
            - Foglalási és kapcsolattartási adatok: A foglalás teljesítésétől számított legfeljebb 2 évig, vagy a vonatkozó elévülési idő végéig.
            <br/>
            - Számviteli bizonylatok és számlák: A Számvitelről szóló 2000. évi C. törvény 169. § (2) bekezdése alapján 8 évig kötelező megőrizni.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>6. Az Érintettek Jogai és Jogorvoslat</h2>
          <p className={styles.paragraph}>
            A Vendég bármikor jogosult:
          </p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Tájékoztatást kérni személyes adatai kezeléséről (hozzáférés joga).</li>
            <li className={styles.listItem}>Kérni pontatlan személyes adatainak helyesbítését.</li>
            <li className={styles.listItem}>Kérni személyes adatainak törlését vagy az adatkezelés korlátozását (amennyiben azt jogszabályi kötelezettség nem zárja ki).</li>
            <li className={styles.listItem}>Tiltakozni a jogos érdeken alapuló adatkezelés ellen.</li>
          </ul>
          <p className={styles.paragraph}>
            Jogérvényesítési kérelmét az Adatkezelő a <span className={styles.highlight}>{contact.email}</span> e-mail címen fogadja.
          </p>
          <p className={styles.paragraph}>
            Amennyiben a Vendég úgy véli, hogy adatkezelése nem felelt meg a jogszabályoknak, panasszal élhet a <span className={styles.highlight}>Nemzeti Adatvédelmi és Információszabadság Hatóságnál (NAIH)</span>:
            <br/>Cím: 1055 Budapest, Falk Miksa utca 9-11. | Honlap: <a href="https://naih.hu" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-color)' }}>www.naih.hu</a> | E-mail: ugyfelszolgalat@naih.hu
          </p>
        </section>
      </div>
      <Footer />
    </main>
  );
}
