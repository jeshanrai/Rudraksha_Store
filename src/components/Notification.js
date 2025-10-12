import React, { useEffect, useState } from 'react';
import './Notification.css';

const Notification = ({ message, type = 'success', onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Slide in
    setVisible(true);

    const timer = setTimeout(() => handleClose(), 2000); // auto close after 3 sec
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300); // wait for animation
  };

  return (
    <div className={`notification ${type} ${visible ? 'show' : 'hide'}`}>
      <span className="notification-message">{message}</span>
      <button className="notification-close" onClick={handleClose} aria-label="Close notification">
        ×
      </button>
    </div>
  );
};

export default Notification;
