import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminDashboardPage.css';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockProducts: 0,
    monthlySales: 0,
    monthlyRevenue: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { user, logout, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch dashboard stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error(error);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  if (loading) {
    return <div className="loader"></div>;
  }

  return (
    <div className="admin-dashboard">
      <nav className="navbar">
        <h1>Admin Dashboard</h1>
        <div className="nav-right">
          <span>Welcome, {user?.firstName || user?.username}</span>
          <button onClick={handleLogout} className="btn btn-red">Logout</button>
        </div>
      </nav>

      <div className="dashboard-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <Link to="/admin/dashboard" className="sidebar-link active">Dashboard</Link>
          <Link to="/admin/inventory" className="sidebar-link">Inventory Management</Link>
          <Link to="/admin/sales" className="sidebar-link">Sales Management</Link>
        </aside>

        {/* Main content */}
        <main className="main-content">
          {error && <div className="error">{error}</div>}

          <div className="stats-grid">
            <div className="stat-card">
              <p>Total Products</p>
              <h2>{stats.totalProducts}</h2>
            </div>
            <div className="stat-card">
              <p>Low Stock Alert</p>
              <h2>{stats.lowStockProducts}</h2>
            </div>
            <div className="stat-card">
              <p>Monthly Sales</p>
              <h2>{stats.monthlySales}</h2>
            </div>
            <div className="stat-card">
              <p>Monthly Revenue</p>
              <h2>{formatCurrency(stats.monthlyRevenue)}</h2>
            </div>
          </div>

          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <div className="actions-grid">
              <Link to="/admin/inventory" className="action-card">Add Product</Link>
              <Link to="/admin/sales" className="action-card">Add Sale</Link>
              <Link to="/admin/inventory" className="action-card">View Inventory</Link>
              <Link to="/admin/sales" className="action-card">View Sales</Link>
            </div>
          </div>

          <div className="summary-cards">
            <div className="summary-card">
              <h2>{formatCurrency(stats.totalRevenue)}</h2>
              <p>Total Revenue</p>
            </div>
            <div className="summary-card">
              <h2>{stats.monthlySales}</h2>
              <p>Sales This Month</p>
            </div>
            <div className="summary-card">
              <h2>{stats.lowStockProducts}</h2>
              <p>Items Need Restocking</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
