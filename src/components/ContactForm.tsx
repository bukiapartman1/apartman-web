"use client";

import { useState } from 'react';
import Link from 'next/link';
import { siteConfig } from '@/lib/siteConfig';
import styles from '../app/kapcsolat/kapcsolat.module.css';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedPrivacy) return;

    setStatus('loading');

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'CONTACT',
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          comment: formData.message
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: ''
        });
        setAcceptedPrivacy(false);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      setStatus('error');
    }
  };

  return (
    <div className={styles.formCard}>
      <h2 className={styles.formTitle}>Írjon nekünk üzenetet</h2>
      <form onSubmit={handleSubmit} id="contact-form">
        <div className={styles.formGroup}>
          <label htmlFor="name-input" className={styles.formLabel}>Név *</label>
          <input
            type="text"
            id="name-input"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Az Ön neve"
            className={styles.formInput}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email-input" className={styles.formLabel}>E-mail cím *</label>
          <input
            type="email"
            id="email-input"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="pelda@email.hu"
            className={styles.formInput}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="phone-input" className={styles.formLabel}>Telefonszám (opcionális)</label>
          <input
            type="tel"
            id="phone-input"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+36 30 123 4567"
            className={styles.formInput}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="message-input" className={styles.formLabel}>Üzenet *</label>
          <textarea
            id="message-input"
            name="message"
            required
            value={formData.message}
            onChange={handleChange}
            placeholder="Kérdése van? Írja meg nekünk..."
            className={styles.formTextarea}
          />
        </div>

        {/* GDPR Adatkezelési hozzájárulás */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', margin: '15px 0' }}>
          <input 
            type="checkbox" 
            id="contact-privacy-check" 
            checked={acceptedPrivacy}
            onChange={(e) => setAcceptedPrivacy(e.target.checked)}
            required
            style={{ marginTop: '4px', cursor: 'pointer', accentColor: '#c5a880' }}
          />
          <label htmlFor="contact-privacy-check" style={{ fontSize: '0.85rem', color: '#aaa', cursor: 'pointer', lineHeight: '1.4' }}>
            Elolvastam és elfogadom a <Link href="/adatkezeles" target="_blank" style={{ color: '#c5a880', textDecoration: 'underline' }}>{siteConfig.shortName} Adatkezelési tájékoztatóját</Link>, és hozzájárulok a megadott adataim kezeléséhez a kapcsolatfelvétel céljából. *
          </label>
        </div>

        <button 
          type="submit" 
          id="submit-contact-btn"
          disabled={status === 'loading' || !acceptedPrivacy} 
          className={styles.submitBtn}
        >
          {status === 'loading' ? 'Küldés folyamatban...' : 'Üzenet elküldése'}
        </button>

        {status === 'success' && (
          <div className={`${styles.statusMessage} ${styles.success}`} id="contact-success-msg">
            Köszönjük! Az üzenetét sikeresen megkaptuk, hamarosan válaszolunk Önnek a megadott e-mail címen.
          </div>
        )}

        {status === 'error' && (
          <div className={`${styles.statusMessage} ${styles.error}`} id="contact-error-msg">
            Hiba történt az üzenet küldése során. Kérjük, próbálja meg később vagy hívjon minket telefonon!
          </div>
        )}
      </form>
    </div>
  );
}
