"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.css';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  // Görgetés figyelése
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Kattintás a menün kívülre
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  const closeMenu = () => setIsMobileMenuOpen(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/#') && pathname === '/') {
      e.preventDefault();
      const targetId = href.replace('/#', '');
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', href);
      }
      closeMenu();
    } else {
      closeMenu();
    }
  };

  const navLinks = [
    { name: 'Rólunk', href: '/#about' },
    { name: 'Galéria', href: '/galeria' },
    { name: 'Foglalási naptár', href: '/#calendar' },
    { name: 'Árak', href: '/arak' },
    { name: 'Kapcsolat', href: '/kapcsolat' },
  ];

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <Link href="/" className={styles.logoLink} onClick={closeMenu}>
          {/* A logo.png a public/images/hero/ mappába kerül majd */}
          <div className={`${styles.logoWrapper} ${isScrolled ? styles.logoScrolled : ''}`}>
             <img src="/images/hero/logo.png" alt="Harmónia Vendégház" className={styles.logoImage} onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<span style="font-size: 1.5rem; font-weight: bold; color: white;">Harmónia</span>'; }} />
          </div>
        </Link>

        {/* Asztali menü */}
        <nav className={styles.desktopNav}>
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}
              onClick={(e) => handleNavClick(e, link.href)}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Mobil hamburger ikon */}
        <button 
          ref={hamburgerRef}
          className={`${styles.hamburger} ${isMobileMenuOpen ? styles.hamburgerOpen : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Menü"
        >
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </button>

        {/* Mobil menü */}
        <div 
          ref={mobileMenuRef}
          className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}
        >
          <nav className={styles.mobileNav}>
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className={styles.mobileNavLink}
                onClick={(e) => handleNavClick(e, link.href)}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
