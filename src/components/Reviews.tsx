"use client";

import { useEffect, useState, useMemo } from 'react';
import styles from './Reviews.module.css';
import ScrollReveal from './ScrollReveal';

interface Review {
  id: string;
  guestName: string;
  ratingCleanliness: number;
  ratingCommunication: number;
  ratingLocation: number;
  ratingOverall: number;
  comment: string;
  reply: string | null;
  replyAt: string | null;
  createdAt: string;
  booking?: {
    startDate: string;
    endDate: string;
  };
}

const MOCK_REVIEWS: Review[] = [
  {
    id: "mock-1",
    guestName: "Kovács Péter",
    ratingCleanliness: 10,
    ratingCommunication: 10,
    ratingLocation: 9,
    ratingOverall: 10,
    comment: "Csodálatos 5 napot töltöttünk el a Harmónia Apartmanban. A tisztaság makulátlan volt, a kert gyönyörű és tökéletes a pihenéshez. A házigazda rendkívül segítőkész. Biztosan visszatérünk!",
    reply: "Kedves Péter! Köszönjük a kedves szavakat. Nagy örömünkre szolgált, hogy nálunk pihentek. Várunk vissza Benneteket szeretettel legközelebb is!",
    replyAt: "2026-05-12T14:30:00Z",
    createdAt: "2026-05-12T10:00:00Z",
  },
  {
    id: "mock-2",
    guestName: "Nagy Andrea",
    ratingCleanliness: 9,
    ratingCommunication: 10,
    ratingLocation: 10,
    ratingOverall: 9,
    comment: "A ház nagyon jól felszerelt, a billiárdasztal és a ping-pong szuper kikapcsolódás volt az esősebb napokon is. Gyalog is rendkívül közel van a gyógyfürdő és az erdő is.",
    reply: "Kedves Andrea! Köszönjük a visszajelzést. Külön örülünk, hogy a játékterem elnyerte a tetszését! Reméljük, hamarosan ismét vendégünk lesz.",
    replyAt: "2026-05-18T18:00:00Z",
    createdAt: "2026-05-18T12:00:00Z",
  },
  {
    id: "mock-3",
    guestName: "Szabó Gábor",
    ratingCleanliness: 10,
    ratingCommunication: 9,
    ratingLocation: 9,
    ratingOverall: 10,
    comment: "Családdal voltunk itt egy hosszú hétvégére. Nagyon kényelmesek az ágyak, csendes, nyugodt a környék, a gyerekek imádták a hatalmas udvart. Mindenkinek csak ajánlani tudom!",
    reply: null,
    replyAt: null,
    createdAt: "2026-05-20T08:00:00Z",
  }
];

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch('/api/reviews');
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            setReviews(data);
          } else {
            setReviews(MOCK_REVIEWS);
          }
        } else {
          setReviews(MOCK_REVIEWS);
        }
      } catch (err) {
        setReviews(MOCK_REVIEWS);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // Automatikus lapozás 8 másodpercenként
  useEffect(() => {
    if (reviews.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 8000);

    return () => clearInterval(timer);
  }, [reviews]);

  const stats = useMemo(() => {
    if (reviews.length === 0) return { overall: 10, cleanliness: 10, communication: 10, location: 10 };
    
    const count = reviews.length;
    const sumCleanliness = reviews.reduce((sum, r) => sum + r.ratingCleanliness, 0);
    const sumCommunication = reviews.reduce((sum, r) => sum + r.ratingCommunication, 0);
    const sumLocation = reviews.reduce((sum, r) => sum + r.ratingLocation, 0);
    const sumOverall = reviews.reduce((sum, r) => sum + r.ratingOverall, 0);

    return {
      overall: parseFloat((sumOverall / count).toFixed(1)),
      cleanliness: parseFloat((sumCleanliness / count).toFixed(1)),
      communication: parseFloat((sumCommunication / count).toFixed(1)),
      location: parseFloat((sumLocation / count).toFixed(1)),
    };
  }, [reviews]);

  const nextSlide = () => {
    if (reviews.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevSlide = () => {
    if (reviews.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('hu-HU', { year: 'numeric', month: 'long' });
  };

  if (loading) {
    return (
      <section className={styles.reviewsSection} id="reviews">
        <div className="container" style={{ textAlign: 'center', padding: '50px 0' }}>
          <p style={{ color: '#666' }}>Vélemények betöltése...</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.reviewsSection} id="reviews">
      <div className="container">
        <ScrollReveal animation="slide-up">
          <h2 className="section-title">Vendégeink Véleménye</h2>
        </ScrollReveal>

        <div className={styles.grid}>
          {/* Bal oldal: statisztikai kártya */}
          <ScrollReveal animation="slide-left" delay={100}>
            <div className={styles.scoreSummaryCard}>
              <div className={styles.scoreBig}>{stats.overall}</div>
              <div className={styles.scoreOutOf}>10-es skálán</div>
              
              <div className={styles.stars}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>

              <div className={styles.categoryList}>
                <div className={styles.categoryProgress}>
                  <div className={styles.categoryHeader}>
                    <span>Tisztaság</span>
                    <span>{stats.cleanliness} / 10</span>
                  </div>
                  <div className={styles.progressBarBg}>
                    <div 
                      className={styles.progressBar} 
                      style={{ width: `${stats.cleanliness * 10}%` }}
                    />
                  </div>
                </div>

                <div className={styles.categoryProgress}>
                  <div className={styles.categoryHeader}>
                    <span>Kommunikáció</span>
                    <span>{stats.communication} / 10</span>
                  </div>
                  <div className={styles.progressBarBg}>
                    <div 
                      className={styles.progressBar} 
                      style={{ width: `${stats.communication * 10}%` }}
                    />
                  </div>
                </div>

                <div className={styles.categoryProgress}>
                  <div className={styles.categoryHeader}>
                    <span>Elhelyezkedés</span>
                    <span>{stats.location} / 10</span>
                  </div>
                  <div className={styles.progressBarBg}>
                    <div 
                      className={styles.progressBar} 
                      style={{ width: `${stats.location * 10}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Jobb oldal: Vélemény csúszka */}
          <ScrollReveal animation="slide-right" delay={200}>
            <div className={styles.sliderContainer}>
              <div className={styles.sliderWrapper}>
                <div className={styles.sliderTrack}>
                  {reviews.map((review, idx) => (
                    <div 
                      key={review.id} 
                      className={`${styles.slide} ${currentIndex === idx ? styles.slideActive : ''}`}
                    >
                      <div className={styles.reviewCard}>
                        <div className={styles.reviewTop}>
                          <div className={styles.reviewerInfo}>
                            <h4>{review.guestName}</h4>
                            <span className={styles.reviewerDate}>
                              {formatDate(review.createdAt)}
                            </span>
                          </div>
                          <div className={styles.reviewerScore}>
                            {review.ratingOverall} / 10
                          </div>
                        </div>

                        <p className={styles.comment}>
                          &ldquo;{review.comment}&rdquo;
                        </p>

                        {review.reply && (
                          <div className={styles.replyBox}>
                            <div className={styles.replyHeader}>A Harmónia Apartman válasza:</div>
                            <p className={styles.replyText}>{review.reply}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vezérlők */}
              {reviews.length > 1 && (
                <div className={styles.controls}>
                  <div className={styles.dots}>
                    {reviews.map((_, idx) => (
                      <span 
                        key={idx} 
                        className={`${styles.dot} ${currentIndex === idx ? styles.dotActive : ''}`}
                        onClick={() => setCurrentIndex(idx)}
                      />
                    ))}
                  </div>
                  
                  <div className={styles.navigation}>
                    <button className={styles.navBtn} onClick={prevSlide} aria-label="Előző vélemény">
                      &larr;
                    </button>
                    <button className={styles.navBtn} onClick={nextSlide} aria-label="Következő vélemény">
                      &rarr;
                    </button>
                  </div>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
