import Footer from '@/components/Footer';
import { siteConfig } from '@/lib/siteConfig';
import styles from './page.module.css';

export const metadata = {
  title: `Általános Szerződési Feltételek (ÁSZF) | ${siteConfig.name}`,
  description: `A ${siteConfig.name} hivatalos Általános Szerződési Feltételei és házirendje.`,
};

export default function AszfPage() {
  const { contact, ifa, shortName, bank } = siteConfig;

  return (
    <main className={styles.wrapper}>
      <div className={styles.content}>
        <h1 className={styles.title}>Általános Szerződési Feltételek (ÁSZF)</h1>
        <p className={styles.subtitle}>
          Érvényes: 2026. május 21-től visszavonásig | {siteConfig.name}
        </p>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. Szolgáltató Adatai</h2>
          <p className={styles.paragraph}>
            Jelen Általános Szerződési Feltételek (a továbbiakban: ÁSZF) a <span className={styles.highlight}>{shortName}</span> (a továbbiakban: Szolgáltató) szálláshely-szolgáltatási tevékenységére vonatkozik.
          </p>
          <ul className={styles.list}>
            <li className={styles.listItem}><span className={styles.highlight}>Szálláshely címe:</span> {contact.address}</li>
            <li className={styles.listItem}><span className={styles.highlight}>Üzemeltető / Tulajdonos:</span> {contact.owner}</li>
            <li className={styles.listItem}><span className={styles.highlight}>Adószám:</span> {contact.taxNumber}</li>
            <li className={styles.listItem}><span className={styles.highlight}>NTAK regisztrációs szám:</span> {contact.ntak}</li>
            <li className={styles.listItem}><span className={styles.highlight}>E-mail cím:</span> {contact.email}</li>
            <li className={styles.listItem}><span className={styles.highlight}>Telefonszám:</span> {contact.phone}</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>2. A Szerződés Létrejötte, a Foglalás Menete</h2>
          <p className={styles.paragraph}>
            A Vendég a weboldalon található foglalási naptár segítségével küldheti el foglalási igényét. A foglalás elküldésével a Vendég elfogadja a jelen ÁSZF és a Házirend feltételeit.
          </p>
          <p className={styles.paragraph}>
            A foglalási igény elküldését követően a rendszer egy automatikus e-mail visszaigazolást küld a Vendég részére a foglalás adataival és a fizetési információkkal. 
            A szerződés a szálláshely és a Vendég között a foglalás véglegesítésével és az előleg megfizetésével válik hivatalossá.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>3. Fizetési Módok, Feltételek és Árak</h2>
          <p className={styles.paragraph}>
            A szálláshely aktuális árai a honlapon találhatóak. Az árak tartalmazzák a közüzemi díjakat, az ágyneműt, a törölközőket és a végtakarítás díját, valamint a foglalás során feltüntetésre kerül az Idegenforgalmi Adó (IFA) is.
          </p>
          <p className={styles.paragraph}>
            <span className={styles.highlight}>Idegenforgalmi adó (IFA):</span> A helyi önkormányzati rendeletnek megfelelően 18 év feletti vendégek részére külön fizetendő, melynek mértéke {ifa.pricePerPersonPerNight} Ft / fő / éjszaka.
          </p>
          <p className={styles.paragraph}>
            <span className={styles.highlight}>Választható fizetési módok és ütemezés:</span>
          </p>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <span className={styles.highlight}>1. Online bankkártyás fizetés (Barion):</span> A foglaláskor a Vendég kényelmesen és díjmentesen kiegyenlítheti a 30%-os előleget vagy a teljes szállásdíjat a <span className={styles.highlight}>Barion Payment Zrt.</span> biztonságos fizetési felületén keresztül. A fizetés azonnal jóváírásra kerül, így a foglalás azonnal véglegessé és garantálttá válik. A bankkártyaadatok a Szolgáltatóhoz nem jutnak el, a tranzakció a Barion MNB által felügyelt (engedélyszám: H-EN-I-1064/2013), nemzetközi PCI-DSS biztonsági előírásoknak megfelelő szerverén történik.
            </li>
            <li className={styles.listItem}>
              <span className={styles.highlight}>2. Banki átutalás:</span> A foglalási végösszeg <span className={styles.highlight}>30%-át előlegként</span> kell megfizetni banki átutalással a visszaigazoló e-mailben megadott {bank.bankName} bankszámlaszámra a foglalástól számított 3 munkanapon belül. A közlemény rovatban fel kell tüntetni a Vendég nevét és a foglalási azonosítót.
            </li>
            <li className={styles.listItem}>
              <span className={styles.highlight}>Fennmaradó összeg:</span> Előlegfizetés esetén a fennmaradó összeget legkésőbb az érkezést megelőző napig banki átutalással, vagy a helyszínen érkezéskor kell kiegyenlíteni.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>4. Lemondási és Módosítási Feltételek</h2>
          <p className={styles.paragraph}>
            - <span className={styles.highlight}>Díjmentes lemondás:</span> Az érkezési napot megelőző legalább 14 nappal a foglalás díjmentesen lemondható vagy módosítható.
          </p>
          <p className={styles.paragraph}>
            - <span className={styles.highlight}>14 napon belüli lemondás:</span> 14 napon belüli lemondás esetén a befizetett előleg (30%) nem jár vissza, az kötbérként a Szolgáltatót illeti meg.
          </p>
          <p className={styles.paragraph}>
            - <span className={styles.highlight}>Meg nem érkezés (No-show):</span> Amennyiben a Vendég az érkezési napon nem jelenik meg és erről nem tájékoztatja a Szolgáltatót, a foglalás törlésre kerül és a teljes összeg kiszámlázásra kerülhet.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>5. Érkezés, Távozás és Házirend</h2>
          <p className={styles.paragraph}>
            - <span className={styles.highlight}>Érkezés (Check-in):</span> Az apartmant az érkezés napján <strong>14:00</strong> órától lehet elfoglalni. Korábbi érkezés csak előzetes egyeztetés és kapacitás függvényében lehetséges.
          </p>
          <p className={styles.paragraph}>
            - <span className={styles.highlight}>Távozás (Check-out):</span> A távozás napján kérjük az apartmant legkésőbb <strong>10:00</strong> óráig elhagyni.
          </p>
          <p className={styles.paragraph}>
            - <span className={styles.highlight}>Dohányzás:</span> Az apartman épületén belül szigorúan <span className={styles.highlight}>TILOS</span> a dohányzás! Dohányozni kizárólag a kijelölt teraszon szabad.
          </p>
          <p className={styles.paragraph}>
            - <span className={styles.highlight}>Csendrendelet:</span> Kérjük vendégeinket, hogy 22:00 és 08:00 óra között tartsák tiszteletben a szomszédok nyugalmát.
          </p>
          <p className={styles.paragraph}>
            - <span className={styles.highlight}>Háziállatok:</span> Az apartmanban háziállatok elhelyezésére nincs lehetőség.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>6. Károkozás és Felelősség</h2>
          <p className={styles.paragraph}>
            A Vendég köteles a szálláshely berendezési tárgyait rendeltetésszerűen használni. A gondatlanságból vagy szándékosan okozott károkért a Vendég teljes anyagi felelősséggel tartozik, a kár megtérítése a helyszínen azonnal esedékes.
          </p>
        </section>
      </div>
      <Footer />
    </main>
  );
}
