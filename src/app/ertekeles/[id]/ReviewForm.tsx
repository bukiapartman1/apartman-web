"use client";

import { useState } from 'react';
import Link from 'next/link';
import styles from './ertekeles.module.css';

interface Booking {
  id: string;
  name: string;
  startDate: Date | string;
  endDate: Date | string;
  review?: any;
}

export default function ReviewForm({ booking }: { booking: Booking }) {
  const [cleanliness, setCleanliness] = useState<number>(10);
  const [communication, setCommunication] = useState<number>(10);
  const [location, setLocation] = useState<number>(10);
  const [overall, setOverall] = useState<number>(10);
  const [comment, setComment] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(!!booking.review);
  const [error, setError] = useState('');

  const formatDate = (dateVal: Date | string) => {
    const d = new Date(dateVal);
    return d.toLocaleDateString('hu-HU', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: booking.id,
          guestName: booking.name,
          ratingCleanliness: cleanliness,
          ratingCommunication: communication,
          ratingLocation: location,
          ratingOverall: overall,
          comment,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Valami hiba történt a beküldés során.');
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Hiba történt.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    {
      id: 'cleanliness',
      label: 'Tisztaság',
      value: cleanliness,
      setValue: setCleanliness,
    },
    {
      id: 'communication',
      label: 'Kommunikáció',
      value: communication,
      setValue: setCommunication,
    },
    {
      id: 'location',
      label: 'Elhelyezkedés',
      value: location,
      setValue: setLocation,
    },
    {
      id: 'overall',
      label: 'Összbenyomás',
      value: overall,
      setValue: setOverall,
    },
  ];

  if (submitted) {
    return (
      <div className={styles.successCard}>
        <div className={styles.successIcon}>✓</div>
        <h2 className={styles.successTitle}>Köszönjük a visszajelzést!</h2>
        <p className={styles.successText}>
          Kedves {booking.name}, véleményét sikeresen rögzítettük.<br />
          Nagyra értékeljük, hogy megosztotta velünk a tapasztalatait.
        </p>
        <Link href="/" className={styles.homeBtn}>
          Vissza a főoldalra
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2>Harmónia Apartman</h2>
        <p className={styles.subtitle}>Értékelje a nálunk eltöltött napokat</p>
      </div>

      <div className={styles.bookingInfo}>
        <strong>Kedves {booking.name}!</strong><br />
        Kérjük, értékelje a <strong>{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</strong> közötti tartózkodását az alábbi szempontok szerint.
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit}>
        {categories.map((category) => (
          <div key={category.id} className={styles.formGroup}>
            <div className={styles.categoryTitle}>
              <span>{category.label}</span>
              <span className={styles.categoryScore}>{category.value} / 10</span>
            </div>
            
            <div className={styles.ratingScale}>
              {Array.from({ length: 10 }, (_, i) => i + 1).map((score) => (
                <button
                  key={score}
                  type="button"
                  onClick={() => category.setValue(score)}
                  className={`${styles.ratingButton} ${category.value === score ? styles.ratingButtonActive : ''}`}
                >
                  {score}
                </button>
              ))}
            </div>
            
            <div className={styles.labelInfo}>
              <span>Nem voltam elégedett</span>
              <span>Tökéletes volt</span>
            </div>
          </div>
        ))}

        <div className={styles.formGroup}>
          <label htmlFor="comment" className={styles.categoryTitle} style={{ fontSize: '1.05rem', marginBottom: '8px' }}>
            Szöveges vélemény
          </label>
          <textarea
            id="comment"
            rows={4}
            placeholder="Ossza meg velünk részletesebb véleményét, észrevételeit..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className={styles.textarea}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={styles.submitBtn}
        >
          {isSubmitting ? 'Küldés folyamatban...' : 'Értékelés beküldése'}
        </button>
      </form>
    </div>
  );
}
