import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProblemSection from './components/ProblemSection';
import SolutionSection from './components/SolutionSection';
import FeaturesSection from './components/FeaturesSection';
import AiToolsSection from './components/AiToolsSection';
import MerchantCatalog from './components/MerchantCatalog';
import WorkflowSection from './components/WorkflowSection';
import StatsSection from './components/StatsSection';
import CtaBanner from './components/CtaBanner';
import Footer from './components/Footer';
import RegisterModal from './components/RegisterModal';
import Toast from './components/Toast';
import BackToTop from './components/BackToTop';

// Dedicated Dashboards for Buyer and Seller
import SellerDashboard from './pages/SellerDashboard';
import BuyerPortal from './pages/BuyerPortal';

export default function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'seller' | 'buyer'
  const [currentUser, setCurrentUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });

  // Load saved session if exists
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('delish_user');
      const savedView = localStorage.getItem('delish_view');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setCurrentUser(parsed);
        if (savedView && (savedView === 'seller' || savedView === 'buyer')) {
          setCurrentView(savedView);
        }
      }
    } catch (e) {
      console.warn('Could not read user session:', e);
    }
  }, []);

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 4500);
  };

  const persistSession = (user, view) => {
    try {
      if (user) {
        localStorage.setItem('delish_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('delish_user');
      }

      if (view) {
        localStorage.setItem('delish_view', view);
      } else {
        localStorage.removeItem('delish_view');
      }
    } catch (e) {
      console.warn('Could not save session:', e);
    }
  };

  const handleLoginSuccess = (user) => {
    const targetView = user.role === 'seller' ? 'seller' : 'buyer';
    setCurrentUser(user);
    setCurrentView(targetView);
    persistSession(user, targetView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('landing');
    persistSession(null, 'landing');
    showToast('Anda telah keluar dari sesi.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSwitchToSeller = () => {
    const updatedUser = currentUser ? { ...currentUser, role: 'seller' } : {
      role: 'seller',
      id: 1,
      merchantId: 1,
      name: 'Kupang Lontong Pak Misari',
      city: 'Sidoarjo'
    };
    setCurrentUser(updatedUser);
    setCurrentView('seller');
    persistSession(updatedUser, 'seller');
    showToast('Beralih ke Portal Mitra Penjual (UMKM) 🏪');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSwitchToBuyer = () => {
    const updatedUser = currentUser ? { ...currentUser, role: 'buyer' } : {
      role: 'buyer',
      name: 'Pencinta Kuliner',
      city: 'Sidoarjo'
    };
    setCurrentUser(updatedUser);
    setCurrentView('buyer');
    persistSession(updatedUser, 'buyer');
    showToast('Beralih ke Portal Pembeli & Konsumen 🛍️');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    setCurrentView('landing');
    persistSession(currentUser, 'landing');
    if (window.location.hash !== '#beranda') {
      window.location.hash = 'beranda';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="delish-app">
      {/* 1. SELLER DASHBOARD VIEW */}
      {currentView === 'seller' && (
        <SellerDashboard
          currentUser={currentUser}
          onLogout={handleLogout}
          onSwitchToBuyer={handleSwitchToBuyer}
          onGoHome={handleGoHome}
          onShowToast={showToast}
        />
      )}

      {/* 2. BUYER PORTAL VIEW */}
      {currentView === 'buyer' && (
        <BuyerPortal
          currentUser={currentUser}
          onLogout={handleLogout}
          onSwitchToSeller={handleSwitchToSeller}
          onGoHome={handleGoHome}
          onShowToast={showToast}
        />
      )}

      {/* 3. DEFAULT LANDING PAGE VIEW */}
      {currentView === 'landing' && (
        <>
          {/* Top Banner if user is already logged in */}
          {currentUser && (
            <div className="logged-in-quick-bar">
              <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.88rem' }}>
                  👋 Anda sedang masuk sebagai: <strong>{currentUser.name}</strong> ({currentUser.role === 'seller' ? 'Penjual' : 'Pembeli'})
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className="quick-bar-btn"
                    onClick={() => setCurrentView(currentUser.role === 'seller' ? 'seller' : 'buyer')}
                  >
                    Buka Halaman {currentUser.role === 'seller' ? 'Penjual' : 'Pembeli'} &rarr;
                  </button>
                  <button
                    type="button"
                    className="quick-bar-btn-logout"
                    onClick={handleLogout}
                  >
                    Keluar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Navbar Header */}
          <Navbar
            currentUser={currentUser}
            onOpenRegister={() => setModalOpen(true)}
            onOpenSellerPortal={handleSwitchToSeller}
            onOpenBuyerPortal={handleSwitchToBuyer}
          />

          <main>
            {/* Hero Section */}
            <Hero
              onOpenRegister={() => setModalOpen(true)}
              onExplore={() => scrollToSection('katalog')}
            />

            {/* Problem Section */}
            <ProblemSection />

            {/* Solution Section */}
            <SolutionSection
              onOpenRegister={() => setModalOpen(true)}
              onScrollToFeatures={() => scrollToSection('fitur')}
            />

            {/* Features Section */}
            <FeaturesSection />

            {/* Live Interactive AI Capabilities */}
            <AiToolsSection onShowToast={showToast} />

            {/* Live UMKM Culinary Catalog (from Database) */}
            <MerchantCatalog />

            {/* 3 Steps Workflow */}
            <WorkflowSection />

            {/* Stats & Impact Section */}
            <StatsSection />

            {/* Call to Action Banner */}
            <CtaBanner
              onOpenRegister={() => setModalOpen(true)}
              onExplore={() => scrollToSection('ai-tools')}
            />
          </main>

          {/* Footer */}
          <Footer />
        </>
      )}

      {/* Interactive Registration / Login Modal (Pembeli vs Penjual) */}
      <RegisterModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onShowToast={showToast}
      />

      {/* Toast Notification */}
      <Toast show={toast.show} message={toast.message} />

      {/* Back To Top Floating Action */}
      <BackToTop />
    </div>
  );
}
