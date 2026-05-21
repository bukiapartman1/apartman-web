"use client";

import { useState } from 'react';
import styles from '../app/kapcsolat/kapcsolat.module.css';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  
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
          comment: formData.message // Using comment field for email backend
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
            placeholder="Az Ön e-mail címe"
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
            placeholder="Ide írja az üzenetét..."
            className={styles.formTextarea}
          />
        </div>

        <button 
          type="submit" 
          id="submit-contact-btn"
          disabled={status === 'loading'} 
          className={styles.submitBtn}
        >
          {status === 'loading' ? 'Küldés folyamatban...' : 'Üzenet elküldése'}
        </button>

        {status === 'success' && (
          <div className={`${styles.statusMessage} ${styles.success}`} id="contact-success-msg">
            Köszönjük! Az üzenetét sikeresen elküldtük. Hamarosan válaszolunk.
          </div>
        )}

        {status === 'error' && (
          <div className={`${styles.statusMessage} ${styles.error}`} id="contact-error-msg">
            Hiba történt az üzenet küldése során. Kérjük, próbálja meg később vagy lépjen velünk kapcsolatba telefonon!
          </div>
        )}
      </form>
    </div>
  );
}
