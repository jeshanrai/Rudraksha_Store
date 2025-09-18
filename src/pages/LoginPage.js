import React from 'react';
import { User } from 'lucide-react';

const ProfilePage = ({ user, setUser, setCurrentPage }) => {
  if (!user) {
    setCurrentPage('login');
    return null;
  }

  const mockOrders = [
    {
      id: 'ORD001',
      date: '2024-01-15',
      status: 'Delivered',
      total: 1299,
      items: ['5 Mukhi Rudraksha', '6 Mukhi Rudraksha']
    },
    {
      id: 'ORD002',
      date: '2024-01-10',
      status: 'Processing',
      total: 599,
      items: ['7 Mukhi Rudraksha']
    }
  ];

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-layout">
          <div className="profile-sidebar">
            <div className="profile-header">
              <div className="profile-avatar">
                <User className="avatar-icon" />
              </div>
              <h2 className="profile-name">{user.name}</h2>
              <p className="profile-email">{user.email}</p>
            </div>
            
            <div className="profile-menu">
              <button className="menu-item">Profile Settings</button>
              <button className="menu-item">Order History</button>
              <button className="menu-item">Wishlist</button>
              <button 
                onClick={() => {
                  setUser(null);
                  setCurrentPage('home');
                }}
                className="menu-item logout-btn"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="profile-content">
            <div className="orders-section">
              <h3 className="section-title">Order History</h3>
              
              <div className="orders-list">
                {mockOrders.map(order => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <div>
                        <h4 className="order-id">Order #{order.id}</h4>
                        <p className="order-date">{order.date}</p>
                      </div>
                      <span className={`order-status ${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="order-items">Items: {order.items.join(', ')}</p>
                    <p className="order-total">Total: ₹{order.total}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;