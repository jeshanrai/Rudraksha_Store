import React, { useEffect, useState } from 'react';
import './Notification.css';

const Notification = ({
  id,
  message,
  type = 'success',
  onClose,
  duration = 3000,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => handleClose(), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onClose(id), 300); // wait for hide animation
  };

  return (
    <div
      className={`notification ${type} ${visible ? 'show' : 'hide'}`}
      role="alert"
    >
      <span className="notification-message">{message}</span>
      <button
        className="notification-close"
        onClick={handleClose}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};

export default Notification;
