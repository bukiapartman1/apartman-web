import Footer from '@/components/Footer';
import styles from './page.module.css';

export default function AszfPage() {
  return (
    <main className={styles.wrapper}>
      <div className={styles.content}>
        <h1 className={styles.title}>Általános Szerződési Feltételek (ÁSZF)</h1>
        <p className={styles.subtitle}>
          Érvényes: 2026. május 21-től visszavonásig | Harmónia Apartman, Bükfürdő
        </p>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. Szolgáltató Adatai</h2>
          <p className={styles.paragraph}>
            Jelen Általános Szerződési Feltételek (a továbbiakban: ÁSZF) a <span className={styles.highlight}>Harmónia Apartman</span> (a továbbiakban: Szolgáltató) szálláshely-szolgáltatási tevékenységére vonatkozik.
          </p>
          <ul className={styles.list}>
            <li className={styles.listItem}><span className={styles.highlight}>Szálláshely címe:</span> 9737 Bükfürdő, Teszt utca 1.</li>
            <li className={styles.listItem}><span className={styles.highlight}>Üzemeltető / Tulajdonos:</span> Teszt János E.V.</li>
            <li className={styles.listItem}><span className={styles.highlight}>Adószám:</span> 12345678-1-18</li>
            <li className={styles.listItem}><span className={styles.highlight}>NTAK regisztrációs szám:</span> EG26000001 (Magánszálláshely)</li>
            <li className={styles.listItem}><span className={styles.highlight}>E-mail cím:</span> bukiapartman1@gmail.com</li>
            <li className={styles.listItem}><span className={styles.highlight}>Telefonszám:</span> +36 30 123 4567</li>
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
          <h2 className={styles.sectionTitle}>3. Fizetési Feltételek és Árak</h2>
          <p className={styles.paragraph}>
            A szálláshely aktuális árai a honlapon találhatóak. Az árak tartalmazzák a közüzemi díjakat, az ágyneműt, a törölközőket és a végtakarítás díját, de <span className={styles.highlight}>nem tartalmazzák az Idegenforgalmi Adót (IFA)</span>.
          </p>
          <p className={styles.paragraph}>
            <span className={styles.highlight}>Idegenforgalmi adó (IFA):</span> A helyi önkormányzati rendeletnek megfelelően 18 év feletti vendégek részére külön fizetendő, melynek mértéke jelenleg 600 Ft / fő / éjszaka.
          </p>
          <p className={styles.paragraph}>
            <span className={styles.highlight}>Fizetési ütemezés:</span>
          </p>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              A foglalás biztosításához a foglalási végösszeg <span className={styles.highlight}>30%-át előlegként</span> kell megfizetni banki átutalással az automatikus visszaigazolástól számított 3 munkanapon belül.
            </li>
            <li className={styles.listItem}>
              A fennmaradó 70%-os összeget legkésőbb az érkezést megelőző napig banki átutalással, vagy a helyszínen érkezéskor készpénzben kell kiegyenlíteni.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>4. Lemondási Feltételek</h2>
          <p className={styles.paragraph}>
            A Vendég a foglalását az alábbi feltételek szerint mondhatja le vagy módosíthatja:
          </p>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              Az érkezési napot megelőző <span className={styles.highlight}>14. napig</span> a foglalás ingyenesen lemondható. Ebben az esetben a befizetett előleg teljes összege visszajár (az utalási költségek levonása mellett).
            </li>
            <li className={styles.listItem}>
              Az érkezést megelőző 14 napon belüli lemondás vagy meg nem jelenés (No Show) esetén a befizetett <span className={styles.highlight}>30% előleg meghiúsulási kötbérként</span> a Szolgáltatónál marad, az nem jár vissza.
            </li>
            <li className={styles.listItem}>
              Amennyiben a Vendég a lefoglalt időszak vége előtt távozik a szálláshelyről, a Szolgáltató nem köteles a szállásdíj fennmaradó részét visszatéríteni.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>5. Érkezés és Távozás (Check-in & Check-out)</h2>
          <p className={styles.paragraph}>
            A szálláshelyet az érkezés napján <span className={styles.highlight}>14:00 órától 18:00 óráig</span> lehet elfoglalni (ettől eltérő időpontot előzetesen egyeztetni kell).
          </p>
          <p className={styles.paragraph}>
            A távozás napján az apartmant legkésőbb <span className={styles.highlight}>10:00 óráig</span> el kell hagyni, átadva a kulcsokat a Szolgáltató képviselőjének. Késői távozás kizárólag előzetes megbeszélés és szabad kapacitás esetén lehetséges, felár ellenében.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>6. Házirend és Felelősségvállalás</h2>
          <p className={styles.paragraph}>
            A szálláshelyen csak a foglalásban bejelentett számú vendég tartózkodhat. Idegen látogatókat kizárólag a tulajdonos előzetes hozzájárulásával szabad fogadni.
          </p>
          <p className={styles.paragraph}>
            <span className={styles.highlight}>Dohányzás:</span> Az apartman épületén belül a dohányzás és az elektromos cigaretta használata szigorúan TILOS! Dohányozni kizárólag az udvaron, a kijelölt helyen megengedett.
          </p>
          <p className={styles.paragraph}>
            <span className={styles.highlight}>Károk és felelősség:</span> A Vendég a szálláshely berendezési tárgyait rendeltetésszerűen köteles használni. A gondatlanságból vagy szándékosan okozott károkért a Vendég anyagi felelősséggel tartozik, a kárt a helyszínen köteles megtéríteni.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>7. Panaszkezelés és Jogviták</h2>
          <p className={styles.paragraph}>
            A szálláshely-szolgáltatással kapcsolatos esetleges panaszokat a Vendég a tartózkodása alatt haladéktalanul köteles jelezni a Szolgáltatónak, hogy a hiba elhárítása megtörténhessen. Utólagos, távozás utáni reklamációt a Szolgáltató nem fogad el.
          </p>
          <p className={styles.paragraph}>
            Jelen szerződésben nem szabályozott kérdésekben a Ptk. (Polgári Törvénykönyv) és a magánszálláshelyek működésére vonatkozó hatályos magyar jogszabályok rendelkezései az irányadóak.
          </p>
        </section>
      </div>
      <Footer />
    </main>
  );
}
