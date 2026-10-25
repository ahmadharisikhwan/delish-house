import React, { useState, useEffect } from 'react';

export default function Navbar({ onOpenRegister }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('beranda');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);

      const sections = ['beranda', 'masalah', 'solusi', 'fitur', 'ai-tools', 'katalog', 'cara-kerja', 'statistik', 'footer'];
      const scrollPos = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <header className={`navbar-wrapper ${scrolled ? 'scrolled' : ''}`} id="navbar">
      <div className="container nav-container">
        <a href="#beranda" className="logo-link" aria-label="Delish House Beranda">
          <img src="/assets/logo.webp" alt="Delish House Logo" className="brand-logo" />
        </a>

        {/* Desktop Navigation Menu */}
        <nav className={`nav-menu ${mobileMenuOpen ? 'mobile-open' : ''}`} id="navMenu">
          <ul className="nav-list">
            <li className="nav-item">
              <a
                href="#beranda"
                className={`nav-link ${activeSection === 'beranda' ? 'active' : ''}`}
                onClick={closeMobile}
              >
                Beranda
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#masalah"
                className={`nav-link ${activeSection === 'masalah' ? 'active' : ''}`}
                onClick={closeMobile}
              >
                Fitur
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#solusi"
                className={`nav-link ${activeSection === 'solusi' ? 'active' : ''}`}
                onClick={closeMobile}
              >
                Manfaat
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#ai-tools"
                className={`nav-link ${activeSection === 'ai-tools' ? 'active' : ''}`}
                onClick={closeMobile}
              >
                Fitur AI
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#katalog"
                className={`nav-link ${activeSection === 'katalog' ? 'active' : ''}`}
                onClick={closeMobile}
              >
                Katalog Kuliner
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#statistik"
                className={`nav-link ${activeSection === 'statistik' ? 'active' : ''}`}
                onClick={closeMobile}
              >
                Testimoni
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#footer"
                className={`nav-link ${activeSection === 'footer' ? 'active' : ''}`}
                onClick={closeMobile}
              >
                Tentang Kami
              </a>
            </li>
          </ul>
        </nav>

        {/* Navbar Action */}
        <div className="nav-actions">
          <button
            type="button"
            className="btn btn-primary nav-btn"
            id="btnNavRegister"
            onClick={onOpenRegister}
          >
            <span>Mulai Gratis</span>
            <i className="fa-solid fa-arrow-right"></i>
          </button>

          {/* Mobile Hamburger Button */}
          <button
            className="hamburger-btn"
            id="hamburgerBtn"
            aria-label="Buka Menu Navigasi"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </div>
      </div>
    </header>
  );
}
