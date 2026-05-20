"use client";

import { useState } from 'react';
import styles from './Gallery.module.css';
import Image from 'next/image';

export default function Gallery() {
  const [activeTab, setActiveTab] = useState<'kulo' | 'belso'>('belso');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const imagesBelso = [
    { src: '/images/gallery/bedroom.png', alt: 'Hálószoba' },
    { src: '/images/gallery/bathroom.png', alt: 'Fürdőszoba' },
    { src: '/images/gallery/interior_living.png', alt: 'Nappali' },
    { src: '/images/gallery/interior_kitchen.png', alt: 'Konyha' },
  ];

  const imagesKulso = [
    { src: '/images/gallery/exterior_garden.png', alt: 'Udvar és Kert' },
    { src: '/images/hero/hero.png', alt: 'Külső látkép' },
  ];

  const currentImages = activeTab === 'belso' ? imagesBelso : imagesKulso;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    document.body.style.overflow = 'hidden'; // Ne lehessen görgetni a háttérben
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    document.body.style.overflow = '';
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % currentImages.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + currentImages.length) % currentImages.length);
    }
  };

  return (
    <section className={`section ${styles.gallerySection}`} id="gallery">
      <div className="container">
        <h2 className="section-title">Képgaléria</h2>
        
        <div className={styles.tabContainer}>
          <div className={styles.tabGlass}>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'belso' ? styles.active : ''}`}
              onClick={() => setActiveTab('belso')}
            >
              Belső fotók
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'kulo' ? styles.active : ''}`}
              onClick={() => setActiveTab('kulo')}
            >
              Külső fotók
            </button>
            <div className={`${styles.slider} ${activeTab === 'kulo' ? styles.slideRight : ''}`}></div>
          </div>
        </div>

        <div className={styles.grid}>
          {currentImages.map((img, idx) => (
            <div key={idx} className={styles.imageWrapper} onClick={() => openLightbox(idx)}>
              <Image 
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={styles.image}
              />
              <div className={styles.overlay}>
                <span className={styles.zoomIcon}>🔍</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {lightboxIndex !== null && (
        <div className={styles.lightbox} onClick={closeLightbox}>
          <button className={styles.closeBtn} onClick={closeLightbox}>×</button>
          
          <button className={`${styles.navBtn} ${styles.prevBtn}`} onClick={prevImage}>&lsaquo;</button>
          
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <Image 
              src={currentImages[lightboxIndex].src}
              alt={currentImages[lightboxIndex].alt}
              fill
              className={styles.lightboxImg}
              sizes="100vw"
            />
          </div>

          <button className={`${styles.navBtn} ${styles.nextBtn}`} onClick={nextImage}>&rsaquo;</button>
          
          <div className={styles.imageCounter}>
            {lightboxIndex + 1} / {currentImages.length}
          </div>
        </div>
      )}
    </section>
  );
}
