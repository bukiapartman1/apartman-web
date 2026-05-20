"use client";

import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <span className={styles.subtitle}>Üdvözlünk a Harmónia Vendégház oldalán</span>
        <h1 className={styles.title}>Kiadó apartman a Mátra szívében</h1>
        <button 
          className={styles.heroBtn}
          onClick={() => document.getElementById('calendar')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Időpontfoglalás
        </button>
      </div>
    </section>
  );
}
