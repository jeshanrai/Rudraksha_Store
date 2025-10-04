// src/pages/admin/DashboardPage.js
import React, { useEffect, useState } from 'react';
import './AdminDashboardPage.css';

const DashboardPage = ({ token }) => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockProducts: 0,
    monthlySales: 0,
    monthlyRevenue: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/dashboard/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, [token]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  if (loading) return <div className="loader"></div>;

  return (
    <>
  <div className="dp-stats-grid">
  <div className="dp-stat-card"><p>Total Products</p><h2>{stats.totalProducts}</h2></div>
  <div className="dp-stat-card"><p>Low Stock Alert</p><h2>{stats.lowStockProducts}</h2></div>
  <div className="dp-stat-card"><p>Monthly Sales</p><h2>{stats.monthlySales}</h2></div>
  <div className="dp-stat-card"><p>Monthly Revenue</p><h2>{formatCurrency(stats.monthlyRevenue)}</h2></div>
</div>

<div className="dp-summary-cards">
  <div className="dp-summary-card"><h2>{formatCurrency(stats.totalRevenue)}</h2><p>Total Revenue</p></div>
  <div className="dp-summary-card"><h2>{stats.monthlySales}</h2><p>Sales This Month</p></div>
  <div className="dp-summary-card"><h2>{stats.lowStockProducts}</h2><p>Items Need Restocking</p></div>
</div>

    </>
  );
};

export default DashboardPage;
