import React, { useEffect } from 'react';
import './Modal.css'

const Modal = ({ onClose, children }) => {
  const handleKeyDown = (event) => {
    if (event.keyCode === 27) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close-button" onClick={onClose}>
          X 
        </button>
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
};  

export default Modal;
