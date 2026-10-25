import React from 'react';

export default function Footer() {
  return (
    <footer className="footer-wrapper" id="footer">
      <div className="container footer-container">
        <div className="footer-grid">
          {/* Col 1: Brand Info */}
          <div className="footer-col footer-col-brand">
            <a href="#beranda" className="footer-logo-link">
              <img src="/assets/logo.webp" alt="Delish House Logo" className="footer-logo" />
            </a>
            <p className="footer-brand-desc">
              Platform UMKM kuliner berbasis AI untuk mendukung pedagang mikro di Indonesia.
            </p>
          </div>

          {/* Col 2: Menu Links */}
          <div className="footer-col footer-col-menu">
            <h4 className="footer-col-title">Menu</h4>
            <ul className="footer-nav-list">
              <li><a href="#beranda" className="footer-link">Beranda</a></li>
              <li><a href="#masalah" className="footer-link">Fitur</a></li>
              <li><a href="#solusi" className="footer-link">Manfaat</a></li>
              <li><a href="#ai-tools" className="footer-link">Fitur AI</a></li>
              <li><a href="#katalog" className="footer-link">Katalog Kuliner</a></li>
              <li><a href="#footer" className="footer-link">Tentang Kami</a></li>
            </ul>
          </div>

          {/* Col 3: Contact */}
          <div className="footer-col footer-col-contact">
            <h4 className="footer-col-title">Kontak</h4>
            <ul className="footer-contact-list">
              <li className="contact-item">
                <i className="fa-regular fa-envelope"></i>
                <a href="mailto:anomali@delishhouse.id">anomali@delishhouse.id</a>
              </li>
              <li className="contact-item">
                <i className="fa-solid fa-location-dot"></i>
                <span>Sidoarjo, Indonesia</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Social Media */}
          <div className="footer-col footer-col-social">
            <h4 className="footer-col-title">Ikuti Kami</h4>
            <div className="social-links">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-circle"
                aria-label="Instagram Delish House"
              >
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-circle"
                aria-label="YouTube Delish House"
              >
                <i className="fa-brands fa-youtube"></i>
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-circle"
                aria-label="TikTok Delish House"
              >
                <i className="fa-brands fa-tiktok"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom">
          <p className="copyright-text">
            &copy; 2026 Delish House. Dibuat oleh <strong>Tim Anomali – SMK Antartika 1 Sidoarjo</strong>.
          </p>
        </div>
      </div>
    </footer>
  );
}
