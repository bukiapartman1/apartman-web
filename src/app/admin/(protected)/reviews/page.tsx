"use client";

import { useEffect, useState, useMemo } from 'react';
import styles from './page.module.css';

interface Review {
  id: string;
  bookingId: string;
  guestName: string;
  ratingCleanliness: number;
  ratingCommunication: number;
  ratingLocation: number;
  ratingOverall: number;
  comment: string;
  reply: string | null;
  replyAt: string | null;
  approved: boolean;
  createdAt: string;
  booking?: {
    startDate: string;
    endDate: string;
    totalPrice: number;
    status: string;
  };
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Válasz kezelésének állapotai
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Értékelések betöltése
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/reviews');
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      } else {
        throw new Error('Nem sikerült betölteni a véleményeket.');
      }
    } catch (err: any) {
      setError(err.message || 'Hiba történt a betöltés során.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Statisztikák számítása
  const stats = useMemo(() => {
    if (reviews.length === 0) {
      return {
        total: 0,
        pending: 0,
        avgOverall: 0,
        avgCleanliness: 0,
        avgCommunication: 0,
        avgLocation: 0
      };
    }

    const total = reviews.length;
    const pending = reviews.filter(r => !r.approved).length;

    const sumCleanliness = reviews.reduce((sum, r) => sum + r.ratingCleanliness, 0);
    const sumCommunication = reviews.reduce((sum, r) => sum + r.ratingCommunication, 0);
    const sumLocation = reviews.reduce((sum, r) => sum + r.ratingLocation, 0);
    const sumOverall = reviews.reduce((sum, r) => sum + r.ratingOverall, 0);

    return {
      total,
      pending,
      avgCleanliness: parseFloat((sumCleanliness / total).toFixed(1)),
      avgCommunication: parseFloat((sumCommunication / total).toFixed(1)),
      avgLocation: parseFloat((sumLocation / total).toFixed(1)),
      avgOverall: parseFloat((sumOverall / total).toFixed(1)),
    };
  }, [reviews]);

  // Jóváhagyás állapotának módosítása
  const handleToggleApprove = async (id: string, currentApprovedStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved: !currentApprovedStatus }),
      });

      if (!res.ok) throw new Error('Sikertelen mentés.');

      setReviews(prev =>
        prev.map(r => (r.id === id ? { ...r, approved: !currentApprovedStatus } : r))
      );
    } catch (err: any) {
      alert(err.message || 'Hiba történt.');
    }
  };

  // Vélemény törlése
  const handleDelete = async (id: string) => {
    if (!window.confirm('Biztosan törölni szeretné ezt a véleményt? Ez a művelet nem vonható vissza.')) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Sikertelen törlés.');

      setReviews(prev => prev.filter(r => r.id !== id));
    } catch (err: any) {
      alert(err.message || 'Hiba történt.');
    }
  };

  // Válasz mentése vagy módosítása
  const handleSaveReply = async (id: string) => {
    if (!replyText.trim()) return;

    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply: replyText }),
      });

      if (!res.ok) throw new Error('Sikertelen válaszadás.');

      const updatedReview = await res.json();
      
      setReviews(prev =>
        prev.map(r => (r.id === id ? { ...r, reply: updatedReview.reply, replyAt: updatedReview.replyAt } : r))
      );

      setReplyingId(null);
      setEditingId(null);
      setReplyText('');
    } catch (err: any) {
      alert(err.message || 'Hiba történt.');
    }
  };

  // Válasz törlése
  const handleDeleteReply = async (id: string) => {
    if (!window.confirm('Biztosan törölni szeretné a válaszát?')) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply: null }),
      });

      if (!res.ok) throw new Error('Sikertelen választörlés.');

      setReviews(prev =>
        prev.map(r => (r.id === id ? { ...r, reply: null, replyAt: null } : r))
      );
    } catch (err: any) {
      alert(err.message || 'Hiba történt.');
    }
  };

  const getScoreClass = (score: number) => {
    if (score >= 9) return styles.scoreValueHigh;
    if (score >= 7) return styles.scoreValueMedium;
    return styles.scoreValueLow;
  };

  const formatDate = (dateVal: string | undefined) => {
    if (!dateVal) return '-';
    const d = new Date(dateVal);
    return d.toLocaleDateString('hu-HU', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  const formatDateTime = (dateVal: string | null) => {
    if (!dateVal) return '-';
    const d = new Date(dateVal);
    return d.toLocaleString('hu-HU', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: 'center', padding: '40px 0', fontSize: '1.2rem', color: '#666' }}>
          Vélemények betöltése...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.titleSection}>
        <h1 className={styles.title}>Vendégvélemények Kezelése</h1>
      </div>

      {error && <div style={{ color: 'red', margin: '20px 0', textAlign: 'center' }}>{error}</div>}

      {/* Statisztikai összesítő */}
      {reviews.length > 0 && (
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statTitle}>Összes értékelés</div>
            <div className={styles.statValue}>{stats.total} db</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statTitle}>Jóváhagyásra vár</div>
            <div className={styles.statValue} style={{ color: stats.pending > 0 ? '#ff6b6b' : '#2e7d32' }}>
              {stats.pending} db
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statTitle}>Átlag pontszám</div>
            <div className={`${styles.statValue} ${styles.statScore}`}>{stats.avgOverall} / 10</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statTitle}>Tisztaság átlag</div>
            <div className={styles.statValue}>{stats.avgCleanliness}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statTitle}>Kommunikáció átlag</div>
            <div className={styles.statValue}>{stats.avgCommunication}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statTitle}>Elhelyezkedés átlag</div>
            <div className={styles.statValue}>{stats.avgLocation}</div>
          </div>
        </div>
      )}

      {/* Értékelések listája */}
      {reviews.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Még nem érkezett értékelés az adatbázisba.</p>
        </div>
      ) : (
        <div className={styles.listContainer}>
          {reviews.map((review) => (
            <div 
              key={review.id} 
              className={`${styles.reviewCard} ${review.approved ? styles.reviewCardApproved : styles.reviewCardUnapproved}`}
            >
              <div className={styles.reviewHeader}>
                <div className={styles.guestInfo}>
                  <h3>{review.guestName}</h3>
                  {review.booking && (
                    <div className={styles.stayPeriod}>
                      Utazás időpontja: <strong>{formatDate(review.booking.startDate)} - {formatDate(review.booking.endDate)}</strong>
                    </div>
                  )}
                  <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '3px' }}>
                    Beküldve: {formatDateTime(review.createdAt)}
                  </div>
                </div>
                
                <div className={styles.headerBadges}>
                  <span className={`${styles.statusBadge} ${review.approved ? styles.badgeApproved : styles.badgeUnapproved}`}>
                    {review.approved ? 'Jóváhagyva' : 'Jóváhagyásra vár'}
                  </span>
                </div>
              </div>

              {/* Részletes pontszámok */}
              <div className={styles.scoreGrid}>
                <div className={styles.scoreItem}>
                  <span className={styles.scoreLabel}>Tisztaság</span>
                  <span className={`${styles.scoreValue} ${getScoreClass(review.ratingCleanliness)}`}>
                    {review.ratingCleanliness}
                  </span>
                </div>
                <div className={styles.scoreItem}>
                  <span className={styles.scoreLabel}>Kommunikáció</span>
                  <span className={`${styles.scoreValue} ${getScoreClass(review.ratingCommunication)}`}>
                    {review.ratingCommunication}
                  </span>
                </div>
                <div className={styles.scoreItem}>
                  <span className={styles.scoreLabel}>Elhelyezkedés</span>
                  <span className={`${styles.scoreValue} ${getScoreClass(review.ratingLocation)}`}>
                    {review.ratingLocation}
                  </span>
                </div>
                <div className={styles.scoreItem}>
                  <span className={styles.scoreLabel}>Összbenyomás</span>
                  <span className={`${styles.scoreValue} ${getScoreClass(review.ratingOverall)}`}>
                    {review.ratingOverall}
                  </span>
                </div>
              </div>

              {/* Szöveges vélemény */}
              <div className={styles.commentBox}>
                &ldquo;{review.comment}&rdquo;
              </div>

              {/* Házigazda válasza */}
              {review.reply ? (
                <div className={styles.replyContainer}>
                  <div className={styles.replyTitle}>
                    <span>A Harmónia Apartman válasza:</span>
                    <span className={styles.replyDate}>{formatDateTime(review.replyAt)}</span>
                  </div>
                  <p className={styles.replyText}>{review.reply}</p>
                </div>
              ) : null}

              {/* Válaszadási űrlap */}
              {(replyingId === review.id || editingId === review.id) && (
                <div className={styles.replyForm}>
                  <textarea
                    rows={3}
                    className={styles.replyTextarea}
                    placeholder="Írja meg a válaszát a vendégnek..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button 
                      className={styles.btnCancel}
                      onClick={() => {
                        setReplyingId(null);
                        setEditingId(null);
                        setReplyText('');
                      }}
                    >
                      Mégse
                    </button>
                    <button 
                      className={styles.btnReply}
                      onClick={() => handleSaveReply(review.id)}
                      disabled={!replyText.trim()}
                    >
                      Válasz mentése
                    </button>
                  </div>
                </div>
              )}

              {/* Akció gombok */}
              {replyingId !== review.id && editingId !== review.id && (
                <div className={styles.actionButtons}>
                  <button 
                    onClick={() => handleToggleApprove(review.id, review.approved)}
                    className={review.approved ? styles.btnReject : styles.btnApprove}
                  >
                    {review.approved ? 'Elrejtés' : 'Jóváhagyás'}
                  </button>

                  {!review.reply ? (
                    <button 
                      className={styles.btnReply}
                      onClick={() => {
                        setReplyingId(review.id);
                        setReplyText('');
                      }}
                    >
                      Válaszolok
                    </button>
                  ) : (
                    <>
                      <button 
                        className={styles.btnReply}
                        onClick={() => {
                          setEditingId(review.id);
                          setReplyText(review.reply || '');
                        }}
                      >
                        Válasz szerkesztése
                      </button>
                      <button 
                        className={styles.btnDelete}
                        onClick={() => handleDeleteReply(review.id)}
                      >
                        Válasz törlése
                      </button>
                    </>
                  )}

                  <button 
                    onClick={() => handleDelete(review.id)}
                    className={styles.btnDelete}
                  >
                    Vélemény törlése
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
