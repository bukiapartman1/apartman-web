"use client";

import styles from './About.module.css';
import Image from 'next/image';
import ScrollReveal from './ScrollReveal';

export default function About() {
  return (
    <section className={`section ${styles.about}`} id="about">
      <div className="container">
        <div className={styles.wrapper}>
          <ScrollReveal animation="slide-left">
            <div className={styles.textContainer}>
              <h2 className={styles.heading}>Tökéletes pihenés,<br/>kompromisszumok nélkül</h2>
              <p className={styles.paragraph}>
                Lépjen be egy olyan világba, ahol a modern elegancia és az otthonos kényelem találkozik. 
                Hegyek közt lévő, erdő és gyógyfürdő közeli vidéki házunk, melyhez egy szép, gondozott kert is tartozik, 
                tökéletes menedéket nyújt minden idelátogatónak.
              </p>
              <p className={styles.paragraph}>
                Minden részletet úgy alakítottunk ki, hogy az Ön maximális kényelmét szolgálja a prémium anyaghasználattól 
                kezdve a bőséges kikapcsolódási lehetőségekig.
              </p>
              <ul className={styles.features}>
                <li>Zárt parkoló</li>
                <li>Bográcsozási és grillezési lehetőség</li>
                <li>Billiárd és ping-pong asztal</li>
                <li>Teljesen felszerelt, modern konyha</li>
                <li>Ingyenes, villámgyors Wi-Fi és Netflix</li>
                <li>Légkondicionált helyiségek</li>
              </ul>
              <button className={styles.aboutBtn} onClick={() => document.getElementById('calendar')?.scrollIntoView({ behavior: 'smooth' })}>
                Foglalás indítása
              </button>
            </div>
          </ScrollReveal>
          <ScrollReveal animation="slide-right" delay={200}>
            <div className={styles.imageContainer}>
              <Image 
                src="/images/gallery/bedroom.png" 
                alt="Hálószoba belső tér" 
                width={800} 
                height={600} 
                className={styles.image}
                priority
              />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
