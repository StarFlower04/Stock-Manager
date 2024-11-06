// src/components/LogoutConfirmationModal.js
import React from 'react';
import './LogoutConfirmationModal.css';

const LogoutConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) {
    return null;
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Confirm Logout</h2>
        <p>Are you sure you want to log out?</p>
        <div className="modal-buttons">
          <button className="confirm-button" onClick={onConfirm}>Yes</button>
          <button className="cancel-button" onClick={onClose}>No</button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmationModal;