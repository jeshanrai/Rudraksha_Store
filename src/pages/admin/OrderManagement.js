import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './OrderManagement.css';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [summary, setSummary] = useState({ totalRevenue: 0, totalOrders: 0, totalProfit: 0 });
  const [dateFilter, setDateFilter] = useState({ startDate: '', endDate: '' });

  const { token, logout } = useAuth();

  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    totalAmount: '',
    customerName: '',
    customerPhone: '',
    address: '',
    notes: ''
  });

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, [currentPage, dateFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const base = process.env.REACT_APP_API_URL || '';
      // try admin route first, then fallback to non-admin route if 404
      const endpoints = [
        `${base}/api/orders?page=${currentPage}&limit=10`,
        `${base}/api/orders?page=${currentPage}&limit=10`
      ];

      // append date filter if provided
      const dateQuery = dateFilter.startDate && dateFilter.endDate
        ? `&startDate=${dateFilter.startDate}&endDate=${dateFilter.endDate}`
        : '';

      let response = null;
      let lastError = null;

      for (const urlBase of endpoints) {
        const url = `${urlBase}${dateQuery}`;
        try {
          response = await fetch(url, {
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
          });

          if (response.ok) break;

          if (response.status === 401) {
            // unauthorized: force logout and stop
            return logout();
          }

          if (response.status === 404) {
            // try next endpoint
            lastError = new Error(`Endpoint not found: ${url}`);
            console.warn(lastError.message);
            response = null;
            continue;
          }

          // try to read error body for better message
          const errBody = await response.json().catch(() => null);
          throw new Error(errBody?.message || `Request failed with status ${response.status}`);
        } catch (err) {
          lastError = err;
          // if it's a network error or unexpected, stop trying further
          if (!response && endpoints.indexOf(urlBase) === endpoints.length - 1) {
            // last attempt failed, rethrow
            throw err;
          }
          // otherwise continue to next endpoint
        }
      }

      if (!response) {
        throw lastError || new Error('Failed to fetch orders');
      }

      const data = await response.json();

      let totalProfit = 0;
      data.orders.forEach(order => {
        const product = order.productId;
        if (product && product.costPrice !== undefined) {
          const discountedPrice = product.sellingPrice * (1 - (product.discountRate || 0) / 100);
          const profit = (discountedPrice - product.costPrice) * order.quantity;
          totalProfit += profit;
        }
      });

      setOrders(data.orders);
      setPagination(data.pagination);
      setSummary({
        totalRevenue: data.summary?.totalRevenue || 0,
        totalOrders: data.summary?.totalOrders || 0,
        totalProfit
      });
    } catch (error) {
      console.error(error);
      setError(error.message || 'Failed to load order data');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/admin/products?limit=1000`,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/orders`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          quantity: parseInt(formData.quantity),
          totalAmount: parseFloat(formData.totalAmount)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add order');
      }

      await fetchOrders();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      productId: '',
      quantity: '',
      totalAmount: '',
      customerName: '',
      customerPhone: '',
      address: '',
      notes: ''
    });
  };

  const calculateTotal = (productId, quantity) => {
    const product = products.find(p => p._id === productId);
    if (product && quantity !== '') {
      const discountedPrice = product.sellingPrice * (1 - (product.discountRate || 0) / 100);
      const total = discountedPrice * parseInt(quantity);
      setFormData(prev => ({ ...prev, totalAmount: total.toFixed(2) }));
    } else {
      setFormData(prev => ({ ...prev, totalAmount: '' }));
    }
  };

  const handleProductChange = (productId) => {
    setFormData(prev => ({ ...prev, productId, totalAmount: '' }));
    if (formData.quantity !== '') {
      calculateTotal(productId, formData.quantity);
    }
  };

  const handleQuantityChange = (quantity) => {
    let qty = quantity === '' ? '' : parseInt(quantity);
    const selectedProduct = products.find(p => p._id === formData.productId);

    if (selectedProduct && qty > selectedProduct.stock) {
      setError(`Cannot exceed available stock (${selectedProduct.stock})`);
      return;
    } else {
      setError('');
    }

    setFormData(prev => ({ ...prev, quantity: qty }));
    if (formData.productId && qty !== '') {
      calculateTotal(formData.productId, qty);
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

  return (
    <div className="order-main">
      <div className="header">
        <h1>Order Management</h1>
        <button onClick={() => setShowModal(true)} className="btn-add">
          Add Order
        </button>
      </div>

      <div className="summary-cards">
        <div className="card">
          <p>Total Revenue</p>
          <h2>{formatCurrency(summary.totalRevenue)}</h2>
        </div>
        <div className="card">
          <p>Total Orders</p>
          <h2>{summary.totalOrders}</h2>
        </div>
        <div className="card">
          <p>Total Profit / Loss</p>
          <h2 style={{ color: summary.totalProfit >= 0 ? 'green' : 'red' }}>
            {formatCurrency(summary.totalProfit)}
          </h2>
        </div>
        <div className="card">
          <p>Avg Profit per Order</p>
          <h2>
            {summary.totalOrders > 0
              ? formatCurrency(summary.totalProfit / summary.totalOrders)
              : '₹0.00'}
          </h2>
        </div>
      </div>

      <div className="filter">
        <label>Start Date</label>
        <input
          type="date"
          value={dateFilter.startDate}
          onChange={(e) => setDateFilter({ ...dateFilter, startDate: e.target.value })}
        />
        <label>End Date</label>
        <input
          type="date"
          value={dateFilter.endDate}
          onChange={(e) => setDateFilter({ ...dateFilter, endDate: e.target.value })}
        />
        <button onClick={() => setDateFilter({ startDate: '', endDate: '' })}>Clear Filter</button>
      </div>

      <div className="orders-table">
        {loading ? (
          <div className="loading">Loading orders...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Amount</th>
                <th>Profit/Loss</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const product = order.productId;
                let profit = 0;
                if (product && product.costPrice !== undefined) {
                  const discountedPrice = product.sellingPrice * (1 - (product.discountRate || 0) / 100);
                  profit = (discountedPrice - product.costPrice) * order.quantity;
                }
                return (
                  <tr key={order._id}>
                    <td>{order._id.slice(-8).toUpperCase()}</td>
                    <td>{order.customerName || 'N/A'}</td>
                    <td>
                      {product?.name || 'Deleted'} - ₹
                      {product?.sellingPrice?.toFixed(2) || 'N/A'}
                      {product?.discountRate ? ` (-${product.discountRate}%)` : ''}
                    </td>
                    <td>{order.quantity}</td>
                    <td>{formatCurrency(order.totalAmount)}</td>
                    <td style={{ color: profit >= 0 ? 'green' : 'red' }}>
                      {formatCurrency(profit)}
                    </td>
                    <td>{formatDate(order.date)}</td>
                    <td>
                      <span className={`status ${order.status || 'pending'}`}>
                        {order.status || 'pending'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {pagination.totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={page === currentPage ? 'active' : ''}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add New Order</h2>
            <form onSubmit={handleSubmit}>
              <label>Customer Name *</label>
              <input
                type="text"
                required
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              />

              <label>Phone *</label>
              <input
                type="text"
                required
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
              />

              <label>Address *</label>
              <textarea
                rows="2"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />

              <label>Product *</label>
              <select
                required
                value={formData.productId}
                onChange={(e) => handleProductChange(e.target.value)}
              >
                <option value="">Select a product</option>
                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name} - ₹{product.sellingPrice.toFixed(2)} (Stock: {product.stock}) {product.discountRate ? ` -${product.discountRate}%` : ''}
                  </option>
                ))}
              </select>

              <label>Quantity *</label>
              <input
                type="number"
                min="1"
                required
                value={formData.quantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
              />
              {error && <div className="error-message">{error}</div>}

              <label>Total Amount (₹) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.totalAmount}
                onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
              />

              <label>Notes</label>
              <textarea
                rows="2"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Optional notes..."
              />

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit">Add Order</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
