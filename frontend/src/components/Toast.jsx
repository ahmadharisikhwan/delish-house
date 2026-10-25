import React from 'react';

export default function Toast({ show, message }) {
  return (
    <div className={`toast-notification ${show ? 'show' : ''}`} id="toastNotification">
      <div className="toast-icon">
        <i className="fa-solid fa-circle-check"></i>
      </div>
      <div className="toast-content">
        <div className="toast-title">Pemberitahuan</div>
        <div className="toast-msg">{message || 'Operasi berhasil dilakukan.'}</div>
      </div>
    </div>
  );
}
