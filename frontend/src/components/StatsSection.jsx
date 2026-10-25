import React, { useEffect, useState, useRef } from 'react';
import { apiService } from '../services/api';

export default function StatsSection() {
  const [stats, setStats] = useState({
    registeredUmkm: 500,
    culinaryMenus: 10000,
    citiesCovered: '25+',
    satisfactionRate: '4.8/5'
  });

  const [counts, setCounts] = useState({
    umkm: 0,
    menus: 0
  });

  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    // Load live stats if available
    apiService.getStats().then((data) => {
      if (data) setStats(data);
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          const duration = 1800;
          const stepTime = 30;
          const totalSteps = duration / stepTime;
          const targetUmkm = typeof stats.registeredUmkm === 'number' ? stats.registeredUmkm : 500;
          const targetMenus = typeof stats.culinaryMenus === 'number' ? stats.culinaryMenus : 10000;

          const stepUmkm = targetUmkm / totalSteps;
          const stepMenus = targetMenus / totalSteps;

          let currentUmkm = 0;
          let currentMenus = 0;

          const timer = setInterval(() => {
            currentUmkm += stepUmkm;
            currentMenus += stepMenus;

            if (currentUmkm >= targetUmkm && currentMenus >= targetMenus) {
              setCounts({ umkm: targetUmkm, menus: targetMenus });
              clearInterval(timer);
            } else {
              setCounts({
                umkm: Math.floor(currentUmkm),
                menus: Math.floor(currentMenus)
              });
            }
          }, stepTime);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated, stats]);

  return (
    <section className="section stats-section" id="statistik" ref={sectionRef}>
      <div className="stats-bg-pattern"></div>
      <div className="container stats-container">
        <div className="section-header text-center stats-header">
          <div className="badge-pill badge-dark section-badge">
            <span>TERPERCAYA & BERDAMPAK</span>
          </div>
          <h2 className="section-title text-white">
            Bersama Delish House,<br />
            UMKM Kuliner Naik Kelas
          </h2>
        </div>

        {/* 4 Statistics Counters */}
        <div className="stats-grid">
          {/* Stat 1: UMKM Terdaftar */}
          <div className="stat-item">
            <div className="stat-top">
              <div className="stat-icon-wrapper stat-icon-blue">
                <i className="fa-solid fa-users"></i>
              </div>
              <div className="stat-number">
                {counts.umkm > 0 ? `${counts.umkm.toLocaleString('id-ID')}+` : '500+'}
              </div>
            </div>
            <div className="stat-label">UMKM Terdaftar</div>
          </div>

          {/* Stat 2: Menu Kuliner */}
          <div className="stat-item">
            <div className="stat-top">
              <div className="stat-icon-wrapper stat-icon-orange">
                <i className="fa-solid fa-heart"></i>
              </div>
              <div className="stat-number">
                {counts.menus > 0 ? `${counts.menus.toLocaleString('id-ID')}+` : '10.000+'}
              </div>
            </div>
            <div className="stat-label">Menu Kuliner</div>
          </div>

          {/* Stat 3: Kota & Kecamatan */}
          <div className="stat-item">
            <div className="stat-top">
              <div className="stat-icon-wrapper stat-icon-red">
                <i className="fa-solid fa-location-dot"></i>
              </div>
              <div className="stat-number">
                {stats.citiesCovered}
              </div>
            </div>
            <div className="stat-label">Kota & Kecamatan</div>
          </div>

          {/* Stat 4: Kepuasan Pengguna */}
          <div className="stat-item">
            <div className="stat-top">
              <div className="stat-icon-wrapper stat-icon-gold">
                <i className="fa-solid fa-star"></i>
              </div>
              <div className="stat-number">
                {stats.satisfactionRate}
              </div>
            </div>
            <div className="stat-label">Kepuasan Pengguna</div>
          </div>
        </div>
      </div>
    </section>
  );
}
