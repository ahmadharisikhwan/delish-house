import React, { useState, useEffect } from 'react';

export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      className={`back-to-top ${show ? 'show' : ''}`}
      id="backToTopBtn"
      aria-label="Kembali ke atas"
      onClick={scrollToTop}
    >
      <i className="fa-solid fa-arrow-up"></i>
    </button>
  );
}
