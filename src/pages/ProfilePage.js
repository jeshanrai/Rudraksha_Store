import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Notification from '../components/Notification';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('orders'); // default to orders
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

useEffect(() => {
  if (location.state?.notification) {
    setNotification(location.state.notification);

    // Clear the notification from history state so it doesn't persist on reload
    window.history.replaceState({}, document.title);
  }
}, [location.state]);

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        // Load user from localStorage
        const stored = JSON.parse(localStorage.getItem('user') || 'null');
        const token = localStorage.getItem('userToken');
        if (!stored || !stored.id) return;
        if (mounted) setUserData(stored);

        // Fetch orders for this user with proper Authorization header
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/orders/my-orders?userId=${stored.id}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : ''
          }
        });

        const data = await res.json();

        if (mounted && data.success) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadProfile();
    return () => (mounted = false);
  }, []);

  // Redirect if not logged in
  if (!user) return <Navigate to="/login" replace />;

  if (loading) return <div className="profile-page"><p>Loading...</p></div>;

  return (
    <div className="profile-page">
      <div className="container">

        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}

        <div className="profile-layout">

          {/* Sidebar */}
          <div className="profile-sidebar">
            <div className="profile-header">
              <div className="profile-avatar">
                <User className="avatar-icon" />
              </div>
              <h2 className="profile-name">{userData?.firstName} {userData?.lastName}</h2>
              <p className="profile-email">{userData?.email}</p>
            </div>

            <div className="profile-menu">
              <button
                className={`menu-item ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                Order History
              </button>

              <button onClick={logout} className="menu-item logout-btn">
                Logout
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="profile-content">
            {/* Orders Section */}
            {activeTab === 'orders' && (
              <div className="orders-section">
                <h3 className="section-title">Order History</h3>
                
                <div className="orders-list">
                  {orders.length > 0 ? (
                    orders.map(order => (
                      <div key={order._id} className="order-card">
                        <div className="order-header">
                          <div>
                            <h4 className="order-id">Order #{order._id.slice(-6)}</h4>
                            <p className="order-date">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>

                          <span className={`order-status ${(order.orderStatus || 'Pending').toLowerCase()}`}>
                            {order.orderStatus || 'Pending'}
                          </span>
                        </div>

                        <p className="order-items">
                          Items: {order.orderItems.map(item => item.name).join(', ')}
                        </p>

                        <p className="order-total">Total: ₹{order.totalAmount}</p>
                      </div>
                    ))
                  ) : (
                    <p className="no-orders">No orders found.</p>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
