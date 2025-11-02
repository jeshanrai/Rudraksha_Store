import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Load user + orders from backend
  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        // ✅ Load user from localStorage
        const stored = JSON.parse(localStorage.getItem('user') || 'null');
        if (mounted) setUserData(stored);

        // ✅ Fetch user orders
        const token = localStorage.getItem("token");

        const res = await fetch('http://localhost:5000/api/orders/my-orders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  // ✅ Redirect if not logged in
  if (!user) return <Navigate to="/login" replace />;

  if (loading) return <div className="profile-page"><p>Loading...</p></div>;

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-layout">
          
          {/* ✅ Sidebar */}
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
                className={`menu-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                Profile
              </button>

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

          {/* ✅ Main Content */}
          <div className="profile-content">

            {/* ✅ Profile Section */}
            {activeTab === 'profile' && userData && (
              <div className="profile-info-section">
                <h3 className="section-title">My Profile</h3>
                <p><strong>First Name:</strong> {userData.firstName}</p>
                <p><strong>Last Name:</strong> {userData.lastName}</p>
                <p><strong>Email:</strong> {userData.email}</p>
                <p><strong>Phone:</strong> {userData.phone || 'N/A'}</p>
                <p><strong>Joined:</strong> {new Date(userData.createdAt).toLocaleDateString()}</p>
              </div>
            )}

            {/* ✅ Orders Section */}
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
